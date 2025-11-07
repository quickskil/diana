import 'server-only';

import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { ensureDatabase, sql } from '@/lib/db';
import { defaultOnboarding, type OnboardingForm, type OnboardingStatus, type SafeUser } from '@/lib/types/user';

const PROTECTED_STATUSES: OnboardingStatus[] = ['in-progress', 'launch-ready'];

const SESSION_COOKIE = 'bb_session';

function normaliseDate(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return value;
  }
  return null;
}

function mergeOnboarding(data: unknown): OnboardingForm {
  if (!data || typeof data !== 'object') {
    return { ...defaultOnboarding };
  }
  return { ...defaultOnboarding, ...(data as Partial<OnboardingForm>) };
}

function mapRowToSafeUser(row: Record<string, any>): SafeUser {
  const onboardingData = row.onboarding_data;
  const onboardingStatus = row.onboarding_status as OnboardingStatus | null | undefined;
  const onboarding = onboardingData
    ? {
        data: mergeOnboarding(onboardingData),
        completedAt: normaliseDate(row.onboarding_completed_at),
        status: onboardingStatus ?? 'submitted',
        statusNote: row.onboarding_status_note ?? null,
        statusUpdatedAt: normaliseDate(row.onboarding_updated_at) ?? normaliseDate(row.created_at) ?? new Date().toISOString()
      }
    : null;

  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    company: row.company ?? null,
    createdAt: normaliseDate(row.created_at) ?? new Date().toISOString(),
    onboarding
  };
}

async function getUserRowById(userId: string): Promise<Record<string, any> | null> {
  await ensureDatabase();
  const result = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.company,
      u.created_at,
      o.data AS onboarding_data,
      o.status AS onboarding_status,
      o.status_note AS onboarding_status_note,
      o.completed_at AS onboarding_completed_at,
      o.updated_at AS onboarding_updated_at
    FROM users u
    LEFT JOIN onboardings o ON o.user_id = u.id
    WHERE u.id = ${userId}
    LIMIT 1;
  `;
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

async function getUserRowByEmail(email: string): Promise<Record<string, any> | null> {
  await ensureDatabase();
  const result = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.company,
      u.created_at,
      u.password_hash,
      o.data AS onboarding_data,
      o.status AS onboarding_status,
      o.status_note AS onboarding_status_note,
      o.completed_at AS onboarding_completed_at,
      o.updated_at AS onboarding_updated_at
    FROM users u
    LEFT JOIN onboardings o ON o.user_id = u.id
    WHERE LOWER(u.email) = ${email.toLowerCase()}
    LIMIT 1;
  `;
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

export async function getSafeUserById(userId: string): Promise<SafeUser | null> {
  const row = await getUserRowById(userId);
  if (!row) return null;
  return mapRowToSafeUser(row);
}

export async function listSafeUsers(): Promise<SafeUser[]> {
  await ensureDatabase();
  const result = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.company,
      u.created_at,
      o.data AS onboarding_data,
      o.status AS onboarding_status,
      o.status_note AS onboarding_status_note,
      o.completed_at AS onboarding_completed_at,
      o.updated_at AS onboarding_updated_at
    FROM users u
    LEFT JOIN onboardings o ON o.user_id = u.id
    ORDER BY u.created_at DESC;
  `;
  return result.rows.map(mapRowToSafeUser);
}

export async function createUser(payload: { name: string; email: string; password: string; company?: string | null }): Promise<SafeUser> {
  await ensureDatabase();
  const email = payload.email.trim().toLowerCase();
  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1;`;
  if (existing.rows.length > 0) {
    throw new Error('Email already registered');
  }
  const id = randomUUID();
  const passwordHash = await bcrypt.hash(payload.password, 10);
  await sql`
    INSERT INTO users (id, name, email, password_hash, role, company)
    VALUES (${id}, ${payload.name}, ${email}, ${passwordHash}, 'client', ${payload.company ?? null});
  `;
  const row = await getUserRowById(id);
  if (!row) {
    throw new Error('Failed to load new user');
  }
  return mapRowToSafeUser(row);
}

export async function verifyUserCredentials(email: string, password: string): Promise<SafeUser | null> {
  const row = await getUserRowByEmail(email.trim().toLowerCase());
  if (!row || !row.password_hash) {
    return null;
  }
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) {
    return null;
  }
  return mapRowToSafeUser(row);
}

