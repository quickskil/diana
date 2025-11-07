'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CATALOG } from '@/lib/plans';
import type { OnboardingStatus } from '@/lib/types/user';
import type { PaymentRecord } from '@/lib/types/payments';

interface CalAttendee {
  name?: string;
  email?: string;
}

interface CalEvent {
  id: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  organizer?: string;
  location?: string;
  attendees?: CalAttendee[];
  bookingUrl?: string;
  description?: string;
}

const formatDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const statusLabelMap: Record<OnboardingStatus, string> = {
  'not-started': 'Not started',
  'submitted': 'Submitted for review',
  'in-progress': 'In progress',
  'launch-ready': 'Launch-ready'
};

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

export default function AdminView() {
  const router = useRouter();
  const { hydrated, currentUser, users, updateOnboardingStatus } = useAuth();
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<OnboardingStatus>('not-started');
  const [statusNote, setStatusNote] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<boolean | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentsSample, setPaymentsSample] = useState(false);
  const [finalAmount, setFinalAmount] = useState('');
  const [finalDescription, setFinalDescription] = useState('Final website balance');
  const [finalFeedback, setFinalFeedback] = useState<string | null>(null);
  const [finalFeedbackState, setFinalFeedbackState] = useState<'neutral' | 'error' | 'success'>('neutral');
  const [finalCheckoutUrl, setFinalCheckoutUrl] = useState<string | null>(null);
  const [finalLoading, setFinalLoading] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }
    setReady(true);
  }, [currentUser, hydrated, router]);

  const clients = useMemo(() => users.filter(u => u.role === 'client'), [users]);
  const onboardedClients = useMemo(
    () => clients.filter(c => Array.isArray(c.onboardingProjects) && c.onboardingProjects.length > 0),
    [clients]
  );

  useEffect(() => {
    if (clients.length === 0) {
      setSelectedClientId(null);
      return;
    }
    setSelectedClientId(prev => {
      if (prev && clients.some(c => c.id === prev)) {
        return prev;
      }
      return clients[0].id;
    });
  }, [clients]);

  const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId) ?? null, [clients, selectedClientId]);

  useEffect(() => {
    if (!selectedClient?.onboardingProjects?.length) {
      setSelectedProjectId(null);
      return;
    }
    setSelectedProjectId(prev => {
      if (prev && selectedClient.onboardingProjects?.some(project => project.id === prev)) {
        return prev;
      }
      return selectedClient.onboardingProjects[0]?.id ?? null;
    });
  }, [selectedClient]);

  const selectedProject = useMemo(() => {
    if (!selectedClient?.onboardingProjects?.length) {
      return null;
    }
    const fallback = selectedClient.onboardingProjects[0] ?? null;
    if (!selectedProjectId) {
      return fallback;
    }
    return selectedClient.onboardingProjects.find(project => project.id === selectedProjectId) ?? fallback;
  }, [selectedClient?.onboardingProjects, selectedProjectId]);

  const selectedClientEvents = useMemo(() => {
    if (!selectedClient?.email) return [] as CalEvent[];
    const email = selectedClient.email.toLowerCase();
    return events.filter(event =>
      event.attendees?.some(att => att.email?.toLowerCase() === email) ||
      event.organizer?.toLowerCase() === email
    );
  }, [events, selectedClient?.email]);

  useEffect(() => {
    if (!selectedProject) {
      setStatusDraft('not-started');
      setStatusNote('');
      setStatusFeedback(null);
      setStatusSuccess(null);
      return;
    }
    setStatusDraft(selectedProject.status ?? 'not-started');
    setStatusNote(selectedProject.statusNote ?? '');
    setStatusFeedback(null);
    setStatusSuccess(null);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedClient) {
      setFinalAmount('');
      setFinalDescription('Final website balance');
      setFinalCheckoutUrl(null);
      setFinalFeedback(null);
      setFinalFeedbackState('neutral');
      return;
    }
    const planKey = selectedProject?.data.plan;
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
  }, [selectedClient, selectedProject]);

  const statusOptions: { value: OnboardingStatus; label: string; description: string }[] = [
    { value: 'not-started', label: 'Not started', description: 'Waiting for onboarding submission.' },
    { value: 'submitted', label: 'Submitted for review', description: 'Client has delivered onboarding details.' },
    { value: 'in-progress', label: 'In progress', description: 'Strategy, creative, or AI training underway.' },
    { value: 'launch-ready', label: 'Launch-ready', description: 'Green-lit for go-live and automation handoff.' }
  ];

  const formatCurrency = useCallback((amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount);
    } catch {
      return `${(currency || 'USD').toUpperCase()} ${amount.toFixed(2)}`;
    }
  }, []);

  const selectedClientPayments = useMemo(() => {
    if (!selectedClient) return [] as PaymentRecord[];
    return payments.filter(payment => payment.metadata?.userId === selectedClient.id);
  }, [payments, selectedClient]);

  const latestDeposit = useMemo(() => {
    const deposits = selectedClientPayments.filter(payment => payment.type === 'kickoff-deposit');
    if (deposits.length === 0) return null;
    return [...deposits].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0))[0];
  }, [selectedClientPayments]);

  const depositPaid = Boolean(
    latestDeposit && (latestDeposit.status === 'succeeded' || latestDeposit.charge?.status === 'succeeded')
  );

  const finalPayments = useMemo(
    () => selectedClientPayments.filter(payment => payment.type === 'final-balance'),
    [selectedClientPayments]
  );

  const finalPaymentsSorted = useMemo(
    () => [...finalPayments].sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0)),
    [finalPayments]
  );

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedClient || !selectedProject) {
      setStatusFeedback('Client has not submitted onboarding yet.');
      return;
    }
    setStatusSaving(true);
    setStatusFeedback(null);
    setStatusSuccess(null);
    const result = await updateOnboardingStatus({
      userId: selectedClient.id,
      projectId: selectedProject.id,
      status: statusDraft,
      note: statusNote
    });
    if (!result.ok) {
      setStatusFeedback(result.message ?? 'Unable to update status.');
      setStatusSuccess(false);
      setStatusSaving(false);
      return;
    }
    setStatusFeedback(result.message ?? 'Status updated.');
    setStatusSuccess(true);
    setStatusSaving(false);
  }, [selectedClient, selectedProject, statusDraft, statusNote, updateOnboardingStatus]);

  const refreshEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const res = await fetch('/api/cal-events', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to load events from Cal.com');
      }
      setEvents(Array.isArray(data.events) ? data.events : []);
      setUsingSampleData(Boolean(data.sample));
    } catch (error) {
      setEventsError((error as Error).message);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const refreshPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const res = await fetch('/api/admin/payments', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to load payments.');
      }
      setPayments(Array.isArray(data.payments) ? data.payments : []);
      setPaymentsSample(Boolean(data.sample));
    } catch (error) {
      setPaymentsError((error as Error).message);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (!ready) return;
    void refreshEvents();
    void refreshPayments();
  }, [ready, refreshEvents, refreshPayments]);

  if (!ready) {
    return (
      <main id="main" className="container py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-white/80">
          Checking admin access…
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-r from-black/70 via-black/40 to-sky-900/30 p-10 text-white shadow-lg">
          <h1 className="text-3xl font-semibold md:text-4xl">Admin control centre</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Review onboarding submissions, monitor Stripe deposits, and keep tabs on every booking pulled from Cal.com.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5">
              <div className="text-xs uppercase tracking-wide text-white/60">Total clients</div>
              <div className="mt-1 text-2xl font-semibold">{clients.length}</div>
              <div className="text-sm text-white/60">Accounts created via the portal</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5">
              <div className="text-xs uppercase tracking-wide text-white/60">Onboarding complete</div>
              <div className="mt-1 text-2xl font-semibold">{onboardedClients.length}</div>
              <div className="text-sm text-white/60">Ready for strategy call handoff</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5">
              <div className="text-xs uppercase tracking-wide text-white/60">Upcoming events</div>
              <div className="mt-1 text-2xl font-semibold">{events.length}</div>
              <div className="text-sm text-white/60">Synced from Cal.com</div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Client onboarding overview</h2>
              <p className="text-sm text-white/70">Track plan selections, goals, and launch timelines.</p>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Primary metric</th>
                  <th className="px-4 py-3">Launch timeline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cal.com link</th>
                  <th className="px-4 py-3">Last updated</th>
                  <th className="px-4 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                      No client accounts yet. Invite teams to register via the portal to populate this view.
                    </td>
                  </tr>
                ) : (
                  clients.map(client => {
                    const projects = client.onboardingProjects ?? [];
                    const primary = projects[0] ?? null;
                    const planName = primary ? PLAN_CATALOG[primary.data.plan]?.name ?? primary.data.plan : '—';
                    return (
                      <tr key={client.id} className={`hover:bg-white/5 ${client.id === selectedClientId ? 'bg-white/5' : ''}`}>
                        <td className="px-4 py-4">
                          <div className="font-medium text-white">{client.name || 'Unnamed client'}</div>
                          <div className="text-xs text-white/60">{client.email}</div>
                          {client.company && <div className="text-xs text-white/55">{client.company}</div>}
                        </td>
                        <td className="px-4 py-4 text-white/75">{planName}</td>
                        <td className="px-4 py-4 text-white/75">{primary?.data.primaryMetric ?? '—'}</td>
                        <td className="px-4 py-4 text-white/75">{primary?.data.launchTimeline || '—'}</td>
                        <td className="px-4 py-4 text-white/75">{primary ? statusLabelMap[primary.status ?? 'submitted'] : 'Not started'}</td>
                        <td className="px-4 py-4">
                          {primary?.data.calLink ? (
                            <a
                              href={primary.data.calLink}
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
                        <td className="px-4 py-4 text-white/60">{primary?.completedAt ? formatDate(primary.completedAt) : 'Not submitted'}</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClientId(client.id);
                              setSelectedProjectId(primary?.id ?? null);
                            }}
                            className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/40 hover:text-white"
                          >
                            View
                            {projects.length > 1 && (
                              <span className="ml-1 rounded-full border border-white/30 px-1.5 text-[10px] text-white/60">
                                +{projects.length - 1}
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Onboarding dossier</h2>
              <p className="text-sm text-white/70">Review the full intake and keep teams aligned on progress.</p>
            </div>
          </div>

          {!selectedClient ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/60">Select a client from the table above to view their onboarding details.</p>
          ) : !selectedProject ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/70">
                <h3 className="text-lg font-semibold text-white">{selectedClient.name || selectedClient.email}</h3>
                <p className="mt-2 text-sm text-white/65">We’re still waiting on their onboarding submission.</p>
              </div>
              <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
                <p>Send a nudge so they can provide plan selection, creative inputs, and AI voice scripting requirements.</p>
              </aside>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
              <div className="space-y-6">
                {selectedClient.onboardingProjects && selectedClient.onboardingProjects.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedClient.onboardingProjects.map(project => {
                      const active = project.id === selectedProject.id;
                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => setSelectedProjectId(project.id)}
                          className={`rounded-full border px-3 py-1 text-xs transition ${active ? 'border-sky-400 bg-sky-500/20 text-white' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                        >
                          {project.label || 'Project'}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <h3 className="text-lg font-semibold text-white">Rollout foundations</h3>
                  <dl className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
                    <div>
                      <dt className="text-white/60">Plan</dt>
                      <dd>{PLAN_CATALOG[selectedProject.data.plan]?.name ?? selectedProject.data.plan}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Primary metric</dt>
                      <dd>{selectedProject.data.primaryMetric || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Billing contact</dt>
                      <dd>{selectedProject.data.billingContactName || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Billing email</dt>
                      <dd>{selectedProject.data.billingContactEmail || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Launch timeline</dt>
                      <dd>{selectedProject.data.launchTimeline || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Monthly ad budget</dt>
                      <dd>{selectedProject.data.monthlyAdBudget || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Goals</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.goals || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Challenges</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.challenges || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Notes</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.notes || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Billing notes</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.billingNotes || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <h3 className="text-lg font-semibold text-white">Systems & automation</h3>
                  <dl className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
                    <div>
                      <dt className="text-white/60">CRM tools</dt>
                      <dd>{selectedProject.data.crmTools || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Voice coverage</dt>
                      <dd>{selectedProject.data.voiceCoverage || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Cal.com link</dt>
                      <dd>
                        {selectedProject.data.calLink ? (
                          <a className="text-sky-300 underline-offset-4 hover:underline" href={selectedProject.data.calLink} target="_blank" rel="noreferrer">
                            {selectedProject.data.calLink}
                          </a>
                        ) : (
                          '—'
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Team size</dt>
                      <dd>{selectedProject.data.teamSize || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Integrations</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.integrations || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <h3 className="text-lg font-semibold text-white">Creative & voice agent inputs</h3>
                  <dl className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Target audience</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.targetAudience || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Value proposition</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.uniqueValueProp || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Offer details</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.offerDetails || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Brand voice</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.brandVoice || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Ad channels</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.adChannels || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Follow-up process</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.followUpProcess || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Voice agent instructions</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedProject.data.receptionistInstructions || '—'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <aside className="space-y-5 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/75">
                <div>
                  <h3 className="text-base font-semibold text-white">Status tracker</h3>
                  <p className="mt-1 text-xs text-white/60">Align delivery pods around where this client sits in the rollout.</p>
                  <label htmlFor="statusSelect" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-white/60">
                    Onboarding status
                  </label>
                  <select
                    id="statusSelect"
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value as OnboardingStatus)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-white/60">
                    {statusOptions.find(option => option.value === statusDraft)?.description ?? ''}
                  </p>
                  <label htmlFor="statusNote" className="mt-4 block text-xs font-semibold uppercase tracking-wide text-white/60">
                    Internal note
                  </label>
                  <textarea
                    id="statusNote"
                    value={statusNote}
                    onChange={(event) => setStatusNote(event.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                    placeholder="Share blockers, owner, or next action for this rollout."
                  />
                  <button
                    type="button"
                    onClick={() => void handleStatusUpdate()}
                    disabled={statusSaving}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {statusSaving ? 'Saving…' : 'Update status'}
                  </button>
                  {statusFeedback && (
                    <p className={`mt-3 rounded-xl px-3 py-2 text-xs ${statusSuccess ? 'bg-emerald-500/10 text-emerald-200' : 'bg-red-500/10 text-red-200'}`}>
                      {statusFeedback}
                    </p>
                  )}
                  {selectedProject.statusUpdatedAt && (
                    <p className="mt-3 text-[0.65rem] uppercase tracking-wide text-white/50">
                      Last updated {formatDate(selectedProject.statusUpdatedAt)}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/60">
                  <p className="font-semibold text-white">Client record</p>
                  <p className="mt-2 break-words">{selectedClient.email}</p>
                  {selectedClient.company && <p className="mt-1">{selectedClient.company}</p>}
                  <p className="mt-1">Joined {formatDate(selectedClient.createdAt)}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/60">
                  <p className="font-semibold text-white">Cal.com bookings</p>
                  {eventsLoading ? (
                    <p className="mt-2 text-white/60">Loading…</p>
                  ) : selectedClientEvents.length === 0 ? (
                    <p className="mt-2 text-white/60">No linked events yet.</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-white/70">
                      {selectedClientEvents.map(event => (
                        <li key={event.id} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                          <p className="text-white">{event.title || 'Untitled event'}</p>
                          <p className="text-[0.7rem] text-white/60">{formatDate(event.startTime)} → {formatDate(event.endTime)}</p>
                          {event.bookingUrl && (
                            <a className="mt-1 block text-[0.7rem] text-sky-300 underline-offset-4 hover:underline" href={event.bookingUrl} target="_blank" rel="noreferrer">
                              View booking
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </aside>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
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

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="overflow-x-auto">
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
                      <td colSpan={6} className="px-4 py-6 text-center text-white/60">Loading payments…</td>
                    </tr>
                  )}
                  {!paymentsLoading && payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                        No Stripe activity yet. Kickoff deposits and launch balances will appear here automatically.
                      </td>
                    </tr>
                  )}
                  {!paymentsLoading &&
                    payments.map(payment => {
                      const client = clients.find(c => c.id === payment.metadata?.userId);
                      const clientName = payment.metadata?.clientName || client?.name || 'Client';
                      const clientEmail = payment.metadata?.clientEmail || client?.email || '—';
                      const statusClass =
                        payment.status === 'succeeded'
                          ? 'bg-emerald-500/15 text-emerald-200'
                          : payment.status === 'processing'
                            ? 'bg-sky-500/15 text-sky-200'
                            : payment.status === 'canceled'
                              ? 'bg-white/10 text-white/70'
                              : 'bg-amber-500/15 text-amber-200';

                      return (
                        <tr key={payment.id} className="hover:bg-white/5">
                          <td className="px-4 py-4">
                            <div className="font-medium text-white">{clientName}</div>
                            <div className="text-xs text-white/60">{clientEmail}</div>
                          </td>
                          <td className="px-4 py-4 text-white/75">{PAYMENT_TYPE_LABELS[payment.type] ?? 'Payment'}</td>
                          <td className="px-4 py-4 text-white">
                            {formatCurrency(payment.amount, payment.currency)}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                              {formatPaymentStatus(payment.status)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-white/70">{formatDate(payment.charge?.paidAt ?? payment.createdAt)}</td>
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

            <aside className="space-y-5 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/75">
              <div>
                <h3 className="text-base font-semibold text-white">Kickoff deposit</h3>
                {!selectedClient ? (
                  <p className="mt-2 text-sm text-white/60">Select a client to review their kickoff deposit.</p>
                ) : latestDeposit ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Status</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          depositPaid ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'
                        }`}
                      >
                        {formatPaymentStatus(latestDeposit.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Amount</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(latestDeposit.amount, latestDeposit.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Updated</span>
                      <span>{formatDate(latestDeposit.charge?.paidAt ?? latestDeposit.createdAt)}</span>
                    </div>
                    {latestDeposit.charge?.receiptUrl && (
                      <a
                        href={latestDeposit.charge.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-sky-300 underline-offset-4 hover:underline"
                      >
                        View Stripe receipt
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-white/60">
                    No deposit on file yet. Once the client submits the $99 kickoff payment the receipt and status will display here.
                  </p>
                )}
              </div>

              {selectedClient && finalPaymentsSorted.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs">
                  <p className="font-semibold text-white">Final payment history</p>
                  <ul className="mt-2 space-y-2 text-white/65">
                    {finalPaymentsSorted.map(payment => (
                      <li key={payment.id} className="rounded-lg border border-white/10 bg-black/30 p-3">
                        <div className="flex items-center justify-between text-white">
                          <span>{formatCurrency(payment.amount, payment.currency)}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                              payment.status === 'succeeded'
                                ? 'bg-emerald-500/15 text-emerald-200'
                                : 'bg-amber-500/15 text-amber-200'
                            }`}
                          >
                            {formatPaymentStatus(payment.status)}
                          </span>
                        </div>
                        <div className="mt-1 text-[0.65rem] text-white/60">
                          {formatDate(payment.charge?.paidAt ?? payment.createdAt)}
                        </div>
                        {payment.charge?.receiptUrl && (
                          <a
                            href={payment.charge.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex text-[0.65rem] text-sky-300 underline-offset-4 hover:underline"
                          >
                            Receipt
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-white">Send final balance</h3>
                <p className="mt-1 text-xs text-white/60">Generate a checkout link once the client approves their launch.</p>
                {!selectedClient ? (
                  <p className="mt-3 text-sm text-white/60">Select a client to prepare a final payment link.</p>
                ) : (
                  <form className="mt-3 space-y-3" onSubmit={event => void handleGenerateFinalCheckout(event)}>
                    <div>
                      <label
                        htmlFor="finalAmount"
                        className="block text-xs font-semibold uppercase tracking-wide text-white/60"
                      >
                        Amount (USD)
                      </label>
                      <input
                        id="finalAmount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={finalAmount}
                        onChange={event => setFinalAmount(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                        placeholder="Enter final balance"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="finalDescription"
                        className="block text-xs font-semibold uppercase tracking-wide text-white/60"
                      >
                        Description
                      </label>
                      <input
                        id="finalDescription"
                        type="text"
                        value={finalDescription}
                        onChange={event => setFinalDescription(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
                        placeholder="Final website balance"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={finalLoading}
                      className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {finalLoading ? 'Creating link…' : 'Create checkout link'}
                    </button>
                    {finalCheckoutUrl && (
                      <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
                        <p className="font-semibold text-white">Share this link</p>
                        <p className="mt-1 break-words text-white/70">{finalCheckoutUrl}</p>
                        <button
                          type="button"
                          onClick={() => void handleCopyCheckoutUrl()}
                          className="mt-2 inline-flex items-center rounded-lg border border-sky-400/60 px-3 py-1 text-[0.7rem] font-semibold text-sky-200 hover:border-sky-300 hover:text-sky-100"
                        >
                          Copy link
                        </button>
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
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Cal.com bookings</h2>
              <p className="text-sm text-white/70">Aggregated view of every event returned by the Cal.com API.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void refreshEvents()}
                disabled={eventsLoading}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {eventsLoading ? 'Refreshing…' : 'Refresh events'}
              </button>
              {usingSampleData && (
                <span className="rounded-full border border-amber-300/60 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                  Demo data — add CALCOM_API_KEY for live bookings
                </span>
              )}
            </div>
          </div>

          {eventsError && (
            <p className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{eventsError}</p>
          )}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Attendees</th>
                  <th className="px-4 py-3">Source link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.length === 0 && !eventsLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-white/60">
                      No bookings returned yet. Once live data is available you will see every event here.
                    </td>
                  </tr>
                ) : (
                  events.map(event => (
                    <tr key={event.id} className="hover:bg-white/5">
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{event.title ?? 'Cal.com booking'}</div>
                        {event.description && <div className="text-xs text-white/60">{event.description}</div>}
                      </td>
                      <td className="px-4 py-4 text-white/75">{formatDate(event.startTime)} → {formatDate(event.endTime)}</td>
                      <td className="px-4 py-4 text-white/70">{event.status ?? 'pending'}</td>
                      <td className="px-4 py-4 text-white/75">
                        {event.attendees?.length
                          ? event.attendees.map(att => att.email || att.name).filter(Boolean).join(', ')
                          : '—'}
                      </td>
                      <td className="px-4 py-4">
                        {event.bookingUrl ? (
                          <a
                            href={event.bookingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-300 underline-offset-4 hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-white/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
