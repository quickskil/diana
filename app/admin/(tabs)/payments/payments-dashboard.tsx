'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { PLAN_CATALOG } from '@/lib/plans';
import type { PaymentRecord, PaymentRequest } from '@/lib/types/payments';
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

type RequestPanelMode = 'create' | 'edit' | 'email' | null;

type RequestFormState = {
  userId: string;
  projectId: string | null;
  amount: string;
  currency: string;
  description: string;
  generateCheckout: boolean;
};

type RequestEmailState = {
  subject: string;
  message: string;
};

const requestEmptyForm: RequestFormState = {
  userId: '',
  projectId: null,
  amount: '',
  currency: 'usd',
  description: '',
  generateCheckout: true
};

const requestEmptyEmail: RequestEmailState = {
  subject: 'Your Business Booster payment link',
  message: 'Hi there,\n\nHere is your secure payment link for the next milestone. Please let me know once it is paid.'
};

export default function PaymentsDashboard() {
  const {
    clients,
    payments,
    paymentsLoading,
    paymentsError,
    paymentsSample,
    refreshPayments,
    paymentRequests,
    paymentRequestsLoading,
    paymentRequestsError,
    paymentRequestsSample,
    refreshPaymentRequests,
    createPaymentRequest,
    updatePaymentRequest,
    deletePaymentRequest,
    sendPaymentRequestEmail
  } = useAdmin();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [finalDescription, setFinalDescription] = useState('Final website balance');
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);
  const [finalFeedbackState, setFinalFeedbackState] = useState<'neutral' | 'error' | 'success'>('neutral');
  const [finalCheckoutUrl, setFinalCheckoutUrl] = useState<string | null>(null);
  const [finalLoading, setFinalLoading] = useState(false);
  const [finalRequestId, setFinalRequestId] = useState<string | null>(null);
  const [finalEmailSending, setFinalEmailSending] = useState(false);

  const [requestPanel, setRequestPanel] = useState<RequestPanelMode>(null);
  const [requestActive, setRequestActive] = useState<PaymentRequest | null>(null);
  const [requestForm, setRequestForm] = useState<RequestFormState>({ ...requestEmptyForm });
  const [requestEmail, setRequestEmail] = useState<RequestEmailState>({ ...requestEmptyEmail });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState<string | null>(null);
  const [requestFeedbackState, setRequestFeedbackState] = useState<'neutral' | 'success' | 'error'>('neutral');

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
      setFinalRequestId(null);
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
    setFinalRequestId(null);
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
      setFinalRequestId(null);

      const numericAmount = Number.parseFloat(finalAmount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setFinalLoading(false);
        setFinalFeedback('Enter a valid amount greater than zero.');
        setFinalFeedbackState('error');
        return;
      }

      try {
        const result = await createPaymentRequest({
          userId: selectedClient.id,
          projectId: selectedClient.onboardingProjects?.[0]?.id ?? null,
          amount: numericAmount,
          currency: 'usd',
          description: finalDescription,
          generateCheckout: true
        });
        if (!result.ok) {
          throw new Error(result.message || 'Unable to create checkout session.');
        }
        const request = result.request;
        if (request?.checkoutUrl) {
          setFinalCheckoutUrl(request.checkoutUrl);
        }
        if (request?.id) {
          setFinalRequestId(request.id);
        }
        setFinalFeedback(result.message ?? 'Checkout link ready to share.');
        setFinalFeedbackState(result.sample ? 'neutral' : 'success');
        if (result.sample) {
          setFinalFeedback(prev => `${prev ?? ''} (Stripe not configured — using sample link)`);
        }
        void refreshPayments();
        void refreshPaymentRequests();
      } catch (error) {
        setFinalFeedback((error as Error).message);
        setFinalFeedbackState('error');
      } finally {
        setFinalLoading(false);
      }
    },
    [createPaymentRequest, finalAmount, finalDescription, refreshPayments, refreshPaymentRequests, selectedClient]
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

  const handleSendFinalEmail = useCallback(async () => {
    if (!finalRequestId) return;
    setFinalEmailSending(true);
    setFinalFeedback(null);
    setFinalFeedbackState('neutral');
    try {
      const result = await sendPaymentRequestEmail(finalRequestId, {
        subject: `${finalDescription} payment`,
        message: `Hi ${selectedClient?.name || selectedClient?.email || 'there'},\n\nHere is the payment link for ${finalDescription}. Thank you!`,
        includeLink: true
      });
      if (!result.ok) {
        throw new Error(result.message || 'Unable to send payment email.');
      }
      setFinalFeedback(result.message ?? 'Email sent.');
      setFinalFeedbackState(result.sample ? 'neutral' : 'success');
      if (result.sample) {
        setFinalFeedback(prev => `${prev ?? ''} (email service not configured)`);
      }
    } catch (error) {
      setFinalFeedback((error as Error).message);
      setFinalFeedbackState('error');
    } finally {
      setFinalEmailSending(false);
    }
  }, [finalDescription, finalRequestId, selectedClient, sendPaymentRequestEmail]);

  const sortedPayments = useMemo(
    () => [...payments].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0)),
    [payments]
  );

  const openRequestPanel = (mode: RequestPanelMode, request?: PaymentRequest | null) => {
    setRequestPanel(mode);
    setRequestActive(request ?? null);
    setRequestFeedback(null);
    setRequestFeedbackState('neutral');
    setRequestSubmitting(false);
    if (mode === 'create') {
      setRequestForm({
        userId: selectedClient?.id ?? '',
        projectId: selectedClient?.onboardingProjects?.[0]?.id ?? null,
        amount: selectedClient && FINAL_BALANCE_SUGGESTIONS[selectedClient.onboardingProjects?.[0]?.data.plan ?? '']
          ? FINAL_BALANCE_SUGGESTIONS[selectedClient.onboardingProjects?.[0]?.data.plan ?? ''].toString()
          : '',
        currency: 'usd',
        description: 'Custom payment',
        generateCheckout: true
      });
    } else if (mode === 'edit' && request) {
      setRequestForm({
        userId: request.userId,
        projectId: request.projectId,
        amount: (request.amountCents / 100).toString(),
        currency: request.currency,
        description: request.description ?? '',
        generateCheckout: Boolean(request.checkoutUrl)
      });
    } else if (mode === 'email' && request) {
      setRequestEmail({
        subject: request.emailSubject || 'Your payment link',
        message:
          request.emailMessage ||
          `Hi ${clients.find(client => client.id === request.userId)?.name || 'there'},\n\nHere is your secure payment link. Please let me know if you have any questions.`
      });
    } else {
      setRequestForm({ ...requestEmptyForm, userId: selectedClient?.id ?? '' });
      setRequestEmail({ ...requestEmptyEmail });
    }
  };

  const closeRequestPanel = () => {
    setRequestPanel(null);
    setRequestActive(null);
    setRequestForm({ ...requestEmptyForm, userId: selectedClient?.id ?? '' });
    setRequestEmail({ ...requestEmptyEmail });
    setRequestSubmitting(false);
    setRequestFeedback(null);
    setRequestFeedbackState('neutral');
  };

  const handleRequestCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestSubmitting(true);
    setRequestFeedback(null);
    setRequestFeedbackState('neutral');

    const amount = Number.parseFloat(requestForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestSubmitting(false);
      setRequestFeedback('Enter a valid amount greater than zero.');
      setRequestFeedbackState('error');
      return;
    }

    if (!requestForm.userId) {
      setRequestSubmitting(false);
      setRequestFeedback('Select a client before creating a request.');
      setRequestFeedbackState('error');
      return;
    }

    const result = await createPaymentRequest({
      userId: requestForm.userId,
      projectId: requestForm.projectId,
      amount,
      currency: requestForm.currency,
      description: requestForm.description,
      generateCheckout: requestForm.generateCheckout
    });

    if (result.ok) {
      setRequestFeedback(result.message ?? 'Payment request created.');
      setRequestFeedbackState(result.sample ? 'neutral' : 'success');
      if (result.sample) {
        setRequestFeedback(prev => `${prev ?? ''} (Stripe not configured — sample link generated)`);
      }
      closeRequestPanel();
      void refreshPaymentRequests();
    } else {
      setRequestFeedback(result.message ?? 'Unable to create payment request.');
      setRequestFeedbackState('error');
    }
    setRequestSubmitting(false);
  };

  const handleRequestUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requestActive) return;
    setRequestSubmitting(true);
    setRequestFeedback(null);
    setRequestFeedbackState('neutral');

    const amount = Number.parseFloat(requestForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestSubmitting(false);
      setRequestFeedback('Enter a valid amount greater than zero.');
      setRequestFeedbackState('error');
      return;
    }

    const result = await updatePaymentRequest(requestActive.id, {
      amount,
      currency: requestForm.currency,
      description: requestForm.description,
      checkoutUrl: requestForm.generateCheckout ? requestActive.checkoutUrl : null
    });

    if (result.ok) {
      setRequestFeedback(result.message ?? 'Payment request updated.');
      setRequestFeedbackState('success');
      closeRequestPanel();
      void refreshPaymentRequests();
    } else {
      setRequestFeedback(result.message ?? 'Unable to update payment request.');
      setRequestFeedbackState('error');
    }
    setRequestSubmitting(false);
  };

  const handleRequestEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requestActive) return;
    setRequestSubmitting(true);
    setRequestFeedback(null);
    setRequestFeedbackState('neutral');

    const result = await sendPaymentRequestEmail(requestActive.id, {
      subject: requestEmail.subject,
      message: requestEmail.message,
      includeLink: true
    });

    if (result.ok) {
      setRequestFeedback(result.message ?? 'Email sent.');
      setRequestFeedbackState(result.sample ? 'neutral' : 'success');
      if (result.sample) {
        setRequestFeedback(prev => `${prev ?? ''} (email service not configured)`);
      }
      closeRequestPanel();
      void refreshPaymentRequests();
    } else {
      setRequestFeedback(result.message ?? 'Unable to send payment email.');
      setRequestFeedbackState('error');
    }
    setRequestSubmitting(false);
  };

  const handleRequestDelete = async (request: PaymentRequest) => {
    const confirmation = window.confirm('Delete this payment request?');
    if (!confirmation) return;
    const result = await deletePaymentRequest(request.id);
    if (result.ok) {
      setRequestFeedback(result.message ?? 'Payment request deleted.');
      setRequestFeedbackState('success');
      void refreshPaymentRequests();
    } else {
      setRequestFeedback(result.message ?? 'Unable to delete payment request.');
      setRequestFeedbackState('error');
    }
  };

  const renderRequestPanel = () => {
    if (!requestPanel) return null;
    const isCreate = requestPanel === 'create';
    const isEdit = requestPanel === 'edit';
    const isEmail = requestPanel === 'email';

    if (isEmail && requestActive) {
      const client = clients.find(c => c.id === requestActive.userId);
      return (
        <section className="rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">Email payment link</h3>
              <p className="mt-1 text-sm text-white/70">
                Send {client?.name || client?.email || 'the client'} their customised payment link.
              </p>
            </div>
            <button
              type="button"
              onClick={closeRequestPanel}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 hover:border-white/40 hover:text-white"
            >
              Close
            </button>
          </div>
          <form className="mt-6 space-y-4" onSubmit={event => void handleRequestEmail(event)}>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="request-email-subject">
                Subject
              </label>
              <input
                id="request-email-subject"
                type="text"
                value={requestEmail.subject}
                onChange={event => setRequestEmail(prev => ({ ...prev, subject: event.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="request-email-message">
                Message
              </label>
              <textarea
                id="request-email-message"
                rows={6}
                value={requestEmail.message}
                onChange={event => setRequestEmail(prev => ({ ...prev, message: event.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={requestSubmitting}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {requestSubmitting ? 'Sending…' : 'Send email'}
              </button>
              <button
                type="button"
                onClick={closeRequestPanel}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      );
    }

    return (
      <section className="rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              {isCreate ? 'Create payment request' : 'Edit payment request'}
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Issue one-off invoices, collect approvals, and send Stripe checkout links in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={closeRequestPanel}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 hover:border-white/40 hover:text-white"
          >
            Close
          </button>
        </div>
        <form
          className="mt-6 grid gap-5 md:grid-cols-2"
          onSubmit={event => void (isCreate ? handleRequestCreate(event) : handleRequestUpdate(event))}
        >
          <div className="md:col-span-1">
            <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="request-client">
              Client
            </label>
            <select
              id="request-client"
              value={requestForm.userId}
              onChange={event => setRequestForm(prev => ({ ...prev, userId: event.target.value }))}
              disabled={!isCreate}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
            >
              <option value="" disabled>
                Select client
              </option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name || client.email}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="request-amount">
              Amount ({requestForm.currency.toUpperCase()})
            </label>
            <input
              id="request-amount"
              type="number"
              min="1"
              step="0.01"
              value={requestForm.amount}
              onChange={event => setRequestForm(prev => ({ ...prev, amount: event.target.value }))}
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="request-description">
              Description
            </label>
            <input
              id="request-description"
              type="text"
              value={requestForm.description}
              onChange={event => setRequestForm(prev => ({ ...prev, description: event.target.value }))}
              placeholder="AI Sales Engine final balance"
              required
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="request-checkout">
              Generate checkout link
            </label>
            <select
              id="request-checkout"
              value={requestForm.generateCheckout ? 'yes' : 'no'}
              onChange={event => setRequestForm(prev => ({ ...prev, generateCheckout: event.target.value === 'yes' }))}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
            >
              <option value="yes">Yes — create Stripe checkout</option>
              <option value="no">No — track manually</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={requestSubmitting}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestSubmitting ? 'Saving…' : isCreate ? 'Create payment request' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={closeRequestPanel}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/40 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  };

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
                  <div className="mt-3 flex flex-wrap gap-2">
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
                    {finalRequestId && (
                      <button
                        type="button"
                        onClick={() => void handleSendFinalEmail()}
                        disabled={finalEmailSending}
                        className="inline-flex items-center justify-center rounded-lg border border-emerald-300/60 px-3 py-1 text-xs font-semibold text-emerald-100 hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {finalEmailSending ? 'Sending…' : 'Email link'}
                      </button>
                    )}
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

      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Manual payment requests</h2>
            <p className="text-sm text-white/70">Create, edit, and email one-off payment requests without leaving the CRM.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void refreshPaymentRequests()}
              disabled={paymentRequestsLoading}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paymentRequestsLoading ? 'Refreshing…' : 'Refresh requests'}
            </button>
            <button
              type="button"
              onClick={() => openRequestPanel('create', null)}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
            >
              New payment request
            </button>
            {paymentRequestsSample && (
              <span className="rounded-full border border-amber-300/60 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                Sample data — configure Stripe for live requests
              </span>
            )}
          </div>
        </div>

        {paymentRequestsError && (
          <p className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{paymentRequestsError}</p>
        )}
        {requestFeedback && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              requestFeedbackState === 'success'
                ? 'border border-emerald-400/50 bg-emerald-500/10 text-emerald-100'
                : requestFeedbackState === 'error'
                  ? 'border border-red-400/50 bg-red-500/10 text-red-100'
                  : 'border border-white/15 bg-black/40 text-white/70'
            }`}
          >
            {requestFeedback}
          </p>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paymentRequestsLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    Loading payment requests…
                  </td>
                </tr>
              )}
              {!paymentRequestsLoading && paymentRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    No manual payment requests yet. Create one to send a checkout link or track an offline payment.
                  </td>
                </tr>
              )}
              {!paymentRequestsLoading &&
                paymentRequests.map(request => {
                  const client = clients.find(c => c.id === request.userId);
                  return (
                    <tr key={request.id} className="hover:bg-white/5">
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{client?.name || client?.email || 'Client'}</div>
                        <div className="text-xs text-white/60">{client?.email ?? '—'}</div>
                      </td>
                      <td className="px-4 py-4 text-white/75">{formatCurrency(request.amountCents / 100, request.currency)}</td>
                      <td className="px-4 py-4 text-white/75">{request.status}</td>
                      <td className="px-4 py-4">
                        {request.checkoutUrl ? (
                          <a
                            href={request.checkoutUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-300 underline-offset-4 hover:underline"
                          >
                            Open link
                          </a>
                        ) : (
                          <span className="text-white/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-white/60">{formatDateTime(request.updatedAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openRequestPanel('edit', request)}
                            className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openRequestPanel('email', request)}
                            className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
                          >
                            Email
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleRequestDelete(request)}
                            className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 hover:border-red-400 hover:text-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      {renderRequestPanel()}
    </div>
  );
}
