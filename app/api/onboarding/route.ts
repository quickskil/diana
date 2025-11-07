import { NextRequest, NextResponse } from 'next/server';
import { requireSessionUser, saveOnboardingForUser } from '@/lib/server/auth';
import { PLAN_LIST } from '@/lib/plans';
import { defaultOnboarding, type OnboardingForm } from '@/lib/types/user';

/** Precompute valid plan keys for O(1) checks */
const VALID_PLAN_KEYS = new Set(PLAN_LIST.map(p => p.key));

/** Narrow payload to only the fields we expect from OnboardingForm */
type PartialOnboardingUnknown = Partial<Record<keyof OnboardingForm, unknown>>;

/** Coerce any value to a clean string (never throws) */
function toCleanString(v: unknown): string {
  // Convert null/undefined to empty, everything else via String(), then trim
  return String(v ?? '').trim();
}

/** Normalize user-sent payload into a safe, strongly-typed OnboardingForm */
function normaliseForm(payload: Partial<OnboardingForm> | null | undefined): OnboardingForm {
  // Start from defaults to ensure all properties exist
  const base: OnboardingForm = { ...defaultOnboarding };

  if (!payload) return base;

  // Treat payload as unknowns so Object.entries is well-typed and never 'never'
  const input = payload as PartialOnboardingUnknown;

  // Only accept keys that already exist on defaultOnboarding (prevent pollution/typos)
  const allowedKeys = Object.keys(defaultOnboarding) as Array<keyof OnboardingForm>;

  const merged: OnboardingForm = { ...base };

  for (const k of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(input, k)) {
      // Coerce non-string values to string; keep strings as-is but trimmed
      const incoming = input[k];
      merged[k] = typeof incoming === 'string' ? incoming.trim() : toCleanString(incoming);
    }
  }

  // Validate and correct plan
  if (!VALID_PLAN_KEYS.has(merged.plan)) {
    merged.plan = defaultOnboarding.plan;
  }

  return merged;
}

/** Safely parse JSON body; return {} on parse errors */
async function readJsonOrEmpty<T extends object = Record<string, unknown>>(req: NextRequest): Promise<T> {
  // Gracefully handle missing/incorrect content-type
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    try {
      return (await req.json()) as T; // Next.js can still parse if body is JSON
    } catch {
      return {} as T;
    }
  }
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Optional: handle CORS preflight if you call this endpoint cross-origin */
export function OPTIONS() {
  return NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Require a logged-in session (throws 'Unauthenticated' on failure)
    const user = await requireSessionUser();

    // Parse JSON leniently; tolerate empty/invalid bodies
    const body = await readJsonOrEmpty<Partial<OnboardingForm>>(request);

    // Normalise + validate
    const form = normaliseForm(body);

    // Persist
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
    const message = (error as Error)?.message ?? 'Unknown error';

    // Common auth error from requireSessionUser
    if (message === 'Unauthenticated') {
      return NextResponse.json(
        { ok: false, message: 'Please log in.' },
        { status: 401 }
      );
    }

    // Helpful hint for missing database config in local/staging
    if (message.includes('POSTGRES_URL')) {
      return NextResponse.json(
        { ok: false, message: 'Database is not configured. Add POSTGRES_URL to your environment.' },
        { status: 500 }
      );
    }

    // Log server-side only
    console.error('Onboarding save error:', error);

    return NextResponse.json(
      { ok: false, message: 'Unable to save onboarding right now.' },
      { status: 500 }
    );
  }
}

/** Optional: reject other HTTP verbs explicitly (helps observability) */
export async function GET() {
  return NextResponse.json(
    { ok: false, message: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST, OPTIONS' } }
  );
}
