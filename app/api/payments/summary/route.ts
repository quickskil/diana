import { NextResponse } from 'next/server';
import { requireSessionUser } from '@/lib/server/auth';
import { getDepositSummaryForUser } from '@/lib/server/stripe';

export async function GET() {
  try {
    const user = await requireSessionUser();
    const { summary, sample } = await getDepositSummaryForUser(user.id);
    return NextResponse.json({ ok: true, deposit: summary, sample });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please sign in again.' }, { status: 401 });
    }
    if (message.includes('Stripe is not configured')) {
      return NextResponse.json({ ok: true, deposit: null, sample: true });
    }
    console.error('Deposit summary error', error);
    return NextResponse.json({ ok: false, message: message || 'Unable to load payments.' }, { status: 500 });
  }
}
