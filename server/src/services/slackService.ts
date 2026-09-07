export async function sendSlackNotification(candidateName: string, jobTitle: string, score: number, candidateId: string): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.trim() === '') {
    console.log(`[SLACK INTEGRATION] Webhook URL not configured. Skipping Slack alert for ${candidateName}.`);
    return false;
  }

  try {
    const payload = {
      text: `🤖 *HireFlow AI* — New Strong Match Candidate Detected!\n\n*Candidate:* ${candidateName}\n*Position:* ${jobTitle}\n*AI Score:* ${score}/100\n*Recommendation:* Interview Recommended\n\n<http://localhost:5173/candidates/${candidateId}|View Candidate Profile →>`,
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`[SLACK INTEGRATION] Successfully posted notification for ${candidateName}`);
      return true;
    }
    console.warn(`[SLACK INTEGRATION] Slack webhook responded with status: ${res.status}`);
    return false;
  } catch (err) {
    console.warn('[SLACK INTEGRATION] Error sending Slack notification:', err);
    return false;
  }
}
