import { NextRequest, NextResponse } from 'next/server';
import { requireSessionUser, saveOnboardingForUser } from '@/lib/server/auth';
import { PLAN_LIST } from '@/lib/plans';
import { defaultOnboarding, type OnboardingForm } from '@/lib/types/user';

const planKeys = new Set(PLAN_LIST.map(plan => plan.key));

function normaliseForm(payload: Partial<OnboardingForm> | null | undefined): OnboardingForm {
  const base = { ...defaultOnboarding };
  if (!payload) return base;
  return {
    ...base,
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, typeof value === 'string' ? value : (value ?? '').toString()])
    )
  } as OnboardingForm;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const body = await request.json().catch(() => ({}));
    const form = normaliseForm(body);
    if (!planKeys.has(form.plan)) {
      form.plan = defaultOnboarding.plan;
    }
    const savedUser = await saveOnboardingForUser(user.id, form);
    return NextResponse.json({ ok: true, user: savedUser, message: 'Onboarding saved.' });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }
    console.error('Onboarding save error', error);
    return NextResponse.json({ ok: false, message: 'Unable to save onboarding right now.' }, { status: 500 });
  }
}
