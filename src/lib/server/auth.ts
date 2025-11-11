import 'server-only';

import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { ensureDatabase, sql } from '@/lib/db';
import {
  DEFAULT_SERVICE_SELECTION,
  SERVICE_DEFINITIONS,
  SERVICE_ORDER,
  type ServiceKey,
  type ServiceSelectionState,
  normaliseServiceSelection,
  selectionToServices
} from '@/lib/plans';
import {
  defaultOnboarding,
  type OnboardingForm,
  type OnboardingProject,
  type OnboardingStatus,
  type SafeUser,
  type UserRole,
  type UserServiceStatus
} from '@/lib/types/user';

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
  const base: OnboardingForm = {
    ...defaultOnboarding,
    services: { ...DEFAULT_SERVICE_SELECTION }
  };

  if (!data || typeof data !== 'object') {
    return base;
  }

  const record = data as Record<string, unknown>;
  const serviceInput =
    record.services ??
    record.selectedServices ??
    record.serviceSelection ??
    record.plan ??
    record.planKey;

  const merged: OnboardingForm = {
    ...base,
    services: normaliseServiceSelection(serviceInput)
  };

  const allowedKeys = Object.keys(defaultOnboarding) as Array<keyof OnboardingForm>;
  for (const key of allowedKeys) {
    if (key === 'services') {
      continue;
    }
    const value = record[key as string];
    if (value === undefined || value === null) {
      continue;
    }
    merged[key] = typeof value === 'string' ? value : String(value ?? '');
  }

  return merged;
}

function parseProjects(value: unknown): OnboardingProject[] {
  let items: unknown[] = [];
  if (!value) {
    items = [];
  } else if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        items = parsed;
      }
    } catch {
      items = [];
    }
  }

  const projects: OnboardingProject[] = [];

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const record = item as Record<string, any>;
    const id = typeof record.id === 'string' ? record.id : null;
    if (!id) continue;

    const labelRaw = typeof record.label === 'string' ? record.label : null;
    const label = labelRaw && labelRaw.trim() ? labelRaw.trim() : 'Project';
    const data = mergeOnboarding(record.data);
    const createdAt = normaliseDate(record.created_at) ?? new Date().toISOString();
    const updatedAt = normaliseDate(record.updated_at) ?? createdAt;
    const completedAt = normaliseDate(record.completed_at);
    const status = (record.status as OnboardingStatus) ?? 'submitted';
    const statusNote = record.status_note ?? record.statusNote ?? null;
    const statusUpdatedAt = normaliseDate(record.status_updated_at ?? record.updated_at) ?? updatedAt;

    projects.push({
      id,
      label,
      data,
      createdAt,
      updatedAt,
      completedAt,
      status,
      statusNote: statusNote ? String(statusNote) : null,
      statusUpdatedAt
    } satisfies OnboardingProject);
  }

  return projects;
}

function parseUserServices(value: unknown): UserServiceStatus[] {
  let records: unknown[] = [];
  if (!value) {
    records = [];
  } else if (Array.isArray(value)) {
    records = value;
  } else if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        records = parsed;
      }
    } catch {
      records = [];
    }
  }

  const statuses = new Map<ServiceKey, UserServiceStatus>();

  for (const record of records) {
    if (!record || typeof record !== 'object') {
      continue;
    }
    const raw = record as Record<string, any>;
    const keyRaw = raw.service_key ?? raw.serviceKey ?? raw.key;
    if (typeof keyRaw !== 'string') {
      continue;
    }
    const key = keyRaw as ServiceKey;
    if (!SERVICE_DEFINITIONS[key]) {
      continue;
    }

    const active = Boolean(raw.active);
    const priceCents = typeof raw.price_cents === 'number' ? raw.price_cents : typeof raw.priceCents === 'number' ? raw.priceCents : null;
    const ongoingNote = typeof raw.ongoing_note === 'string' ? raw.ongoing_note : typeof raw.ongoingNote === 'string' ? raw.ongoingNote : null;
    const createdAt = normaliseDate(raw.created_at ?? raw.createdAt) ?? new Date().toISOString();
    const updatedAt = normaliseDate(raw.updated_at ?? raw.updatedAt) ?? createdAt;

    statuses.set(key, {
      key,
      active,
      priceCents,
      ongoingNote,
      createdAt,
      updatedAt
    });
  }

  for (const key of SERVICE_ORDER) {
    if (!statuses.has(key)) {
      const now = new Date().toISOString();
      statuses.set(key, {
        key,
        active: false,
        priceCents: SERVICE_DEFINITIONS[key].dueAtApprovalCents,
        ongoingNote: SERVICE_DEFINITIONS[key].ongoingNote,
        createdAt: now,
        updatedAt: now
      });
    }
  }

  return Array.from(statuses.values()).sort((a, b) => {
    return SERVICE_ORDER.indexOf(a.key) - SERVICE_ORDER.indexOf(b.key);
  });
}

