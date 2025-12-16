const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

export const emailFrom = process.env.EMAIL_FROM || 'bookings@dianatolu.com';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('SMTP credentials are missing; email will not be sent.');
    return;
  }

  // Lightweight email sender that avoids external dependencies. In production,
  // replace this with a real SMTP client implementation suited to your
  // environment. For now, we log the payload so environments without internet
  // access can still run builds and local development smoothly.
  console.info('Email dispatch (stub)', { from: emailFrom, to, subject, host: smtpHost, port: smtpPort });
  console.debug('Email body (HTML)', html);
}

export function bookingConfirmationTemplate(name: string, start: string, end: string) {
  return `
    <p>Hi ${name},</p>
    <p>Thank you for booking a session with Diana Tolu.</p>
    <p><strong>Session time:</strong> ${start} - ${end}</p>
    <p>You will receive a reminder 24 hours before the session.</p>
    <p>See you soon!</p>
  `;
}

export function receiptTemplate(name: string, amount: number) {
  return `
    <p>Hi ${name},</p>
    <p>We’ve received your payment of ${(amount / 100).toFixed(2)} USD for your tutoring session.</p>
    <p>Thank you for trusting Diana with your preparation.</p>
  `;
}

export function reminderTemplate(name: string, start: string) {
  return `
    <p>Hi ${name},</p>
    <p>This is a reminder for your tutoring session with Diana Tolu starting at ${start}.</p>
    <p>Please reply to this email if you need to adjust anything.</p>
  `;
}
