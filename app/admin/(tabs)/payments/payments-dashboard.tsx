'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { PLAN_CATALOG } from '@/lib/plans';
import type { PaymentRecord } from '@/lib/types/payments';
import type { SafeUser } from '@/lib/types/user';
import { formatDateTime, useAdmin } from '../../admin-context';

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  'kickoff-deposit': 'Kickoff deposit',
  'final-balance': 'Final balance',
  other: 'Other'
};

const FINAL_BALANCE_SUGGESTIONS: Record<string, number> = {
  launch: 400,
  'launch-traffic': 1401,
  'full-funnel': 2801
};

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch {
    return `${(currency || 'USD').toUpperCase()} ${amount.toFixed(2)}`;
  }
};

const formatPaymentStatus = (value?: string | null) => {
  if (!value) return 'Unknown';
  switch (value) {
    case 'succeeded':
      return 'Paid';
    case 'processing':
      return 'Processing';
    case 'requires_action':
      return 'Action required';
    case 'requires_payment_method':
      return 'Awaiting payment method';
    case 'canceled':
      return 'Canceled';
    default:
      return value.replace(/_/g, ' ');
  }
};

function getLatestDeposit(payments: PaymentRecord[]) {
  const deposits = payments.filter(payment => payment.type === 'kickoff-deposit');
  if (deposits.length === 0) return null;
  return [...deposits].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0))[0];
}

function getFinalPayments(payments: PaymentRecord[]) {
  return payments.filter(payment => payment.type === 'final-balance');
}

function PaymentStatusPill({ status }: { status: string }) {
  let classes = 'bg-white/10 text-white/70';
  if (status === 'succeeded') {
    classes = 'bg-emerald-500/15 text-emerald-200';
  } else if (status === 'processing') {
    classes = 'bg-amber-500/15 text-amber-200';
  } else if (status.startsWith('requires')) {
    classes = 'bg-orange-500/15 text-orange-100';
  }
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}>{formatPaymentStatus(status)}</span>;
}