async function ensureUserServiceRows(userId: string) {
  await sql`
    INSERT INTO user_services (user_id, service_key, active, price_cents, ongoing_note, created_at, updated_at)
    SELECT ${userId}, s.key, FALSE, s.due_at_approval_cents, s.ongoing_note, NOW(), NOW()
    FROM services s
    ON CONFLICT (user_id, service_key) DO NOTHING;
  `;
}

async function syncUserServices(userId: string, selection: ServiceSelectionState) {
  await ensureUserServiceRows(userId);
  const now = new Date().toISOString();
  for (const key of SERVICE_ORDER) {
    const active = Boolean(selection[key]);
    const definition = SERVICE_DEFINITIONS[key];
    await sql`
      UPDATE user_services
      SET
        active = ${active},
        price_cents = ${definition.dueAtApprovalCents},
        ongoing_note = ${definition.ongoingNote},
        updated_at = ${now}
      WHERE user_id = ${userId} AND service_key = ${key};
    `;
  }
}

function mapRowToSafeUser(row: Record<string, any>): SafeUser {
  const onboardingProjects = parseProjects(row.onboarding_projects ?? row.onboarding_projects_json ?? []);
  const onboarding = onboardingProjects[0] ?? null;

  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    company: row.company ?? null,
    createdAt: normaliseDate(row.created_at) ?? new Date().toISOString(),
    onboarding,
    onboardingProjects,
    services: parseUserServices(row.services ?? row.user_services ?? [])
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
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'service_key', us.service_key,
              'active', us.active,
              'price_cents', us.price_cents,
              'ongoing_note', COALESCE(us.ongoing_note, s.ongoing_note),
              'created_at', us.created_at,
              'updated_at', us.updated_at
            )
            ORDER BY us.service_key
          ),
          '[]'::json
        )
        FROM user_services us
        JOIN services s ON s.key = us.service_key
        WHERE us.user_id = u.id
      ) AS services,
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'label', o.label,
              'data', o.data,
              'status', o.status,
              'status_note', o.status_note,
              'completed_at', o.completed_at,
              'updated_at', o.updated_at,
              'created_at', o.created_at,
              'status_updated_at', o.updated_at
            )
            ORDER BY o.created_at DESC
          ),
          '[]'::json
        )
        FROM onboardings o
        WHERE o.user_id = u.id
      ) AS onboarding_projects
    FROM users u
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
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'service_key', us.service_key,
              'active', us.active,
              'price_cents', us.price_cents,
              'ongoing_note', COALESCE(us.ongoing_note, s.ongoing_note),
              'created_at', us.created_at,
              'updated_at', us.updated_at
            )
            ORDER BY us.service_key
          ),
          '[]'::json
        )
        FROM user_services us
        JOIN services s ON s.key = us.service_key
        WHERE us.user_id = u.id
      ) AS services,
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'label', o.label,
              'data', o.data,
              'status', o.status,
              'status_note', o.status_note,
              'completed_at', o.completed_at,
              'updated_at', o.updated_at,
              'created_at', o.created_at,
              'status_updated_at', o.updated_at
            )
            ORDER BY o.created_at DESC
          ),
          '[]'::json
        )
        FROM onboardings o
        WHERE o.user_id = u.id
      ) AS onboarding_projects
    FROM users u
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

