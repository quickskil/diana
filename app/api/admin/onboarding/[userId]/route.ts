// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireSessionUser, saveOnboardingForUser, updateOnboardingStatusForUser } from '@/lib/server/auth';
import { PLAN_LIST } from '@/lib/plans';
import { defaultOnboarding, type OnboardingForm, type OnboardingStatus } from '@/lib/types/user';

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

function extractUserId(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] ?? null : null;
}

function resolveTargetUserId(sessionUserId: string, requested: string | null): string {
  return requested && requested.trim() ? requested.trim() : sessionUserId;
}

function assertCanManage(targetUserId: string, sessionUser: Awaited<ReturnType<typeof requireSessionUser>>) {
  if (sessionUser.role !== 'admin' && sessionUser.id !== targetUserId) {
    throw new Error('Forbidden');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const requestedId = extractUserId(request);
    const targetUserId = resolveTargetUserId(user.id, requestedId);
    assertCanManage(targetUserId, user);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const rawForm = typeof body.form === 'object' && body.form !== null
      ? (body.form as Partial<OnboardingForm>)
      : (body as Partial<OnboardingForm>);
    const form = normaliseForm(rawForm);

    const projectId = typeof body.projectId === 'string' && body.projectId.trim() ? body.projectId.trim() : null;
    const projectLabel = typeof body.projectLabel === 'string' ? body.projectLabel : null;
    const createNew = Boolean(body.createNew);

    const savedUser = await saveOnboardingForUser(targetUserId, form, {
      projectId,
      label: projectLabel,
      createNew
    });

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

    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
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

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const requestedId = extractUserId(request);
    const targetUserId = resolveTargetUserId(user.id, requestedId);
    assertCanManage(targetUserId, user);

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const projectId = typeof body.projectId === 'string' && body.projectId.trim() ? body.projectId.trim() : null;
    const status = typeof body.status === 'string' ? (body.status as OnboardingStatus) : null;
    const note = typeof body.note === 'string' ? body.note : null;

    if (!projectId) {
      return NextResponse.json({ ok: false, message: 'Project ID is required.' }, { status: 400 });
    }
    if (!status || !['not-started', 'submitted', 'in-progress', 'launch-ready'].includes(status)) {
      return NextResponse.json({ ok: false, message: 'Invalid status.' }, { status: 400 });
    }

    const savedUser = await updateOnboardingStatusForUser(targetUserId, projectId, status, note);

    return NextResponse.json(
      { ok: true, user: savedUser, message: 'Onboarding status updated.' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    const message = (error as Error).message ?? 'Unknown error';

    if (message === 'Unauthenticated') {
      return NextResponse.json({ ok: false, message: 'Please log in.' }, { status: 401 });
    }

    if (message === 'Forbidden') {
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
    }

    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }

    console.error('Onboarding status update error:', error);
    return NextResponse.json({ ok: false, message: 'Unable to update onboarding status.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST, PATCH' } }
  );
}
