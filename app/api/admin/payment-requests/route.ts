import { NextRequest, NextResponse } from 'next/server';
import { getSafeUserById, requireAdminUser } from '@/lib/server/auth';
import {
  createPaymentRequest,
  listPaymentRequests,
  updatePaymentRequest
} from '@/lib/server/payment-requests';
import { createCheckoutSession } from '@/lib/server/stripe';

export async function GET() {
  try {
    await requireAdminUser();
    const requests = await listPaymentRequests();
    return NextResponse.json({ ok: true, requests, sample: false });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Admin payment requests error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to load payment requests.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));
    const userId = typeof body?.userId === 'string' ? body.userId : '';
    const projectId = typeof body?.projectId === 'string' ? body.projectId : null;
    const currency = typeof body?.currency === 'string' && body.currency ? body.currency : 'usd';
    const description = typeof body?.description === 'string' ? body.description.trim() : null;
    const generateCheckout = Boolean(body?.generateCheckout);

    const amountInput = body?.amountCents ?? body?.amount ?? 0;
    const numericAmount = Number(amountInput);
    const amountCents = Number.isFinite(numericAmount)
      ? Math.round(body?.amountCents ? numericAmount : numericAmount * 100)
      : 0;

    if (!userId) {
      return NextResponse.json({ ok: false, message: 'User ID is required.' }, { status: 400 });
    }
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.json({ ok: false, message: 'Enter a valid amount greater than zero.' }, { status: 400 });
    }

    const user = await getSafeUserById(userId);
    if (!user) {
      return NextResponse.json({ ok: false, message: 'User not found.' }, { status: 404 });
    }

    let requestRecord = await createPaymentRequest({
      userId,
      projectId,
      amountCents,
      currency,
      description,
      status: 'draft'
    });

    let sample = false;

    if (generateCheckout) {
      try {
        const session = await createCheckoutSession({
          userId: user.id,
          email: user.email,
          name: user.name,
          amount: amountCents / 100,
          currency,
          description: description ?? 'Custom payment',
          successUrl: `${request.nextUrl.origin}/admin?payment=success`,
          cancelUrl: `${request.nextUrl.origin}/admin`,
          type: 'other',
          metadata: {
            paymentRequestId: requestRecord.id,
            projectId: projectId ?? '',
            clientEmail: user.email,
            clientName: user.name ?? ''
          }
        });
        if (session.url) {
          requestRecord = await updatePaymentRequest(requestRecord.id, {
            checkoutUrl: session.url,
            status: 'scheduled'
          });
        }
      } catch (error) {
        const message = (error as Error).message;
        if (message === 'Stripe is not configured') {
          sample = true;
          const placeholder = `${request.nextUrl.origin}/checkout/${requestRecord.id}`;
          requestRecord = await updatePaymentRequest(requestRecord.id, {
            checkoutUrl: placeholder,
            status: 'scheduled'
          });
        } else {
          throw error;
        }
      }
    }

    const requests = await listPaymentRequests();
    return NextResponse.json({ ok: true, request: requestRecord, requests, sample });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Admins only.' }, { status: 403 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Admin create payment request error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to create payment request.' }, { status: 500 });
  }
}
