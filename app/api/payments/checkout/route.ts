import { NextRequest, NextResponse } from 'next/server';
import { requireSessionUser } from '@/lib/server/auth';
import { createCheckoutSession } from '@/lib/server/stripe';

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const body = await request.json().catch(() => ({}));

    const origin = request.nextUrl.origin;
    const successUrl = typeof body?.successUrl === 'string' && body.successUrl
      ? body.successUrl
      : `${origin}/dashboard?deposit=success`;
    const cancelUrl = typeof body?.cancelUrl === 'string' && body.cancelUrl
      ? body.cancelUrl
      : `${origin}/dashboard`;

    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      amount: 99,
      currency: 'usd',
      successUrl,
      cancelUrl,
      description: 'Kickoff deposit',
      type: 'kickoff-deposit',
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
    if (message === 'Stripe is not configured') {
      return NextResponse.json(
        { ok: false, message: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.' },
        { status: 503 }
      );
    }
    console.error('Checkout session error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to start checkout.' }, { status: 500 });
  }
}
