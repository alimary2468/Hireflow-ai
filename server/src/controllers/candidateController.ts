import { Request, Response } from 'express';
import path from 'path';
import { prisma } from '../db/prisma';
import { extractTextFromFile } from '../services/textExtractor';
import { parseCVText } from '../services/ai/cvParserAgent';
import { runCandidateScreeningAgent } from '../services/ai/screeningAgent';
import { sendSlackNotification } from '../services/slackService';
import { sendHrScreeningAlertEmail } from '../services/emailService';

export async function uploadAndScreenCV(req: Request, res: Response) {
  try {
    const file = req.file;
    const { jobId } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }

    if (!jobId) {
      return res.status(400).json({ error: 'Target Job ID must be specified for screening' });
    }

    // 1. Fetch Target Job
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ error: 'Target job position not found' });
    }

    const jobReqs = {
      id: job.id,
      title: job.title,
      department: job.department,
      experienceRequired: job.experienceRequired,
      minExperienceYears: job.minExperienceYears,
      description: job.description,
      requiredSkills: JSON.parse(job.requiredSkills || '[]'),
      preferredSkills: JSON.parse(job.preferredSkills || '[]'),
      educationRequirements: job.educationRequirements,
    };

    // 2. Extract Text from File
    const filePath = file.path;
    const rawText = await extractTextFromFile(filePath);

    // 3. Agent 1: Parse CV Text
    const parsedCv = await parseCVText(rawText, file.originalname);

    // 4. Create Candidate Record
    const candidate = await prisma.candidate.create({
      data: {
        name: parsedCv.name,
        email: parsedCv.email,
        phone: parsedCv.phone,
        location: parsedCv.location,
        linkedin: parsedCv.linkedin,
        github: parsedCv.github,
        portfolio: parsedCv.portfolio,
        cvFileUrl: `/uploads/${path.basename(file.path)}`,
        cvFileName: file.originalname,
        parsedData: JSON.stringify(parsedCv),
        rawText: rawText.substring(0, 5000),
        totalExperienceYears: parsedCv.totalExperienceYears,
        status: 'SCREENING',
      },
    });

    // 5. Create Application Link
    await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        status: 'SCREENING',
      },
    });

    // 6. Agent 2 & 3: Run AI Candidate Screening Agent
    const screening = await runCandidateScreeningAgent(parsedCv, jobReqs, rawText);

    // 7. Store Screening Result
    const screeningRecord = await prisma.screeningResult.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        overallScore: screening.overallScore,
        skillsScore: screening.skillsScore,
        experienceScore: screening.experienceScore,
        educationScore: screening.educationScore,
        projectScore: screening.projectScore,
        qualificationScore: screening.qualificationScore,
        recommendation: screening.recommendation,
        strengths: JSON.stringify(screening.strengths),
        missingRequirements: JSON.stringify(screening.missingRequirements),
        matchingSkills: JSON.stringify(screening.matchingSkills),
        riskFlags: JSON.stringify(screening.riskFlags),
        summary: screening.summary,
        interviewRecommended: screening.interviewRecommended,
      },
    });

    // 8. Update Candidate Final Category Status
    let finalStatus = screening.recommendation;
    if (screening.recommendation === 'STRONG_MATCH' && screening.interviewRecommended) {
      finalStatus = 'INTERVIEW_RECOMMENDED';
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: finalStatus },
    });

    // 9. Dispatch Notifications
    await prisma.notification.create({
      data: {
        type: 'CANDIDATE_SCREENED',
        title: `Screened: ${candidate.name} (${job.title})`,
        message: `${candidate.name} scored ${screening.overallScore}/100. Category: ${screening.recommendation.replace('_', ' ')}.`,
      },
    });

    if (screening.overallScore >= 85) {
      sendSlackNotification(candidate.name, job.title, screening.overallScore, candidate.id);
      sendHrScreeningAlertEmail({
        hrEmail: 'hr@company.com',
        candidateName: candidate.name,
        jobTitle: job.title,
        overallScore: screening.overallScore,
        recommendation: screening.recommendation,
        candidateId: candidate.id,
      });
    }

    return res.status(201).json({
      candidate: {
        ...updatedCandidate,
        parsedData: JSON.parse(updatedCandidate.parsedData),
      },
      screeningResult: {
        ...screeningRecord,
        strengths: JSON.parse(screeningRecord.strengths),
        missingRequirements: JSON.parse(screeningRecord.missingRequirements),
        matchingSkills: JSON.parse(screeningRecord.matchingSkills),
        riskFlags: JSON.parse(screeningRecord.riskFlags),
      },
      job: {
        id: job.id,
        title: job.title,
      },
    });
  } catch (error: any) {
    console.error('Error uploading/screening CV:', error);
    return res.status(500).json({ error: `CV Processing Failed: ${error.message}` });
  }
}

