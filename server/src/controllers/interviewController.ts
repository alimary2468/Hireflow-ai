import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { sendInterviewInvitationEmail } from '../services/emailService';

export async function scheduleInterview(req: Request, res: Response) {
  try {
    const { candidateId, jobId, interviewer, date, startTime, duration, type, meetingLink, additionalMessage } = req.body;

    if (!candidateId || !jobId || !interviewer || !date || !startTime) {
      return res.status(400).json({ error: 'Candidate, Job, Interviewer, Date, and Time are required' });
    }

    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job position not found' });

    // 1. Create Interview Record
    const interview = await prisma.interview.create({
      data: {
        candidateId,
        jobId,
        interviewer,
        date,
        startTime,
        duration: duration || '45 mins',
        type: type || 'Video',
        meetingLink: meetingLink || 'https://meet.google.com/hfl-hire-flow',
        additionalMessage: additionalMessage || '',
        status: 'SCHEDULED',
      },
    });

    // 2. Update Candidate Status to INTERVIEW_SCHEDULED
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: 'INTERVIEW_SCHEDULED' },
    });

    // 3. Create Notification
    await prisma.notification.create({
      data: {
        type: 'INTERVIEW_SCHEDULED',
        title: `Interview Scheduled: ${candidate.name}`,
        message: `Interview scheduled for ${job.title} on ${date} at ${startTime} with ${interviewer}.`,
      },
    });

    // 4. Automatically Send Email Invitation
    const emailResult = await sendInterviewInvitationEmail({
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobTitle: job.title,
      date,
      startTime,
      duration: duration || '45 mins',
      type: type || 'Video',
      meetingLink: meetingLink || 'https://meet.google.com/hfl-hire-flow',
      interviewer,
      additionalMessage,
    });

    return res.status(201).json({
      interview,
      emailSent: emailResult.success,
      emailMessage: emailResult.message,
    });
  } catch (error: any) {
    console.error('Error scheduling interview:', error);
    return res.status(500).json({ error: 'Failed to schedule interview' });
  }
}

export async function getInterviews(req: Request, res: Response) {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        candidate: { select: { id: true, name: true, email: true, phone: true, location: true } },
        job: { select: { id: true, title: true, department: true } },
      },
      orderBy: { date: 'asc' },
    });

    return res.json(interviews);
  } catch (error: any) {
    console.error('Error fetching interviews:', error);
    return res.status(500).json({ error: 'Failed to fetch interviews' });
  }
}

export async function updateInterview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.interview.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  } catch (error: any) {
    console.error('Error updating interview:', error);
    return res.status(500).json({ error: 'Failed to update interview' });
  }
}