function ClientSelect({ clients, selectedId, onSelect }: { clients: SafeUser[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {clients.map(client => (
        <button
          key={client.id}
          type="button"
          onClick={() => onSelect(client.id)}
          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
            client.id === selectedId
              ? 'border-sky-400 bg-sky-500/10 text-white shadow-lg shadow-sky-500/20'
              : 'border-white/15 bg-black/20 text-white/70 hover:border-white/40 hover:text-white'
          }`}
        >
          <p className="text-sm font-semibold">{client.name || client.email}</p>
          <p className="text-xs text-white/50">{client.company || 'No company provided'}</p>
        </button>
      ))}
    </div>
  );
}

export default function PaymentsDashboard() {
  const {
    clients,
    payments,
    paymentsLoading,
    paymentsError,
    paymentsSample,
    refreshPayments
  } = useAdmin();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [finalDescription, setFinalDescription] = useState('Final website balance');
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);
  const [finalFeedbackState, setFinalFeedbackState] = useState<'neutral' | 'error' | 'success'>('neutral');
  const [finalCheckoutUrl, setFinalCheckoutUrl] = useState<string | null>(null);
  const [finalLoading, setFinalLoading] = useState(false);

  useEffect(() => {
    if (clients.length === 0) {
      setSelectedClientId(null);
      return;
    }
    setSelectedClientId(prev => {
      if (prev && clients.some(client => client.id === prev)) {
        return prev;
      }
      return clients[0].id;
    });
  }, [clients]);

  const selectedClient = useMemo(() => clients.find(client => client.id === selectedClientId) ?? null, [
    clients,
    selectedClientId
  ]);

  useEffect(() => {
    if (!selectedClient) {
      setFinalAmount('');
      setFinalDescription('Final website balance');
      setFinalCheckoutUrl(null);
      setFinalFeedback(null);
      setFinalFeedbackState('neutral');
      return;
    }
    const planKey = selectedClient.onboardingProjects?.[0]?.data.plan;
    if (planKey && FINAL_BALANCE_SUGGESTIONS[planKey] !== undefined) {
      setFinalAmount(FINAL_BALANCE_SUGGESTIONS[planKey].toString());
      setFinalDescription(`${PLAN_CATALOG[planKey]?.name ?? 'Website'} final balance`);
    } else {
      setFinalAmount('');
      setFinalDescription('Final website balance');
    }
    setFinalCheckoutUrl(null);
    setFinalFeedback(null);
    setFinalFeedbackState('neutral');
  }, [selectedClient]);

  const selectedClientPayments = useMemo(() => {
    if (!selectedClient) return [] as PaymentRecord[];
    return payments.filter(payment => payment.metadata?.userId === selectedClient.id);
  }, [payments, selectedClient]);

  const latestDeposit = useMemo(() => getLatestDeposit(selectedClientPayments), [selectedClientPayments]);
  const finalPayments = useMemo(() => getFinalPayments(selectedClientPayments), [selectedClientPayments]);
  const finalPaymentsSorted = useMemo(
    () => [...finalPayments].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0)),
    [finalPayments]
  );

  const handleGenerateFinalCheckout = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedClient) return;

      setFinalLoading(true);
      setFinalFeedback(null);
      setFinalFeedbackState('neutral');
      setFinalCheckoutUrl(null);

      const numericAmount = Number.parseFloat(finalAmount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setFinalLoading(false);
        setFinalFeedback('Enter a valid amount greater than zero.');
        setFinalFeedbackState('error');
        return;
      }

      try {
        const res = await fetch('/api/admin/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedClient.id,
            amount: numericAmount,
            currency: 'usd',
            description: finalDescription
          })
        });
        const data = await res.json();
        if (!res.ok || data.ok === false || !data.url) {
          throw new Error(data.message || 'Unable to create checkout session.');
        }
        setFinalCheckoutUrl(data.url as string);
        setFinalFeedback('Checkout link ready to share.');
        setFinalFeedbackState('success');
        void refreshPayments();
      } catch (error) {
        setFinalFeedback((error as Error).message);
        setFinalFeedbackState('error');
      } finally {
        setFinalLoading(false);
      }
    },
    [finalAmount, finalDescription, refreshPayments, selectedClient]
  );

  const handleCopyCheckoutUrl = useCallback(async () => {
    if (!finalCheckoutUrl) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(finalCheckoutUrl);
        setFinalFeedback('Checkout link copied to clipboard.');
        setFinalFeedbackState('success');
        return;
      }
    } catch (error) {
      console.error('Clipboard copy failed', error);
    }

    if (typeof window !== 'undefined') {
      window.prompt('Copy this checkout link', finalCheckoutUrl);
      setFinalFeedback('Checkout link ready to share.');
      setFinalFeedbackState('success');
    }
  }, [finalCheckoutUrl]);

  const sortedPayments = useMemo(
    () => [...payments].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0)),
    [payments]
  );

  return (
    <div className="space-y-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Payments & billing operations</h2>
            <p className="text-sm text-white/70">Track Stripe deposits and fire off final balances without leaving the portal.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void refreshPayments()}
              disabled={paymentsLoading}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paymentsLoading ? 'Refreshing…' : 'Refresh payments'}
            </button>
            {paymentsSample && (
              <span className="rounded-full border border-amber-300/60 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                Demo data — add STRIPE_SECRET_KEY for live payments
              </span>
            )}
          </div>
        </div>

        {paymentsError && (
          <p className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{paymentsError}</p>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paymentsLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    Loading payments…
                  </td>
                </tr>
              )}
              {!paymentsLoading && sortedPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    No Stripe activity yet. Kickoff deposits and launch balances will appear here automatically.
                  </td>
                </tr>
              )}
              {!paymentsLoading &&
                sortedPayments.map(payment => {
                  const client = clients.find(c => c.id === payment.metadata?.userId);
                  const clientName = payment.metadata?.clientName || client?.name || 'Client';
                  const clientEmail = payment.metadata?.clientEmail || client?.email || '—';
                  return (
                    <tr key={payment.id} className="hover:bg-white/5">
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{clientName}</div>
                        <div className="text-xs text-white/60">{clientEmail}</div>
                      </td>
                      <td className="px-4 py-4 text-white/75">{PAYMENT_TYPE_LABELS[payment.type] ?? payment.type}</td>
                      <td className="px-4 py-4 text-white/75">{formatCurrency(payment.amount / 100, payment.currency)}</td>
                      <td className="px-4 py-4"><PaymentStatusPill status={payment.status} /></td>
                      <td className="px-4 py-4 text-white/60">{formatDateTime(payment.createdAt)}</td>
                      <td className="px-4 py-4">
                        {payment.charge?.receiptUrl ? (
                          <a
                            href={payment.charge.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-300 underline-offset-4 hover:underline"
                          >
                            View receipt
                          </a>
                        ) : (
                          <span className="text-white/40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Client billing history</h2>
          <p className="mt-2 text-sm text-white/70">Select a client to review deposits, balances, and outstanding actions.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
            <div className="space-y-4">
              <ClientSelect
                clients={clients}
                selectedId={selectedClientId}
                onSelect={id => setSelectedClientId(id)}
              />
            </div>
            <div className="space-y-6">
              {!selectedClient ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-6 text-center text-white/60">
                  Select a client to view their billing timeline.
                </p>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold text-white">Kickoff deposit</p>
                        <p className="text-xs text-white/60">{selectedClient.email}</p>
                      </div>
                      <PaymentStatusPill status={latestDeposit?.status ?? 'pending'} />
                    </div>
                    {latestDeposit ? (
                      <div className="mt-3 space-y-1 text-sm text-white/70">
                        <p>Amount: {formatCurrency(latestDeposit.amount / 100, latestDeposit.currency)}</p>
                        <p>Updated: {formatDateTime(latestDeposit.createdAt)}</p>
                        {latestDeposit.charge?.receiptUrl && (
                          <a
                            href={latestDeposit.charge.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-300 underline-offset-4 hover:underline"
                          >
                            View receipt
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-white/60">No deposit recorded yet.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Final balances</h3>
                      <span className="text-xs text-white/50">{finalPaymentsSorted.length} payments</span>
                    </div>
                    {finalPaymentsSorted.length === 0 ? (
                      <p className="mt-3 text-sm text-white/60">No final balance collected yet.</p>
                    ) : (
                      <ul className="mt-4 space-y-3 text-sm text-white/70">
                        {finalPaymentsSorted.map(payment => (
                          <li key={payment.id} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                            <div className="flex items-center justify-between">
                              <p>{formatCurrency(payment.amount / 100, payment.currency)}</p>
                              <PaymentStatusPill status={payment.status} />
                            </div>
                            <p className="text-xs text-white/50">{formatDateTime(payment.createdAt)}</p>
                            {payment.charge?.receiptUrl && (
                              <a
                                href={payment.charge.receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-sky-300 underline-offset-4 hover:underline"
                              >
                                View receipt
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Generate final checkout</h2>
          <p className="mt-2 text-sm text-white/70">Create a one-off Stripe Checkout session in seconds.</p>

          {!selectedClient ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-black/30 px-4 py-6 text-center text-white/60">
              Select a client to configure the final balance.
            </p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={event => void handleGenerateFinalCheckout(event)}>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="final-amount">
                  Amount (USD)
                </label>
                <input
                  id="final-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={finalAmount}
                  onChange={event => setFinalAmount(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                  placeholder="1401"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="final-description">
                  Description
                </label>
                <input
                  id="final-description"
                  type="text"
                  value={finalDescription}
                  onChange={event => setFinalDescription(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                  placeholder="AI Sales Engine final balance"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={finalLoading}
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {finalLoading ? 'Creating checkout…' : 'Generate checkout link'}
              </button>
              {finalCheckoutUrl && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  <p className="font-semibold">Checkout ready</p>
                  <p className="break-words text-xs">{finalCheckoutUrl}</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={finalCheckoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-emerald-300/60 px-3 py-1 text-xs font-semibold text-emerald-100 hover:border-emerald-200"
                    >
                      Open checkout
                    </a>
                    <button
                      type="button"
                      onClick={() => void handleCopyCheckoutUrl()}
                      className="inline-flex items-center justify-center rounded-lg border border-emerald-300/60 px-3 py-1 text-xs font-semibold text-emerald-100 hover:border-emerald-200"
                    >
                      Copy link
                    </button>
                  </div>
                </div>
              )}
              {finalFeedback && (
                <p
                  className={`rounded-xl px-3 py-2 text-xs ${
                    finalFeedbackState === 'success'
                      ? 'bg-emerald-500/10 text-emerald-200'
                      : finalFeedbackState === 'error'
                        ? 'bg-red-500/10 text-red-200'
                        : 'bg-white/10 text-white/70'
                  }`}
                >
                  {finalFeedback}
                </p>
              )}
            </form>
          )}
        </aside>
      </section>
    </div>
  );
}

