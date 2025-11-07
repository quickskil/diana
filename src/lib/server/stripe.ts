import 'server-only';

import { type DepositSummary, type PaymentRecord, type PaymentType } from '@/lib/types/payments';

const STRIPE_API_BASE = 'https://api.stripe.com/v1';
const STRIPE_API_VERSION = '2023-10-16';

class StripeError extends Error {
  status: number;
  type?: string;
  code?: string;

  constructor(message: string, options: { status: number; type?: string; code?: string }) {
    super(message);
    this.name = 'StripeError';
    this.status = options.status;
    this.type = options.type;
    this.code = options.code;
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function normaliseCurrency(value: unknown): string {
  if (typeof value !== 'string') return 'USD';
  return value.toUpperCase();
}

function centsToDollars(amount: unknown): number {
  const numeric = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric) / 100;
}

function toIso(timestamp: unknown): string | null {
  if (typeof timestamp !== 'number') return null;
  const ms = timestamp * 1000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

type StripeCharge = {
  id: string;
  status: string;
  paid: boolean;
  refunded?: boolean;
  receipt_url?: string | null;
  billing_details?: {
    email?: string | null;
  };
  created?: number;
};

type StripePaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string | null;
  metadata?: Record<string, string>;
  created?: number;
  latest_charge?: string | StripeCharge | null;
  charges?: { data: StripeCharge[] } | null;
};

type StripeListResponse<T> = {
  data: T[];
  has_more: boolean;
};

async function stripeRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('Stripe is not configured');
  }

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${secret}`);
  headers.set('Stripe-Version', STRIPE_API_VERSION);

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  const text = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  const body = text && contentType.includes('application/json') ? JSON.parse(text) : text;

  if (!response.ok) {
    if (body && typeof body === 'object' && 'error' in body) {
      const error = (body as any).error ?? {};
      const message = typeof error.message === 'string' && error.message ? error.message : 'Stripe request failed.';
      throw new StripeError(message, {
        status: response.status,
        type: typeof error.type === 'string' ? error.type : undefined,
        code: typeof error.code === 'string' ? error.code : undefined
      });
    }
    throw new StripeError('Stripe request failed.', { status: response.status });
  }

  return body as T;
}

function resolvePaymentType(metadata?: Record<string, string>): PaymentType {
  if (!metadata) return 'kickoff-deposit';
  const raw = metadata.type ?? metadata.paymentType;
  if (raw === 'kickoff-deposit' || raw === 'final-balance' || raw === 'other') {
    return raw;
  }
  if (raw && /final/i.test(raw)) {
    return 'final-balance';
  }
  return 'kickoff-deposit';
}

function mapCharge(charge: StripeCharge | null | undefined): PaymentRecord['charge'] {
  if (!charge) return null;
  return {
    id: charge.id,
    status: charge.status,
    receiptUrl: charge.receipt_url ?? null,
    email: charge.billing_details?.email ?? null,
    paidAt: toIso(charge.created ?? null)
  };
}

function mapPaymentIntent(intent: StripePaymentIntent): PaymentRecord {
  const metadata = intent.metadata ?? {};
  const charges = intent.charges?.data ?? [];
  const latestCharge = charges[0] ?? (typeof intent.latest_charge === 'object' ? intent.latest_charge : null);

  return {
    id: intent.id,
    type: resolvePaymentType(metadata),
    amount: centsToDollars(intent.amount),
    currency: normaliseCurrency(intent.currency),
    status: intent.status,
    createdAt: toIso(intent.created ?? null) ?? new Date().toISOString(),
    description: intent.description ?? null,
    metadata,
    charge: mapCharge(latestCharge)
  };
}

export async function listKickoffPayments(): Promise<{ payments: PaymentRecord[]; sample: boolean }> {
  if (!isStripeConfigured()) {
    return {
      sample: true,
      payments: [
        {
          id: 'pi_sample_deposit',
          type: 'kickoff-deposit',
          amount: 99,
          currency: 'USD',
          status: 'succeeded',
          createdAt: new Date().toISOString(),
          description: 'Kickoff deposit',
          metadata: { userId: 'sample-user', type: 'kickoff-deposit' },
          charge: {
            id: 'ch_sample',
            status: 'succeeded',
            receiptUrl: null,
            email: 'client@example.com',
            paidAt: new Date().toISOString()
          }
        }
      ]
    };
  }

  const payments: PaymentRecord[] = [];
  let startingAfter: string | undefined;
  let iterations = 0;

  while (iterations < 3) {
    const params = new URLSearchParams({ limit: '100' });
    if (startingAfter) {
      params.append('starting_after', startingAfter);
    }
    params.append('expand[]', 'data.charges');

    const response = await stripeRequest<StripeListResponse<StripePaymentIntent>>(`/payment_intents?${params.toString()}`);
    const mapped = response.data
      .filter(item => {
        const type = resolvePaymentType(item.metadata);
        return type === 'kickoff-deposit' || type === 'final-balance';
      })
      .map(mapPaymentIntent);

    payments.push(...mapped);

    if (!response.has_more || response.data.length === 0) {
      break;
    }
    startingAfter = response.data[response.data.length - 1]?.id;
    iterations += 1;
  }

  payments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0));

  return { payments, sample: false };
}

export async function getDepositSummaryForUser(userId: string): Promise<{ summary: DepositSummary; sample: boolean }> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!isStripeConfigured()) {
    return {
      sample: true,
      summary: {
        paid: false,
        status: 'pending',
        amount: 99,
        currency: 'USD',
        lastPaymentAt: null,
        receiptUrl: null
      }
    };
  }

  const { payments } = await listKickoffPayments();
  const relevant = payments.filter(payment => payment.metadata?.userId === userId && payment.type === 'kickoff-deposit');

  if (relevant.length === 0) {
    return {
      sample: false,
      summary: {
        paid: false,
        status: 'requires_payment_method',
        amount: 99,
        currency: 'USD',
        lastPaymentAt: null,
        receiptUrl: null
      }
    };
  }

  const latest = [...relevant].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0))[0];
  const paid = latest.status === 'succeeded' || latest.charge?.status === 'succeeded';

  return {
    sample: false,
    summary: {
      paid,
      status: latest.status,
      amount: latest.amount,
      currency: latest.currency,
      lastPaymentAt: latest.charge?.paidAt ?? latest.createdAt,
      receiptUrl: latest.charge?.receiptUrl ?? null
    }
  };
}

export async function createCheckoutSession(payload: {
  userId: string;
  email: string;
  name?: string | null;
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
  type?: PaymentType;
  metadata?: Record<string, string>;
}): Promise<{ id: string; url: string | null }> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('Stripe is not configured');
  }

  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('success_url', payload.successUrl);
  params.append('cancel_url', payload.cancelUrl);
  params.append('line_items[0][quantity]', '1');
  params.append('line_items[0][price_data][currency]', (payload.currency ?? 'usd').toLowerCase());
  params.append('line_items[0][price_data][unit_amount]', Math.round(payload.amount * 100).toString());
  params.append('line_items[0][price_data][product_data][name]', payload.description ?? 'Website kickoff deposit');
  params.append('allow_promotion_codes', 'true');
  params.append('customer_email', payload.email);
  params.append('client_reference_id', payload.userId);

  const type = payload.type ?? 'kickoff-deposit';
  params.append('metadata[type]', type);
  params.append('metadata[userId]', payload.userId);
  params.append('metadata[description]', payload.description ?? 'Kickoff deposit');
  params.append('metadata[environment]', process.env.NODE_ENV ?? 'development');

  if (payload.metadata) {
    for (const [key, value] of Object.entries(payload.metadata)) {
      params.append(`metadata[${key}]`, value);
    }
  }

  if (payload.name) {
    params.append('customer_creation', 'always');
    params.append('payment_intent_data[shipping][name]', payload.name);
  }

  const headers = new Headers({
    Authorization: `Bearer ${secret}`,
    'Stripe-Version': STRIPE_API_VERSION,
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: 'POST',
    headers,
    body: params,
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = data?.error;
    const message = error?.message ?? 'Unable to create checkout session.';
    throw new StripeError(message, {
      status: response.status,
      type: error?.type,
      code: error?.code
    });
  }

  return { id: data.id, url: data.url ?? null };
}