export async function updateUserAccount(
  userId: string,
  payload: {
    name?: string;
    company?: string | null;
    email?: string;
    newPassword?: string | null;
    currentPassword?: string | null;
  }
): Promise<SafeUser> {
  await ensureDatabase();
  const result = await sql`
    SELECT id, name, email, company, password_hash
    FROM users
    WHERE id = ${userId}
    LIMIT 1;
  `;
  if (result.rows.length === 0) {
    throw new Error('User not found.');
  }
  const row = result.rows[0] as { name: string; email: string; company?: string | null; password_hash: string };

  const nextName = (payload.name ?? row.name ?? '').toString().trim() || row.name;
  const nextCompanyRaw = payload.company !== undefined ? payload.company : row.company ?? null;
  const nextCompany = nextCompanyRaw ? nextCompanyRaw.toString().trim() || null : null;
  const requestedEmail = payload.email ? payload.email.toString().trim().toLowerCase() : row.email;
  if (!requestedEmail) {
    throw new Error('Email is required.');
  }
  const emailChanged = requestedEmail && requestedEmail !== row.email;

  const wantsNewPassword = Boolean(payload.newPassword && payload.newPassword.toString().trim());
  const newPasswordValue = wantsNewPassword ? payload.newPassword!.toString() : null;

  if (wantsNewPassword && newPasswordValue && newPasswordValue.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  const requiresPasswordCheck = emailChanged || wantsNewPassword;
  if (requiresPasswordCheck) {
    const current = payload.currentPassword ? payload.currentPassword.toString() : '';
    if (!current) {
      throw new Error('Enter your current password to update email or password.');
    }
    const ok = await bcrypt.compare(current, row.password_hash);
    if (!ok) {
      throw new Error('Current password is incorrect.');
    }
  }

  if (emailChanged) {
    const check = await sql`
      SELECT 1 FROM users WHERE LOWER(email) = ${requestedEmail.toLowerCase()} AND id <> ${userId} LIMIT 1;
    `;
    if (check.rows.length > 0) {
      throw new Error('That email is already in use.');
    }
  }

  const passwordHash = wantsNewPassword && newPasswordValue
    ? await bcrypt.hash(newPasswordValue, 10)
    : row.password_hash;

  await sql`
    UPDATE users
    SET
      name = ${nextName},
      email = ${requestedEmail},
      company = ${nextCompany ?? null},
      password_hash = ${passwordHash}
    WHERE id = ${userId};
  `;

  const updated = await getUserRowById(userId);
  if (!updated) {
    throw new Error('Unable to load updated profile.');
  }
  return mapRowToSafeUser(updated);
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
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'service_key', us.service_key,
              'active', us.active,
              'price_cents', us.price_cents,
              'ongoing_note', COALESCE(us.ongoing_note, s.ongoing_note),
              'created_at', us.created_at,
              'updated_at', us.updated_at
            )
            ORDER BY us.service_key
          ),
          '[]'::json
        )
        FROM user_services us
        JOIN services s ON s.key = us.service_key
        WHERE us.user_id = u.id
      ) AS services,
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'label', o.label,
              'data', o.data,
              'status', o.status,
              'status_note', o.status_note,
              'completed_at', o.completed_at,
              'updated_at', o.updated_at,
              'created_at', o.created_at,
              'status_updated_at', o.updated_at
            )
            ORDER BY o.created_at DESC
          ),
          '[]'::json
        )
        FROM onboardings o
        WHERE o.user_id = u.id
      ) AS onboarding_projects
    FROM users u
    ORDER BY u.created_at DESC;
  `;
  return result.rows.map(mapRowToSafeUser);
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  company?: string | null;
  role?: UserRole;
}): Promise<SafeUser> {
  await ensureDatabase();
  const email = payload.email.trim().toLowerCase();
  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1;`;
  if (existing.rows.length > 0) {
    throw new Error('Email already registered');
  }
  const id = randomUUID();
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const role: UserRole = payload.role === 'admin' ? 'admin' : 'client';
  await sql`
    INSERT INTO users (id, name, email, password_hash, role, company)
    VALUES (${id}, ${payload.name}, ${email}, ${passwordHash}, ${role}, ${payload.company ?? null});
  `;
  await ensureUserServiceRows(id);
  const row = await getUserRowById(id);
  if (!row) {
    throw new Error('Failed to load new user');
  }
  return mapRowToSafeUser(row);
}

export async function adminUpdateUser(
  userId: string,
  payload: { name?: string; email?: string; company?: string | null; role?: UserRole | null }
): Promise<SafeUser> {
  await ensureDatabase();
  const current = await getUserRowById(userId);
  if (!current) {
    throw new Error('User not found.');
  }

  const nextName = payload.name !== undefined ? payload.name.toString().trim() || current.name : current.name;
  const nextCompanyRaw = payload.company !== undefined ? payload.company : current.company ?? null;
  const nextCompany = nextCompanyRaw ? nextCompanyRaw.toString().trim() || null : null;

  const requestedEmail = payload.email !== undefined ? payload.email.toString().trim().toLowerCase() : current.email;
  if (!requestedEmail) {
    throw new Error('Email is required.');
  }
  if (requestedEmail !== current.email) {
    const check = await sql`
      SELECT 1 FROM users WHERE LOWER(email) = ${requestedEmail.toLowerCase()} AND id <> ${userId} LIMIT 1;
    `;
    if (check.rows.length > 0) {
      throw new Error('That email is already in use.');
    }
  }

  const nextRole: UserRole = payload.role === 'admin' || payload.role === 'client' ? payload.role : current.role;

  await sql`
    UPDATE users
    SET
      name = ${nextName},
      email = ${requestedEmail},
      company = ${nextCompany ?? null},
      role = ${nextRole}
    WHERE id = ${userId};
  `;

  const updated = await getUserRowById(userId);
  if (!updated) {
    throw new Error('User not found.');
  }
  return mapRowToSafeUser(updated);
}

