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
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    status_note TEXT,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

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
