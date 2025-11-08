import 'server-only';

interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  delivered: boolean;
  sample: boolean;
  id?: string;
  message: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || 'no-reply@businessbooster.ai';

export async function sendTransactionalEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('sendTransactionalEmail: RESEND_API_KEY not configured. Email not delivered.');
    return {
      delivered: false,
      sample: true,
      message: 'Email service not configured. Configure RESEND_API_KEY to send real email.'
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: DEFAULT_FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.message || data?.error?.message || 'Unable to send email.';
    throw new Error(errorMessage);
  }

  return {
    delivered: true,
    sample: false,
    id: typeof data?.id === 'string' ? data.id : undefined,
    message: 'Email delivered successfully.'
  };
}
