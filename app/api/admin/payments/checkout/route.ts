import { NextRequest, NextResponse } from 'next/server';
import { getSafeUserById, requireAdminUser } from '@/lib/server/auth';
import { createCheckoutSession } from '@/lib/server/stripe';

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();
    const body = await request.json().catch(() => ({}));
    const userId = typeof body?.userId === 'string' ? body.userId : '';
    const amount = Number(body?.amount ?? 0);
    const description = typeof body?.description === 'string' && body.description
      ? body.description
      : 'Final website balance';
    const currency = typeof body?.currency === 'string' && body.currency ? body.currency : 'usd';

    if (!userId) {
      return NextResponse.json({ ok: false, message: 'User ID is required.' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ ok: false, message: 'Enter a valid amount greater than zero.' }, { status: 400 });
    }

    const user = await getSafeUserById(userId);
    if (!user) {
      return NextResponse.json({ ok: false, message: 'Client not found.' }, { status: 404 });
    }

    const origin = request.nextUrl.origin;
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      amount,
      currency,
      successUrl: `${origin}/admin?payment=success`,
      cancelUrl: `${origin}/admin`,
      description,
      type: 'final-balance',
      metadata: {
        clientEmail: user.email,
        clientName: user.name ?? ''
      }
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, message: 'Stripe did not return a checkout URL.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url, sessionId: session.id });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please sign in again.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Access denied.' }, { status: 403 });
    }
    if (message === 'Stripe is not configured') {
      return NextResponse.json(
        { ok: false, message: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.' },
        { status: 503 }
      );
    }
    console.error('Admin checkout session error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to create checkout session.' }, { status: 500 });
  }
}
