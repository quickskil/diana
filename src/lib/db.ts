import 'server-only';

import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';

const ADMIN_EMAIL = 'admin@businessbooster.ai';
const ADMIN_PASSWORD = 'admin123';

const DEFAULT_SERVICES: Array<{
  key: string;
  name: string;
  tagline: string;
  description: string;
  dueAtApprovalCents: number;
  ongoingNote: string;
}> = [
  {
    key: 'website',
    name: 'Website',
    tagline: 'Done-for-you conversion site',
    description: 'Launch a conversion-ready site synced to your calendar and optimized for booked calls.',
    dueAtApprovalCents: 40000,
    ongoingNote: '$25/mo hosting & care'
  },
  {
    key: 'ads',
    name: 'Ads',
    tagline: 'Google & Meta ad campaigns',
    description: 'Run aligned search and social campaigns with transparent reporting.',
    dueAtApprovalCents: 100100,
    ongoingNote: '10% of ad spend management'
  },
  {
    key: 'voice',
    name: 'AI Voice Agents',
    tagline: 'AI voice agents for follow-up',
    description: 'Answer every lead instantly with AI reception and warm transfers.',
    dueAtApprovalCents: 140000,
    ongoingNote: 'Voice agents from $99/mo'
  }
];

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

  await sql`ALTER TABLE onboardings ADD COLUMN IF NOT EXISTS id UUID;`;
  await sql`UPDATE onboardings SET id = md5(random()::text || clock_timestamp()::text)::uuid WHERE id IS NULL;`;
  await sql`ALTER TABLE onboardings ALTER COLUMN id SET NOT NULL;`;
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY (i.indkey)
        WHERE i.indrelid = 'onboardings'::regclass
          AND i.indisprimary
          AND a.attname = 'id'
      ) THEN
        EXECUTE 'ALTER TABLE onboardings DROP CONSTRAINT IF EXISTS onboardings_pkey';
        EXECUTE 'ALTER TABLE onboardings ADD CONSTRAINT onboardings_pkey PRIMARY KEY (id)';
      END IF;
    END;
    $$;
  `;

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

  await sql`CREATE TABLE IF NOT EXISTS services (
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    due_at_approval_cents INTEGER NOT NULL,
    ongoing_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await sql`CREATE TABLE IF NOT EXISTS user_services (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_key TEXT NOT NULL REFERENCES services(key) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    price_cents INTEGER,
    ongoing_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, service_key)
  );`;

  for (const service of DEFAULT_SERVICES) {
    await sql`
      INSERT INTO services (key, name, tagline, description, due_at_approval_cents, ongoing_note)
      VALUES (${service.key}, ${service.name}, ${service.tagline}, ${service.description}, ${service.dueAtApprovalCents}, ${service.ongoingNote})
      ON CONFLICT (key) DO UPDATE
      SET
        name = EXCLUDED.name,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        due_at_approval_cents = EXCLUDED.due_at_approval_cents,
        ongoing_note = EXCLUDED.ongoing_note,
        updated_at = NOW();
    `;
  }

  await sql`
    INSERT INTO user_services (user_id, service_key, active, price_cents, ongoing_note, created_at, updated_at)
    SELECT u.id, s.key, FALSE, s.due_at_approval_cents, s.ongoing_note, NOW(), NOW()
    FROM users u
    CROSS JOIN services s
    ON CONFLICT (user_id, service_key) DO NOTHING;
  `;

  await sql`
    UPDATE user_services us
    SET active = TRUE, updated_at = NOW()
    FROM onboardings o
    WHERE o.user_id = us.user_id AND (o.data->>'plan') = 'launch' AND us.service_key = 'website';
  `;

  await sql`
    UPDATE user_services us
    SET active = TRUE, updated_at = NOW()
    FROM onboardings o
    WHERE o.user_id = us.user_id AND (o.data->>'plan') = 'launch-traffic' AND us.service_key IN ('website', 'ads');
  `;

  await sql`
    UPDATE user_services us
    SET active = TRUE, updated_at = NOW()
    FROM onboardings o
    WHERE o.user_id = us.user_id AND (o.data->>'plan') = 'full-funnel' AND us.service_key IN ('website', 'ads', 'voice');
  `;

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
