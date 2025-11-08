import 'server-only';

import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';

const ADMIN_EMAIL = 'admin@businessbooster.ai';
const ADMIN_PASSWORD = 'admin123';

let schemaInitialised: Promise<void> | null = null;
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('POSTGRES_URL (or DATABASE_URL) must be set to use the portal database.');
    }
    pool = new Pool({ connectionString, max: 5 });
  }
  return pool;
}

function buildQuery(strings: TemplateStringsArray, values: unknown[]): { text: string; values: unknown[] } {
  let text = '';
  const normalisedValues: unknown[] = [];
  strings.forEach((part, index) => {
    text += part;
    if (index < values.length) {
      normalisedValues.push(values[index]);
      text += `$${normalisedValues.length}`;
    }
  });
  return { text, values: normalisedValues };
}

async function runQuery<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<QueryResult<T>> {
  const query = buildQuery(strings, values);
  return getPool().query<T>(query);
}

async function createSchema() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    company TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await sql`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await sql`CREATE TABLE IF NOT EXISTS onboardings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Project',
    data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    status_note TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await sql`ALTER TABLE onboardings DROP CONSTRAINT IF EXISTS onboardings_pkey;`;
  await sql`ALTER TABLE onboardings ADD COLUMN IF NOT EXISTS id UUID;`;
  await sql`UPDATE onboardings SET id = md5(random()::text || clock_timestamp()::text)::uuid WHERE id IS NULL;`;
  await sql`ALTER TABLE onboardings ALTER COLUMN id SET NOT NULL;`;
  await sql`ALTER TABLE onboardings ADD CONSTRAINT onboardings_pkey PRIMARY KEY (id);`;

  await sql`ALTER TABLE onboardings ADD COLUMN IF NOT EXISTS label TEXT;`;
  await sql`UPDATE onboardings SET label = COALESCE(NULLIF(label, ''), 'Project') WHERE label IS NULL OR label = '';`;
  await sql`ALTER TABLE onboardings ALTER COLUMN label SET NOT NULL;`;
  await sql`ALTER TABLE onboardings ALTER COLUMN label SET DEFAULT 'Project';`;

  await sql`ALTER TABLE onboardings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;`;
  await sql`UPDATE onboardings SET created_at = COALESCE(created_at, updated_at, completed_at, NOW()) WHERE created_at IS NULL;`;
  await sql`ALTER TABLE onboardings ALTER COLUMN created_at SET NOT NULL;`;
  await sql`ALTER TABLE onboardings ALTER COLUMN created_at SET DEFAULT NOW();`;

  await sql`ALTER TABLE onboardings ALTER COLUMN updated_at SET DEFAULT NOW();`;
  await sql`ALTER TABLE onboardings ALTER COLUMN user_id SET NOT NULL;`;

  await sql`CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES onboardings(id) ON DELETE SET NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    checkout_url TEXT,
    email_subject TEXT,
    email_message TEXT,
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await sql`CREATE INDEX IF NOT EXISTS idx_onboardings_user_id ON onboardings(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_payment_requests_project_id ON payment_requests(project_id);`;

  const admin = await sql`SELECT id FROM users WHERE email = ${ADMIN_EMAIL} LIMIT 1;`;
  if (admin.rows.length === 0) {
    const adminId = randomUUID();
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await sql`INSERT INTO users (id, name, email, password_hash, role) VALUES (${adminId}, 'Admin', ${ADMIN_EMAIL}, ${hash}, 'admin');`;
  }
}

export async function ensureDatabase() {
  if (!schemaInitialised) {
    schemaInitialised = createSchema().catch(error => {
      schemaInitialised = null;
      throw error;
    });
  }
  return schemaInitialised;
}

export const sql = runQuery;
