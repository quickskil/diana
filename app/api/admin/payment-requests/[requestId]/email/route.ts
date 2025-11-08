import { NextRequest, NextResponse } from 'next/server';
import { getSafeUserById, requireAdminUser } from '@/lib/server/auth';
import { getPaymentRequestById, updatePaymentRequest } from '@/lib/server/payment-requests';
import { sendTransactionalEmail } from '@/lib/server/email';

type Params = { params: { requestId: string } };

const toHtml = (message: string) =>
  message
    .split(/\r?\n/g)
    .map(line => (line.trim() ? line.trim() : '<br />'))
    .join('<br />');

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const includeLink = body?.includeLink !== false;
    const overrideUrl = typeof body?.checkoutUrl === 'string' ? body.checkoutUrl.trim() : null;

    if (!subject || !message) {
      return NextResponse.json({ ok: false, message: 'Subject and message are required.' }, { status: 400 });
    }

    const paymentRequest = await getPaymentRequestById(params.requestId);
    if (!paymentRequest) {
      return NextResponse.json({ ok: false, message: 'Payment request not found.' }, { status: 404 });
    }

    const user = await getSafeUserById(paymentRequest.userId);
    if (!user) {
      return NextResponse.json({ ok: false, message: 'User not found.' }, { status: 404 });
    }

    const checkoutUrl = overrideUrl || paymentRequest.checkoutUrl;
    let fullMessage = message;

    if (includeLink) {
      if (!checkoutUrl) {
        return NextResponse.json(
          { ok: false, message: 'Generate a checkout link before sending the payment request.' },
          { status: 400 }
        );
      }
      fullMessage = `${message}\n\nSecure payment link:\n${checkoutUrl}`;
    }

    const html = `<p>${toHtml(fullMessage)}</p>`;
    const result = await sendTransactionalEmail({
      to: user.email,
      subject,
      html,
      text: fullMessage
    });

    const updated = await updatePaymentRequest(paymentRequest.id, {
      emailSubject: subject,
      emailMessage: fullMessage,
      emailSent: result.delivered,
      checkoutUrl: checkoutUrl ?? paymentRequest.checkoutUrl ?? null,
      status: includeLink ? 'sent' : paymentRequest.status
    });

    return NextResponse.json({
      ok: true,
      delivered: result.delivered,
      sample: result.sample,
      request: updated,
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
    console.error('Admin payment request email error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to send payment email.' }, { status: 500 });
  }
}
