import 'server-only';

import { randomUUID } from 'crypto';
import { ensureDatabase, sql } from '@/lib/db';
import type { PaymentRequest, PaymentRequestStatus } from '@/lib/types/payments';

function normaliseDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    return value;
  }
  return new Date().toISOString();
}

function mapRowToRequest(row: Record<string, any>): PaymentRequest {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id ?? null,
    amountCents: Number(row.amount_cents ?? 0),
    currency: row.currency ?? 'usd',
    description: row.description ?? null,
    status: (row.status as PaymentRequestStatus) ?? 'draft',
    checkoutUrl: row.checkout_url ?? null,
    emailSubject: row.email_subject ?? null,
    emailMessage: row.email_message ?? null,
    emailSent: Boolean(row.email_sent),
    createdAt: normaliseDate(row.created_at),
    updatedAt: normaliseDate(row.updated_at)
  } satisfies PaymentRequest;
}

export async function listPaymentRequests(): Promise<PaymentRequest[]> {
  await ensureDatabase();
  const result = await sql`
    SELECT
      id,
      user_id,
      project_id,
      amount_cents,
      currency,
      description,
      status,
      checkout_url,
      email_subject,
      email_message,
      email_sent,
      created_at,
      updated_at
    FROM payment_requests
    ORDER BY created_at DESC;
  `;
  return result.rows.map(mapRowToRequest);
}

export async function getPaymentRequestById(id: string): Promise<PaymentRequest | null> {
  await ensureDatabase();
  const result = await sql`
    SELECT
      id,
      user_id,
      project_id,
      amount_cents,
      currency,
      description,
      status,
      checkout_url,
      email_subject,
      email_message,
      email_sent,
      created_at,
      updated_at
    FROM payment_requests
    WHERE id = ${id}
    LIMIT 1;
  `;
  if (result.rows.length === 0) {
    return null;
  }
  return mapRowToRequest(result.rows[0]);
}

export async function createPaymentRequest(payload: {
  userId: string;
  projectId?: string | null;
  amountCents: number;
  currency?: string;
  description?: string | null;
  status?: PaymentRequestStatus;
  checkoutUrl?: string | null;
  emailSubject?: string | null;
  emailMessage?: string | null;
}): Promise<PaymentRequest> {
  await ensureDatabase();
  const id = randomUUID();
  const amount = Math.max(0, Math.round(payload.amountCents));
  const now = new Date().toISOString();
  await sql`
    INSERT INTO payment_requests (
      id,
      user_id,
      project_id,
      amount_cents,
      currency,
      description,
      status,
      checkout_url,
      email_subject,
      email_message,
      email_sent,
      created_at,
      updated_at
    )
    VALUES (
      ${id},
      ${payload.userId},
      ${payload.projectId ?? null},
      ${amount},
      ${payload.currency ?? 'usd'},
      ${payload.description ?? null},
      ${payload.status ?? 'draft'},
      ${payload.checkoutUrl ?? null},
      ${payload.emailSubject ?? null},
      ${payload.emailMessage ?? null},
      false,
      ${now},
      ${now}
    );
  `;
  const created = await getPaymentRequestById(id);
  if (!created) {
    throw new Error('Unable to load payment request.');
  }
  return created;
}

export async function updatePaymentRequest(
  id: string,
  updates: Partial<{
    projectId: string | null;
    amountCents: number;
    currency: string;
    description: string | null;
    status: PaymentRequestStatus;
    checkoutUrl: string | null;
    emailSubject: string | null;
    emailMessage: string | null;
    emailSent: boolean;
  }>
): Promise<PaymentRequest> {
  const existing = await getPaymentRequestById(id);
  if (!existing) {
    throw new Error('Payment request not found.');
  }

  const amountCents = updates.amountCents !== undefined
    ? Math.max(0, Math.round(updates.amountCents))
    : existing.amountCents;

  const payload = {
    projectId: updates.projectId !== undefined ? updates.projectId : existing.projectId,
    currency: updates.currency ?? existing.currency,
    description: updates.description !== undefined ? updates.description : existing.description,
    status: updates.status ?? existing.status,
    checkoutUrl: updates.checkoutUrl !== undefined ? updates.checkoutUrl : existing.checkoutUrl,
    emailSubject: updates.emailSubject !== undefined ? updates.emailSubject : existing.emailSubject,
    emailMessage: updates.emailMessage !== undefined ? updates.emailMessage : existing.emailMessage,
    emailSent: updates.emailSent !== undefined ? updates.emailSent : existing.emailSent
  };

  await ensureDatabase();
  await sql`
    UPDATE payment_requests
    SET
      project_id = ${payload.projectId ?? null},
      amount_cents = ${amountCents},
      currency = ${payload.currency},
      description = ${payload.description ?? null},
      status = ${payload.status},
      checkout_url = ${payload.checkoutUrl ?? null},
      email_subject = ${payload.emailSubject ?? null},
      email_message = ${payload.emailMessage ?? null},
      email_sent = ${payload.emailSent},
      updated_at = ${new Date().toISOString()}
    WHERE id = ${id};
  `;

  const updated = await getPaymentRequestById(id);
  if (!updated) {
    throw new Error('Payment request not found.');
  }
  return updated;
}

export async function deletePaymentRequest(id: string): Promise<void> {
  await ensureDatabase();
  await sql`DELETE FROM payment_requests WHERE id = ${id};`;
}
