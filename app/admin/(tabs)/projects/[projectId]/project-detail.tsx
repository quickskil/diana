'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import { PLAN_CATALOG } from '@/lib/plans';
import type { OnboardingProject, OnboardingStatus } from '@/lib/types/user';
import type { PaymentRequest } from '@/lib/types/payments';
import { formatDateTime, useAdmin } from '../../../admin-context';
import { formatCurrency } from '../../payments/payment-utils';

type StatusOption = { value: OnboardingStatus; label: string; description: string };

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'not-started', label: 'Not started', description: 'Invite client to begin onboarding' },
  { value: 'submitted', label: 'Submitted', description: 'Awaiting team review' },
  { value: 'in-progress', label: 'In progress', description: 'Automation team working on deliverables' },
  { value: 'launch-ready', label: 'Launch-ready', description: 'Signed off and ready to go live' }
];

const IMPORTANT_FIELDS: { key: keyof OnboardingProject['data']; label: string }[] = [
  { key: 'companyName', label: 'Company name' },
  { key: 'website', label: 'Website' },
  { key: 'billingContactName', label: 'Billing contact' },
  { key: 'billingContactEmail', label: 'Billing email' },
  { key: 'billingNotes', label: 'Billing notes' },
  { key: 'goals', label: 'Goals' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'launchTimeline', label: 'Launch timeline' },
  { key: 'notes', label: 'General notes' }
];

const formatRequestStatus = (value: string) => value.replace(/-/g, ' ');