export async function adminDeleteUser(userId: string): Promise<void> {
  await ensureDatabase();
  await destroySessionForUser(userId);
  await sql`DELETE FROM users WHERE id = ${userId};`;
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
      (
        SELECT COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'label', o.label,
              'data', o.data,
              'status', o.status,
              'status_note', o.status_note,
              'completed_at', o.completed_at,
              'updated_at', o.updated_at,
              'created_at', o.created_at,
              'status_updated_at', o.updated_at
            )
            ORDER BY o.created_at DESC
          ),
          '[]'::json
        )
        FROM onboardings o
        WHERE o.user_id = u.id
      ) AS onboarding_projects
    FROM sessions s
    JOIN users u ON u.id = s.user_id
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

export async function saveOnboardingForUser(
  userId: string,
  form: OnboardingForm,
  options?: { projectId?: string | null; label?: string | null; createNew?: boolean }
): Promise<SafeUser> {
  await ensureDatabase();

  const now = new Date().toISOString();
  const selection = normaliseServiceSelection(form.services);
  const payloadJson = JSON.stringify({ ...form, services: selection });
  const desiredLabel = options?.label?.trim() ? options.label.trim() : null;
  let projectId = options?.projectId?.trim() || null;

  if (options?.createNew) {
    projectId = null;
  }

  let persistStatus: OnboardingStatus = 'submitted';
  let persistNote: string | null = null;

  if (projectId) {
    const existing = await sql`
      SELECT id, status, status_note
      FROM onboardings
      WHERE id = ${projectId} AND user_id = ${userId}
      LIMIT 1;
    `;
    if (existing.rows.length > 0) {
      const existingRow = existing.rows[0] as { id: string; status?: OnboardingStatus; status_note?: string | null };
      const existingStatus = existingRow.status;
      persistStatus = existingStatus && PROTECTED_STATUSES.includes(existingStatus) ? existingStatus : 'submitted';
      persistNote = persistStatus === existingStatus ? existingRow.status_note ?? null : null;
      await sql`
        UPDATE onboardings
        SET
          data = ${payloadJson}::jsonb,
          status = ${persistStatus},
          status_note = ${persistNote},
          completed_at = ${now},
          updated_at = ${now},
          label = COALESCE(${desiredLabel}, label)
        WHERE id = ${existingRow.id} AND user_id = ${userId};
      `;
    } else {
      projectId = null;
    }
  }

  if (!projectId) {
    projectId = randomUUID();
    persistStatus = 'submitted';
    persistNote = null;
    const label = desiredLabel ?? 'Project';
    await sql`
      INSERT INTO onboardings (id, user_id, label, data, status, status_note, completed_at, created_at, updated_at)
      VALUES (${projectId}, ${userId}, ${label}, ${payloadJson}::jsonb, ${persistStatus}, ${persistNote}, ${now}, ${now}, ${now});
    `;
  }

  await syncUserServices(userId, selection);

  const row = await getUserRowById(userId);
  if (!row) {
    throw new Error('Failed to load user after saving onboarding');
  }
  return mapRowToSafeUser(row);
}

export async function updateOnboardingStatusForUser(
  userId: string,
  projectId: string,
  status: OnboardingStatus,
  note?: string | null
): Promise<SafeUser> {
  await ensureDatabase();
  if (!projectId) {
    throw new Error('Project ID is required.');
  }

  const now = new Date().toISOString();
  const payloadJson = JSON.stringify(defaultOnboarding);

  const updated = await sql`
    UPDATE onboardings
    SET status = ${status}, status_note = ${note ?? null}, updated_at = ${now}
    WHERE id = ${projectId} AND user_id = ${userId};
  `;

  if (updated.rowCount === 0) {
    await sql`
      INSERT INTO onboardings (id, user_id, label, data, status, status_note, completed_at, created_at, updated_at)
      VALUES (${projectId}, ${userId}, 'Project', ${payloadJson}::jsonb, ${status}, ${note ?? null}, ${now}, ${now}, ${now})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

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
