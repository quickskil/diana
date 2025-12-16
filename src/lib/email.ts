import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

export const emailFrom = process.env.EMAIL_FROM || 'bookings@dianatolu.com';

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('SMTP credentials are missing; email will not be sent.');
    return;
  }

  await transporter.sendMail({ from: emailFrom, to, subject, html });
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