interface ProjectDetailProps {
  projectId: string;
}

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const {
    clients,
    payments,
    paymentRequests,
    updateOnboardingStatus,
    sendUserEmail,
    createPaymentRequest,
    sendPaymentRequestEmail,
    refreshPaymentRequests,
    refreshPayments
  } = useAdmin();

  const record = useMemo(() => {
    for (const client of clients) {
      const project = client.onboardingProjects?.find(item => item.id === projectId);
      if (project) {
        return { client, project };
      }
    }
    return null;
  }, [clients, projectId]);

  const [statusValue, setStatusValue] = useState<OnboardingStatus>(record?.project.status ?? 'submitted');
  const [statusNote, setStatusNote] = useState(record?.project.statusNote ?? '');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusFeedbackState, setStatusFeedbackState] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const [emailSubject, setEmailSubject] = useState('A quick update on your project');
  const [emailMessage, setEmailMessage] = useState(
    'Hi there,\n\nJust wanted to update you on your onboarding project. Let me know if you have any questions!'
  );
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);
  const [emailFeedbackState, setEmailFeedbackState] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('Custom milestone payment');
  const [paymentFeedback, setPaymentFeedback] = useState<string | null>(null);
  const [paymentFeedbackState, setPaymentFeedbackState] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [paymentCheckoutUrl, setPaymentCheckoutUrl] = useState<string | null>(null);
  const [paymentRequestId, setPaymentRequestId] = useState<string | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentEmailSending, setPaymentEmailSending] = useState(false);
  const [requestActionState, setRequestActionState] = useState<
    Record<string, { sending: boolean; feedback: string | null; variant: 'neutral' | 'success' | 'error' }>
  >({});

  const updateRequestActionState = useCallback(
    (requestId: string, partial: Partial<{ sending: boolean; feedback: string | null; variant: 'neutral' | 'success' | 'error' }>) => {
      setRequestActionState(prev => {
        const current = prev[requestId] ?? { sending: false, feedback: null, variant: 'neutral' as const };
        return {
          ...prev,
          [requestId]: {
            ...current,
            ...partial
          }
        };
      });
    },
    []
  );

  if (!record) {
    return (
      <section className="rounded-3xl border border-white/10 bg-black/40 p-10 text-white">
        <h2 className="text-2xl font-semibold">Project not found</h2>
        <p className="mt-2 text-sm text-white/70">We could not locate that onboarding record. It may have been archived or deleted.</p>
        <Link
          href="/admin/projects"
          className="mt-6 inline-flex items-center rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
        >
          Back to projects
        </Link>
      </section>
    );
  }

  const { client, project } = record;
  const plan = PLAN_CATALOG[project.data.plan];

  const relatedStripePayments = useMemo(
    () => payments.filter(payment => payment.metadata?.userId === client.id),
    [client.id, payments]
  );

  const relatedRequests = useMemo(
    () => paymentRequests.filter(request => request.userId === client.id && (!request.projectId || request.projectId === project.id)),
    [client.id, paymentRequests, project.id]
  );

  const handleStatusSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusSubmitting(true);
    setStatusFeedback(null);
    setStatusFeedbackState('neutral');
    const result = await updateOnboardingStatus({
      userId: client.id,
      projectId: project.id,
      status: statusValue,
      note: statusNote
    });
    if (result.ok) {
      setStatusFeedback(result.message ?? 'Status updated.');
      setStatusFeedbackState('success');
    } else {
      setStatusFeedback(result.message ?? 'Unable to update status.');
      setStatusFeedbackState('error');
    }
    setStatusSubmitting(false);
  };

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailSubmitting(true);
    setEmailFeedback(null);
    setEmailFeedbackState('neutral');
    const result = await sendUserEmail(client.id, { subject: emailSubject, message: emailMessage });
    if (result.ok) {
      setEmailFeedback(result.message ?? 'Email sent.');
      setEmailFeedbackState(result.sample ? 'neutral' : 'success');
      if (result.sample) {
        setEmailFeedback(prev => `${prev ?? ''} (email service not configured)`);
      }
    } else {
      setEmailFeedback(result.message ?? 'Unable to send email.');
      setEmailFeedbackState('error');
    }
    setEmailSubmitting(false);
  };

  const handleCreatePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentSubmitting(true);
    setPaymentFeedback(null);
    setPaymentFeedbackState('neutral');
    const amount = Number.parseFloat(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentFeedback('Enter a valid amount greater than zero.');
      setPaymentFeedbackState('error');
      setPaymentSubmitting(false);
      return;
    }
    const result = await createPaymentRequest({
      userId: client.id,
      projectId: project.id,
      amount,
      currency: 'usd',
      description: paymentDescription,
      generateCheckout: true
    });
    if (result.ok) {
      setPaymentFeedback(result.message ?? 'Payment request created.');
      setPaymentFeedbackState(result.sample ? 'neutral' : 'success');
      if (result.sample) {
        setPaymentFeedback(prev => `${prev ?? ''} (Stripe not configured — sample link generated)`);
      }
      setPaymentCheckoutUrl(result.request?.checkoutUrl ?? null);
      setPaymentRequestId(result.request?.id ?? null);
      setPaymentAmount('');
      setPaymentDescription('Custom milestone payment');
      void refreshPaymentRequests();
      void refreshPayments();
    } else {
      setPaymentFeedback(result.message ?? 'Unable to create payment request.');
      setPaymentFeedbackState('error');
    }
    setPaymentSubmitting(false);
  };

  const handleEmailPaymentLink = async () => {
    if (!paymentRequestId) return;
    setPaymentEmailSending(true);
    setPaymentFeedback(null);
    setPaymentFeedbackState('neutral');
    const result = await sendPaymentRequestEmail(paymentRequestId, {
      subject: paymentDescription,
      message: `Hi ${client.name || client.email},\n\nHere is the payment link for ${paymentDescription}. Thank you!`,
      includeLink: true
    });
    if (result.ok) {
      setPaymentFeedback(result.message ?? 'Email sent.');
      setPaymentFeedbackState(result.sample ? 'neutral' : 'success');
      if (result.sample) {
        setPaymentFeedback(prev => `${prev ?? ''} (email service not configured)`);
      }
      void refreshPaymentRequests();
    } else {
      setPaymentFeedback(result.message ?? 'Unable to send payment email.');
      setPaymentFeedbackState('error');
    }
    setPaymentEmailSending(false);
  };

  const handleEmailExistingRequest = useCallback(
    async (request: PaymentRequest) => {
      updateRequestActionState(request.id, { sending: true, feedback: null, variant: 'neutral' });
      const subject = request.emailSubject || request.description || 'Your Business Booster payment link';
      const message =
        request.emailMessage ||
        `Hi ${client.name || client.email},\n\nHere is your payment link for ${request.description || 'your project milestone'}. Thank you!`;

      try {
        const result = await sendPaymentRequestEmail(request.id, { subject, message, includeLink: true });
        if (result.ok) {
          updateRequestActionState(request.id, {
            sending: false,
            feedback: `${result.message ?? 'Email sent.'}${result.sample ? ' (email service not configured)' : ''}`,
            variant: result.sample ? 'neutral' : 'success'
          });
          void refreshPaymentRequests();
        } else {
          updateRequestActionState(request.id, {
            sending: false,
            feedback: result.message ?? 'Unable to send payment email.',
            variant: 'error'
          });
        }
      } catch (error) {
        updateRequestActionState(request.id, {
          sending: false,
          feedback: (error as Error).message,
          variant: 'error'
        });
      }
    },
    [client.email, client.name, refreshPaymentRequests, sendPaymentRequestEmail, updateRequestActionState]
  );

  const handleCopyRequestLink = useCallback(
    async (request: PaymentRequest) => {
      if (!request.checkoutUrl) return;
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(request.checkoutUrl);
          updateRequestActionState(request.id, {
            sending: false,
            feedback: 'Checkout link copied to clipboard.',
            variant: 'success'
          });
          return;
        }
      } catch (error) {
        console.error('Clipboard copy failed', error);
      }

      if (typeof window !== 'undefined') {
        window.prompt('Copy this checkout link', request.checkoutUrl);
        updateRequestActionState(request.id, {
          sending: false,
          feedback: 'Checkout link ready to share.',
          variant: 'success'
        });
      } else {
        updateRequestActionState(request.id, {
          sending: false,
          feedback: 'Unable to copy link in this environment.',
          variant: 'error'
        });
      }
    },
    [updateRequestActionState]
  );

  return (
    <div className="space-y-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-white/60 hover:text-white"
            >
              ← Back to projects
            </Link>
            <h1 className="mt-3 text-3xl font-semibold text-white">{client.name || client.email}</h1>
            <p className="mt-1 text-sm text-white/70">
              {plan?.name ?? project.data.plan} • Created {formatDateTime(project.createdAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-right text-sm text-white/70">
            <p className="text-xs uppercase tracking-wide text-white/50">Project ID</p>
            <p className="font-mono text-white/80">{project.id}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Status</p>
            <p className="mt-2 text-lg font-semibold capitalize text-white">{project.status.replace(/-/g, ' ')}</p>
            <p className="mt-2 text-xs text-white/60">Last updated {formatDateTime(project.statusUpdatedAt)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Primary metric</p>
            <p className="mt-2 text-lg font-semibold text-white">{project.data.primaryMetric}</p>
            <p className="mt-2 text-xs text-white/60">Monthly ad budget: {project.data.monthlyAdBudget || 'N/A'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Contact</p>
            <p className="mt-2 text-lg font-semibold text-white">{project.data.billingContactName}</p>
            <p className="mt-2 text-xs text-white/60">{project.data.billingContactEmail}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Update project status</h2>
          <p className="mt-2 text-sm text-white/70">Change the delivery stage and leave an internal note for the team.</p>
          <form className="mt-5 space-y-4" onSubmit={event => void handleStatusSubmit(event)}>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="project-status">
                Status
              </label>
              <select
                id="project-status"
                value={statusValue}
                onChange={event => setStatusValue(event.target.value as OnboardingStatus)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} — {option.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="project-note">
                Status note
              </label>
              <textarea
                id="project-note"
                rows={4}
                value={statusNote}
                onChange={event => setStatusNote(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={statusSubmitting}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {statusSubmitting ? 'Saving…' : 'Update status'}
              </button>
              {statusFeedback && (
                <span
                  className={`text-xs ${
                    statusFeedbackState === 'success'
                      ? 'text-emerald-200'
                      : statusFeedbackState === 'error'
                        ? 'text-red-200'
                        : 'text-white/70'
                  }`}
                >
                  {statusFeedback}
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Email the client</h2>
          <p className="mt-2 text-sm text-white/70">Send quick updates without leaving the CRM.</p>
          <form className="mt-5 space-y-4" onSubmit={event => void handleSendEmail(event)}>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="email-subject-project">
                Subject
              </label>
              <input
                id="email-subject-project"
                type="text"
                value={emailSubject}
                onChange={event => setEmailSubject(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="email-message-project">
                Message
              </label>
              <textarea
                id="email-message-project"
                rows={5}
                value={emailMessage}
                onChange={event => setEmailMessage(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={emailSubmitting}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {emailSubmitting ? 'Sending…' : 'Send email'}
              </button>
              {emailFeedback && (
                <span
                  className={`text-xs ${
                    emailFeedbackState === 'success'
                      ? 'text-emerald-200'
                      : emailFeedbackState === 'error'
                        ? 'text-red-200'
                        : 'text-white/70'
                  }`}
                >
                  {emailFeedback}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Create payment request</h2>
          <p className="mt-2 text-sm text-white/70">
            Generate a payment link for this project and send it directly from the admin panel.
          </p>
          <form className="mt-5 space-y-4" onSubmit={event => void handleCreatePayment(event)}>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="project-payment-amount">
                Amount (USD)
              </label>
              <input
                id="project-payment-amount"
                type="number"
                min="1"
                step="0.01"
                value={paymentAmount}
                onChange={event => setPaymentAmount(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="project-payment-description">
                Description
              </label>
              <input
                id="project-payment-description"
                type="text"
                value={paymentDescription}
                onChange={event => setPaymentDescription(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={paymentSubmitting}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentSubmitting ? 'Creating…' : 'Generate payment link'}
              </button>
              {paymentCheckoutUrl && (
                <button
                  type="button"
                  onClick={() => void handleEmailPaymentLink()}
                  disabled={paymentEmailSending}
                  className="rounded-xl border border-emerald-300/60 px-4 py-2 text-sm text-emerald-200 hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paymentEmailSending ? 'Emailing…' : 'Email link'}
                </button>
              )}
            </div>
            {paymentCheckoutUrl && (
              <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-xs text-emerald-100">
                <p className="font-semibold">Checkout ready</p>
                <p className="break-words">{paymentCheckoutUrl}</p>
              </div>
            )}
            {paymentFeedback && (
              <p
                className={`text-xs ${
                  paymentFeedbackState === 'success'
                    ? 'text-emerald-200'
                    : paymentFeedbackState === 'error'
                      ? 'text-red-200'
                      : 'text-white/70'
                }`}
              >
                {paymentFeedback}
              </p>
            )}
          </form>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Key onboarding data</h2>
          <div className="mt-4 grid gap-4">
            {IMPORTANT_FIELDS.map(field => {
              const value = project.data[field.key] as string;
              if (!value) return null;
              return (
                <div key={field.key} className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/50">{field.label}</p>
                  <p className="mt-1 text-sm text-white/80 whitespace-pre-wrap">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white">Payment activity</h2>
        <p className="mt-2 text-sm text-white/70">
          Track every Stripe payment and manual invoice connected to this project.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h3 className="text-lg font-semibold text-white">Manual payment requests</h3>
            {relatedRequests.length === 0 ? (
              <p className="mt-3 text-sm text-white/60">No payment requests created yet.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm text-white/70">
                {relatedRequests.map(request => (
                  <li key={request.id} className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between">
                      <p>{formatCurrency(request.amountCents / 100, request.currency)}</p>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                        {formatRequestStatus(request.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/50">Updated {formatDateTime(request.updatedAt)}</p>
                    {request.checkoutUrl && (
                      <a
                        href={request.checkoutUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-xs text-sky-300 underline-offset-4 hover:underline"
                      >
                        Open checkout
                      </a>
                    )}
                    {request.emailSubject && (
                      <p className="mt-2 text-xs text-white/60">Last email: {request.emailSubject}</p>
                    )}
                    {request.checkoutUrl && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void handleCopyRequestLink(request)}
                          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
                        >
                          Copy link
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleEmailExistingRequest(request)}
                          disabled={requestActionState[request.id]?.sending}
                          className="rounded-lg border border-emerald-300/60 px-3 py-1 text-xs text-emerald-200 hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {requestActionState[request.id]?.sending ? 'Emailing…' : 'Email link'}
                        </button>
                      </div>
                    )}
                    {requestActionState[request.id]?.feedback && (
                      <p
                        className={`mt-2 text-xs ${
                          requestActionState[request.id]?.variant === 'success'
                            ? 'text-emerald-200'
                            : requestActionState[request.id]?.variant === 'error'
                              ? 'text-red-200'
                              : 'text-white/70'
                        }`}
                      >
                        {requestActionState[request.id]?.feedback}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h3 className="text-lg font-semibold text-white">Stripe payments</h3>
            {relatedStripePayments.length === 0 ? (
              <p className="mt-3 text-sm text-white/60">No Stripe payments recorded yet.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm text-white/70">
                {relatedStripePayments.map(payment => (
                  <li key={payment.id} className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-center justify-between">
                      <p>{formatCurrency(payment.amount / 100, payment.currency)}</p>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                        {formatPaymentStatus(payment.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/50">{formatDateTime(payment.createdAt)}</p>
                    {payment.charge?.receiptUrl && (
                      <a
                        href={payment.charge.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-xs text-sky-300 underline-offset-4 hover:underline"
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
      </section>
    </div>
  );
}

function formatPaymentStatus(status: string) {
  if (status === 'succeeded') return 'Paid';
  if (status === 'processing') return 'Processing';
  if (status.startsWith('requires')) return 'Action required';
  return status;
}
