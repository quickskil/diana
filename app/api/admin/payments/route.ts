import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/server/auth';
import { listKickoffPayments } from '@/lib/server/stripe';

export async function GET() {
  try {
    await requireAdminUser();
    const { payments, sample } = await listKickoffPayments();
    return NextResponse.json({ ok: true, payments, sample });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please sign in again.' }, { status: 401 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Access denied.' }, { status: 403 });
    }
    if (message === 'Stripe is not configured') {
      return NextResponse.json({ ok: true, payments: [], sample: true });
    }
    console.error('Admin payments error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to load payments.' }, { status: 500 });
  }
}
