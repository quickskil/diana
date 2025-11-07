// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSessionUser, saveOnboardingForUser } from '@/lib/server/auth';
import { PLAN_LIST } from '@/lib/plans';
import { defaultOnboarding, type OnboardingForm } from '@/lib/types/user';

// Define the literal union for the plan keys (update as needed)
type PlanKey = 'launch' | 'launch-traffic' | 'full-funnel';

// Build a set of valid plan keys so we can guard at runtime
const VALID_PLAN_KEYS = new Set<PlanKey>(
  PLAN_LIST.map(plan => plan.key as PlanKey)
);

/** Coerce any unknown value into a string (safe) */
function toCleanString(v: unknown): string {
  return String(v ?? '').trim();
}

/** Normalize the payload into a valid OnboardingForm */
function normaliseForm(
  payload: Partial<OnboardingForm> | null | undefined
): OnboardingForm {
  const base: OnboardingForm = { ...defaultOnboarding };

  if (!payload) {
    return base;
  }

  // Cast to unknown map so TS doesn’t infer “never”
  const input = payload as Partial<Record<keyof OnboardingForm, unknown>>;

  const merged: Partial<OnboardingForm> = { ...base };

  // Only iterate known keys so we skip stray fields
  (Object.keys(base) as Array<keyof OnboardingForm>).forEach((key) => {
    if (key in input) {
      const raw = input[key];
      if (key === 'plan') {
        // Special handling for plan
        const s = typeof raw === 'string' ? raw.trim() : toCleanString(raw);
        if (VALID_PLAN_KEYS.has(s as PlanKey)) {
          merged.plan = s as PlanKey;
        } else {
          merged.plan = defaultOnboarding.plan as PlanKey;
        }
      } else {
        // Other fields: just convert to string
        merged[key] = typeof raw === 'string'
          ? raw.trim()
          : toCleanString(raw);
      }
    }
  });

  return merged as OnboardingForm;
}

/** Safely parse JSON body (fallback to empty object) */
async function parseJsonBody<T = object>(request: NextRequest): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();

    const body = await parseJsonBody<Partial<OnboardingForm>>(request);
    const form = normaliseForm(body);

    const savedUser = await saveOnboardingForUser(user.id, form);

    return NextResponse.json(
      { ok: true, user: savedUser, message: 'Onboarding saved.' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    const message = (error as Error).message ?? 'Unknown error';

    if (message === 'Unauthenticated') {
      return NextResponse.json(
        { ok: false, message: 'Please log in.' },
        { status: 401 }
      );
    }

    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Database is not configured. Add POSTGRES_URL to your environment.',
        },
        { status: 500 }
      );
    }

    console.error('Onboarding save error:', error);
    return NextResponse.json(
      { ok: false, message: 'Unable to save onboarding right now.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
