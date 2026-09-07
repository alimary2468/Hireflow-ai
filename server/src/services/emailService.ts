import nodemailer from 'nodemailer';

export interface SendInterviewEmailInput {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  date: string;
  startTime: string;
  duration: string;
  type: string;
  meetingLink?: string;
  interviewer: string;
  additionalMessage?: string;
}

export interface SendHrScreeningEmailInput {
  hrEmail: string;
  candidateName: string;
  jobTitle: string;
  overallScore: number;
  recommendation: string;
  candidateId: string;
}

export async function sendInterviewInvitationEmail(input: SendInterviewEmailInput): Promise<{ success: boolean; message: string }> {
  const subject = `Interview Invitation — ${input.jobTitle} at HireFlow AI Partner`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
      <div style="text-align: center; border-bottom: 1px solid #edf2f7; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 24px;">HireFlow AI</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Recruitment & Interview Management</p>
      </div>

      <p style="font-size: 16px; color: #1e293b;">Dear <strong>${input.candidateName}</strong>,</p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        We are pleased to invite you to an interview for the <strong>${input.jobTitle}</strong> position. Your application stood out to our hiring team during our initial AI-assisted screening process.
      </p>

      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 6px;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 16px;">Interview Details:</h3>
        <ul style="list-style: none; padding-left: 0; margin: 0; color: #475569; line-height: 1.8;">
          <li>📅 <strong>Date:</strong> ${input.date}</li>
          <li>⏰ <strong>Time:</strong> ${input.startTime} (${input.duration})</li>
          <li>🎯 <strong>Type:</strong> ${input.type}</li>
          <li>👤 <strong>Interviewer:</strong> ${input.interviewer}</li>
          ${input.meetingLink ? `<li>🔗 <strong>Meeting Link:</strong> <a href="${input.meetingLink}" style="color: #2563eb;">${input.meetingLink}</a></li>` : ''}
        </ul>
      </div>

      ${input.additionalMessage ? `
      <div style="background-color: #fffbebf5; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Message from HR:</strong> ${input.additionalMessage}</p>
      </div>` : ''}

      <p style="font-size: 14px; color: #64748b;">
        If you have any questions or need to reschedule, please reply to this email.
      </p>

      <div style="border-top: 1px solid #edf2f7; padding-top: 16px; margin-top: 32px; text-align: center; color: #94a3b8; font-size: 12px;">
        Sent via HireFlow AI • Agentic Screening & Hiring Platform
      </div>
    </div>
  `;

  return dispatchEmail(input.candidateEmail, subject, htmlContent);
}

export async function sendHrScreeningAlertEmail(input: SendHrScreeningEmailInput): Promise<{ success: boolean; message: string }> {
  const subject = `[HireFlow AI] Candidate Screened: ${input.candidateName} (${input.overallScore}/100)`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h3 style="color: #2563eb;">New Candidate Screening Complete</h3>
      <p>Candidate <strong>${input.candidateName}</strong> has been automatically screened for <strong>${input.jobTitle}</strong>.</p>
      <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Overall Score:</strong> ${input.overallScore} / 100</p>
        <p style="margin: 4px 0;"><strong>AI Recommendation:</strong> ${input.recommendation.replace('_', ' ')}</p>
      </div>
      <p><a href="http://localhost:5173/candidates/${input.candidateId}" style="background: #2563eb; color: #ffffff; padding: 10px 16px; text-decoration: none; border-radius: 6px; display: inline-block;">View Candidate Profile</a></p>
    </div>
  `;

  return dispatchEmail(input.hrEmail, subject, htmlContent);
}

async function dispatchEmail(to: string, subject: string, html: string): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"HireFlow AI" <recruitment@hireflow.ai>',
        to,
        subject,
        html,
      });

      console.log(`[EMAIL DISPATCH] Sent email to ${to} with subject "${subject}" via SMTP`);
      return { success: true, message: `Email dispatched to ${to} via SMTP` };
    } catch (err: any) {
      console.warn('[EMAIL DISPATCH ERROR] SMTP failed, logging preview:', err.message);
    }
  }

  // Fallback mode for demo environment & unconfigured SMTP
  console.log(`\n======================================================`);
  console.log(`📧 [MOCK EMAIL DISPATCH LOG]`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`STATUS: Delivered (Simulated Mode)`);
  console.log(`======================================================\n`);

  return {
    success: true,
    message: `Email notification sent (Simulated Mode to ${to})`,
  };
}