async function deleteSession(token: string) {
  await ensureDatabase();
  await sql`DELETE FROM sessions WHERE token = ${token};`;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await deleteSession(token);
  }
  cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
}

export async function createSession(userId: string): Promise<string> {
  await ensureDatabase();
  const token = randomUUID();
  await sql`DELETE FROM sessions WHERE user_id = ${userId};`;
  await sql`INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId});`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return token;
}

export async function getSessionUser(): Promise<SafeUser | null> {
  await ensureDatabase();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const result = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.company,
      u.created_at,
      o.data AS onboarding_data,
      o.status AS onboarding_status,
      o.status_note AS onboarding_status_note,
      o.completed_at AS onboarding_completed_at,
      o.updated_at AS onboarding_updated_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN onboardings o ON o.user_id = u.id
    WHERE s.token = ${token}
    LIMIT 1;
  `;
  if (result.rows.length === 0) {
    await deleteSession(token);
    cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    return null;
  }
  return mapRowToSafeUser(result.rows[0]);
}

export async function requireSessionUser(): Promise<SafeUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthenticated');
  }
  return user;
}

export async function requireAdminUser(): Promise<SafeUser> {
  const user = await requireSessionUser();
  if (user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}

export async function saveOnboardingForUser(userId: string, form: OnboardingForm): Promise<SafeUser> {
  await ensureDatabase();
  const existing = await sql`SELECT status, status_note FROM onboardings WHERE user_id = ${userId} LIMIT 1;`;
  const now = new Date().toISOString();
  const existingRow = existing.rows[0] as { status?: OnboardingStatus; status_note?: string | null } | undefined;
  const existingStatus = existingRow?.status;
  const persistStatus: OnboardingStatus = existingStatus && PROTECTED_STATUSES.includes(existingStatus)
    ? existingStatus
    : 'submitted';
  const persistNote = persistStatus === existingStatus ? existingRow?.status_note ?? null : null;

  const payloadJson = JSON.stringify(form);

  await sql`
    INSERT INTO onboardings (user_id, data, status, status_note, completed_at, updated_at)
    VALUES (${userId}, ${payloadJson}::jsonb, ${persistStatus}, ${persistNote}, ${now}, ${now})
    ON CONFLICT (user_id)
    DO UPDATE SET
      data = ${payloadJson}::jsonb,
      status = ${persistStatus},
      status_note = ${persistNote},
      completed_at = ${now},
      updated_at = ${now};
  `;
  const row = await getUserRowById(userId);
  if (!row) {
    throw new Error('Failed to load user after saving onboarding');
  }
  return mapRowToSafeUser(row);
}

export async function updateOnboardingStatusForUser(userId: string, status: OnboardingStatus, note?: string | null): Promise<SafeUser> {
  await ensureDatabase();
  const now = new Date().toISOString();
  const payloadJson = JSON.stringify(defaultOnboarding);

  await sql`
    INSERT INTO onboardings (user_id, data, status, status_note, completed_at, updated_at)
    VALUES (${userId}, ${payloadJson}::jsonb, ${status}, ${note ?? null}, ${now}, ${now})
    ON CONFLICT (user_id)
    DO UPDATE SET
      status = ${status},
      status_note = ${note ?? null},
      updated_at = ${now};
  `;
  const row = await getUserRowById(userId);
  if (!row) {
    throw new Error('Failed to update onboarding status');
  }
  return mapRowToSafeUser(row);
}

export async function destroySessionForUser(userId: string) {
  await ensureDatabase();
  await sql`DELETE FROM sessions WHERE user_id = ${userId};`;
}
