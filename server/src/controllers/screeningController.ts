import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { runCandidateScreeningAgent } from '../services/ai/screeningAgent';
import { parseCVText } from '../services/ai/cvParserAgent';

export async function triggerScreeningForCandidate(req: Request, res: Response) {
  try {
    const { candidateId } = req.params;
    const { jobId } = req.body;

    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    let targetJobId = jobId;
    if (!targetJobId) {
      const app = await prisma.application.findFirst({ where: { candidateId } });
      targetJobId = app?.jobId;
    }

    if (!targetJobId) return res.status(400).json({ error: 'Job ID required to run screening' });

    const job = await prisma.job.findUnique({ where: { id: targetJobId } });
    if (!job) return res.status(404).json({ error: 'Job position not found' });

    const parsedCv = JSON.parse(candidate.parsedData || '{}');
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

    const screening = await runCandidateScreeningAgent(parsedCv, jobReqs, candidate.rawText || '');

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

    await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: screening.recommendation },
    });

    return res.json({
      ...screeningRecord,
      strengths: JSON.parse(screeningRecord.strengths),
      missingRequirements: JSON.parse(screeningRecord.missingRequirements),
      matchingSkills: JSON.parse(screeningRecord.matchingSkills),
      riskFlags: JSON.parse(screeningRecord.riskFlags),
    });
  } catch (error: any) {
    console.error('Error triggering candidate screening:', error);
    return res.status(500).json({ error: 'Screening evaluation failed' });
  }
}

export async function getJobRankings(req: Request, res: Response) {
  try {
    const { jobId } = req.params;

    const results = await prisma.screeningResult.findMany({
      where: { jobId },
      include: {
        candidate: true,
        job: true,
      },
      orderBy: { overallScore: 'desc' },
    });

    const ranked = results.map((item, idx) => ({
      rank: idx + 1,
      candidateId: item.candidate.id,
      candidateName: item.candidate.name,
      email: item.candidate.email,
      overallScore: item.overallScore,
      skillsScore: item.skillsScore,
      experienceScore: item.experienceScore,
      recommendation: item.recommendation,
      status: item.candidate.status,
      matchingSkills: JSON.parse(item.matchingSkills || '[]'),
      totalExperienceYears: item.candidate.totalExperienceYears,
      createdAt: item.createdAt,
    }));

    return res.json(ranked);
  } catch (error: any) {
    console.error('Error fetching job rankings:', error);
    return res.status(500).json({ error: 'Failed to fetch rankings' });
  }
}
