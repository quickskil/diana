import 'server-only';

import { sql as vercelSql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin@businessbooster.ai';
const ADMIN_PASSWORD = 'admin123';

let schemaInitialised: Promise<void> | null = null;

async function createSchema() {
  if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    throw new Error('POSTGRES_URL (or DATABASE_URL) must be set to use the portal database.');
  }
  await vercelSql`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    company TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await vercelSql`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await vercelSql`CREATE TABLE IF NOT EXISTS onboardings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    status_note TEXT,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  const admin = await vercelSql`SELECT id FROM users WHERE email = ${ADMIN_EMAIL} LIMIT 1;`;
  if (admin.rows.length === 0) {
    const adminId = randomUUID();
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await vercelSql`INSERT INTO users (id, name, email, password_hash, role) VALUES (${adminId}, 'Admin', ${ADMIN_EMAIL}, ${hash}, 'admin');`;
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

export const sql = vercelSql;