export async function getCandidates(req: Request, res: Response) {
  try {
    const { jobId, status, search, sortBy } = req.query;

    const whereClause: any = {};

    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }

    if (jobId && typeof jobId === 'string' && jobId !== 'ALL') {
      whereClause.applications = {
        some: { jobId: jobId },
      };
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      whereClause.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { parsedData: { contains: q } },
      ];
    }

    const candidates = await prisma.candidate.findMany({
      where: whereClause,
      include: {
        screeningResults: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { job: { select: { id: true, title: true, department: true } } },
        },
        interviews: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = candidates.map((cand) => {
      const latestScreening = cand.screeningResults[0] || null;
      let parsed = {};
      try {
        parsed = JSON.parse(cand.parsedData || '{}');
      } catch (e) {
        parsed = {};
      }

      return {
        id: cand.id,
        name: cand.name,
        email: cand.email,
        phone: cand.phone,
        location: cand.location,
        linkedin: cand.linkedin,
        github: cand.github,
        portfolio: cand.portfolio,
        cvFileUrl: cand.cvFileUrl,
        cvFileName: cand.cvFileName,
        parsedData: parsed,
        totalExperienceYears: cand.totalExperienceYears,
        status: cand.status,
        createdAt: cand.createdAt,
        latestScreening: latestScreening
          ? {
              ...latestScreening,
              strengths: JSON.parse(latestScreening.strengths || '[]'),
              missingRequirements: JSON.parse(latestScreening.missingRequirements || '[]'),
              matchingSkills: JSON.parse(latestScreening.matchingSkills || '[]'),
              riskFlags: JSON.parse(latestScreening.riskFlags || '[]'),
            }
          : null,
        latestInterview: cand.interviews[0] || null,
      };
    });

    // Custom sorting
    if (sortBy === 'score_desc') {
      formatted.sort((a, b) => (b.latestScreening?.overallScore || 0) - (a.latestScreening?.overallScore || 0));
    } else if (sortBy === 'skills_desc') {
      formatted.sort((a, b) => (b.latestScreening?.skillsScore || 0) - (a.latestScreening?.skillsScore || 0));
    } else if (sortBy === 'experience_desc') {
      formatted.sort((a, b) => b.totalExperienceYears - a.totalExperienceYears);
    }

    return res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ error: 'Failed to fetch candidates' });
  }
}

export async function getCandidateById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: { job: true },
        },
        screeningResults: {
          include: { job: true },
          orderBy: { createdAt: 'desc' },
        },
        interviews: {
          include: { job: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    let parsed = {};
    try {
      parsed = JSON.parse(candidate.parsedData || '{}');
    } catch (e) {
      parsed = {};
    }

    const formattedScreenings = candidate.screeningResults.map((s) => ({
      ...s,
      strengths: JSON.parse(s.strengths || '[]'),
      missingRequirements: JSON.parse(s.missingRequirements || '[]'),
      matchingSkills: JSON.parse(s.matchingSkills || '[]'),
      riskFlags: JSON.parse(s.riskFlags || '[]'),
    }));

    return res.json({
      ...candidate,
      parsedData: parsed,
      screeningResults: formattedScreenings,
    });
  } catch (error: any) {
    console.error('Error fetching candidate profile:', error);
    return res.status(500).json({ error: 'Failed to fetch candidate details' });
  }
}

export async function updateCandidateStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.candidate.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  } catch (error: any) {
    console.error('Error updating candidate status:', error);
    return res.status(500).json({ error: 'Failed to update candidate status' });
  }
}
