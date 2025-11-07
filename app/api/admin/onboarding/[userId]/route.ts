import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser, updateOnboardingStatusForUser } from '@/lib/server/auth';
import type { OnboardingStatus } from '@/lib/types/user';

const allowedStatuses: OnboardingStatus[] = ['not-started', 'submitted', 'in-progress', 'launch-ready'];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await requireAdminUser();
    const params = await context.params;
    const userId = params?.userId;
    if (!userId) {
      return NextResponse.json({ ok: false, message: 'User ID missing.' }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const status = body?.status as OnboardingStatus;
    const note = body?.note ? body.note.toString() : null;
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ ok: false, message: 'Invalid status.' }, { status: 400 });
    }
    const user = await updateOnboardingStatusForUser(userId, status, note);
    return NextResponse.json({ ok: true, user, message: 'Onboarding status updated.' });
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
    console.error('Admin onboarding update error', error);
    return NextResponse.json({ ok: false, message: 'Unable to update onboarding status.' }, { status: 500 });
  }
}
