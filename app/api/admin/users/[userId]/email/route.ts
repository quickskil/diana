import { NextRequest, NextResponse } from 'next/server';
import { getSafeUserById, requireAdminUser } from '@/lib/server/auth';
import { sendTransactionalEmail } from '@/lib/server/email';

type RouteContext = { params: Promise<{ userId: string }> };

const formatHtml = (message: string) =>
  message
    .split(/\r?\n/g)
    .map(line => line.trim() || '<br />')
    .join('<br />');

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!subject || !message) {
      return NextResponse.json(
        { ok: false, message: 'Subject and message are required.' },
        { status: 400 }
      );
    }

    const { userId } = await context.params;

    const user = await getSafeUserById(userId);
    if (!user) {
      return NextResponse.json({ ok: false, message: 'User not found.' }, { status: 404 });
    }

    const html = `<p>${formatHtml(message)}</p>`;
    const result = await sendTransactionalEmail({
      to: user.email,
      subject,
      html,
      text: message
    });

    return NextResponse.json({
      ok: true,
      delivered: result.delivered,
      sample: result.sample,
      message: result.message
    });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    console.error('Admin email user error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to send email.' }, { status: 500 });
  }
}
