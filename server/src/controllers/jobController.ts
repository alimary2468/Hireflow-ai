import { Request, Response } from 'express';
import { prisma } from '../db/prisma';

export async function createJob(req: Request, res: Response) {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      experienceRequired,
      minExperienceYears,
      salaryRange,
      description,
      requiredSkills,
      preferredSkills,
      educationRequirements,
      responsibilities,
      interviewCriteria,
    } = req.body;

    if (!title || !department || !description) {
      return res.status(400).json({ error: 'Job Title, Department, and Description are required' });
    }

    const reqSkillsJson = Array.isArray(requiredSkills) ? JSON.stringify(requiredSkills) : JSON.stringify([]);
    const prefSkillsJson = Array.isArray(preferredSkills) ? JSON.stringify(preferredSkills) : JSON.stringify([]);

    const job = await prisma.job.create({
      data: {
        title,
        department,
        location: location || 'Remote / Karachi',
        employmentType: employmentType || 'Full-Time',
        experienceRequired: experienceRequired || '2+ years',
        minExperienceYears: typeof minExperienceYears === 'number' ? minExperienceYears : 2.0,
        salaryRange: salaryRange || 'PKR 250,000 - 400,000 / month',
        description,
        requiredSkills: reqSkillsJson,
        preferredSkills: prefSkillsJson,
        educationRequirements: educationRequirements || "Bachelor's Degree in Computer Science or related field",
        responsibilities: responsibilities || '',
        interviewCriteria: interviewCriteria || 'Technical Live Coding + System Design + Culture Fit',
      },
    });

    return res.status(201).json(job);
  } catch (error: any) {
    console.error('Error creating job:', error);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

export async function getJobs(req: Request, res: Response) {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true, screeningResults: true, interviews: true },
        },
      },
    });

    const formattedJobs = jobs.map((job) => ({
      ...job,
      requiredSkills: JSON.parse(job.requiredSkills || '[]'),
      preferredSkills: JSON.parse(job.preferredSkills || '[]'),
    }));

    return res.json(formattedJobs);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}

export async function getJobById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            candidate: {
              include: { screeningResults: true },
            },
          },
        },
      },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    return res.json({
      ...job,
      requiredSkills: JSON.parse(job.requiredSkills || '[]'),
      preferredSkills: JSON.parse(job.preferredSkills || '[]'),
    });
  } catch (error: any) {
    console.error('Error fetching job details:', error);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
}

export async function updateJob(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (Array.isArray(updateData.requiredSkills)) {
      updateData.requiredSkills = JSON.stringify(updateData.requiredSkills);
    }
    if (Array.isArray(updateData.preferredSkills)) {
      updateData.preferredSkills = JSON.stringify(updateData.preferredSkills);
    }

    const updated = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return res.json(updated);
  } catch (error: any) {
    console.error('Error updating job:', error);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}

export async function deleteJob(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id } });
    return res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ error: 'Failed to delete job' });
  }
}
