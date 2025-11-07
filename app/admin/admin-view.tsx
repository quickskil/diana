'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CATALOG } from '@/lib/plans';
import type { OnboardingStatus } from '@/lib/types/user';

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

export default function AdminView() {
  const router = useRouter();
  const { hydrated, currentUser, users, updateOnboardingStatus } = useAuth();
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<OnboardingStatus>('not-started');
  const [statusNote, setStatusNote] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<boolean | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

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
  const onboardedClients = useMemo(() => clients.filter(c => Boolean(c.onboarding)), [clients]);

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

  const selectedClientEvents = useMemo(() => {
    if (!selectedClient?.email) return [] as CalEvent[];
    const email = selectedClient.email.toLowerCase();
    return events.filter(event =>
      event.attendees?.some(att => att.email?.toLowerCase() === email) ||
      event.organizer?.toLowerCase() === email
    );
  }, [events, selectedClient?.email]);

  useEffect(() => {
    if (!selectedClient?.onboarding) {
      setStatusDraft('not-started');
      setStatusNote('');
      setStatusFeedback(null);
      setStatusSuccess(null);
      return;
    }
    setStatusDraft(selectedClient.onboarding.status ?? 'not-started');
    setStatusNote(selectedClient.onboarding.statusNote ?? '');
    setStatusFeedback(null);
    setStatusSuccess(null);
  }, [selectedClient]);

  const statusOptions: { value: OnboardingStatus; label: string; description: string }[] = [
    { value: 'not-started', label: 'Not started', description: 'Waiting for onboarding submission.' },
    { value: 'submitted', label: 'Submitted for review', description: 'Client has delivered onboarding details.' },
    { value: 'in-progress', label: 'In progress', description: 'Strategy, creative, or AI training underway.' },
    { value: 'launch-ready', label: 'Launch-ready', description: 'Green-lit for go-live and automation handoff.' }
  ];

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedClient) return;
    if (!selectedClient.onboarding) {
      setStatusFeedback('Client has not submitted onboarding yet.');
      return;
    }
    setStatusSaving(true);
    setStatusFeedback(null);
    setStatusSuccess(null);
    const result = await updateOnboardingStatus({ userId: selectedClient.id, status: statusDraft, note: statusNote });
    if (!result.ok) {
      setStatusFeedback(result.message ?? 'Unable to update status.');
      setStatusSuccess(false);
      setStatusSaving(false);
      return;
    }
    setStatusFeedback(result.message ?? 'Status updated.');
    setStatusSuccess(true);
    setStatusSaving(false);
  }, [selectedClient, statusDraft, statusNote, updateOnboardingStatus]);

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

  useEffect(() => {
    if (!ready) return;
    void refreshEvents();
  }, [ready, refreshEvents]);

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
            Review onboarding submissions, keep tabs on go-live readiness, and monitor every booking pulled from Cal.com.
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
                    const onboarding = client.onboarding;
                    const planName = onboarding ? PLAN_CATALOG[onboarding.data.plan]?.name ?? onboarding.data.plan : '—';
                    return (
                      <tr key={client.id} className={`hover:bg-white/5 ${client.id === selectedClientId ? 'bg-white/5' : ''}`}>
                        <td className="px-4 py-4">
                          <div className="font-medium text-white">{client.name || 'Unnamed client'}</div>
                          <div className="text-xs text-white/60">{client.email}</div>
                          {client.company && <div className="text-xs text-white/55">{client.company}</div>}
                        </td>
                        <td className="px-4 py-4 text-white/75">{planName}</td>
                        <td className="px-4 py-4 text-white/75">{onboarding?.data.primaryMetric ?? '—'}</td>
                        <td className="px-4 py-4 text-white/75">{onboarding?.data.launchTimeline || '—'}</td>
                        <td className="px-4 py-4 text-white/75">{onboarding ? statusLabelMap[onboarding.status ?? 'submitted'] : 'Not started'}</td>
                        <td className="px-4 py-4">
                          {onboarding?.data.calLink ? (
                            <a
                              href={onboarding.data.calLink}
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
                        <td className="px-4 py-4 text-white/60">{onboarding?.completedAt ? formatDate(onboarding.completedAt) : 'Not submitted'}</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedClientId(client.id)}
                            className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/40 hover:text-white"
                          >
                            View
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
          ) : !selectedClient.onboarding ? (
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
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <h3 className="text-lg font-semibold text-white">Rollout foundations</h3>
                  <dl className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
                    <div>
                      <dt className="text-white/60">Plan</dt>
                      <dd>{PLAN_CATALOG[selectedClient.onboarding.data.plan]?.name ?? selectedClient.onboarding.data.plan}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Primary metric</dt>
                      <dd>{selectedClient.onboarding.data.primaryMetric || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Launch timeline</dt>
                      <dd>{selectedClient.onboarding.data.launchTimeline || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Monthly ad budget</dt>
                      <dd>{selectedClient.onboarding.data.monthlyAdBudget || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Goals</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.goals || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Challenges</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.challenges || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Notes</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.notes || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <h3 className="text-lg font-semibold text-white">Systems & automation</h3>
                  <dl className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
                    <div>
                      <dt className="text-white/60">CRM tools</dt>
                      <dd>{selectedClient.onboarding.data.crmTools || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Voice coverage</dt>
                      <dd>{selectedClient.onboarding.data.voiceCoverage || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Cal.com link</dt>
                      <dd>
                        {selectedClient.onboarding.data.calLink ? (
                          <a className="text-sky-300 underline-offset-4 hover:underline" href={selectedClient.onboarding.data.calLink} target="_blank" rel="noreferrer">
                            {selectedClient.onboarding.data.calLink}
                          </a>
                        ) : (
                          '—'
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/60">Team size</dt>
                      <dd>{selectedClient.onboarding.data.teamSize || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Integrations</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.integrations || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <h3 className="text-lg font-semibold text-white">Creative & voice agent inputs</h3>
                  <dl className="mt-4 grid gap-4 text-sm text-white/75 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Target audience</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.targetAudience || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Value proposition</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.uniqueValueProp || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Offer details</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.offerDetails || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Brand voice</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.brandVoice || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Ad channels</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.adChannels || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Follow-up process</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.followUpProcess || '—'}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-white/60">Voice agent instructions</dt>
                      <dd className="whitespace-pre-wrap text-white/80">{selectedClient.onboarding.data.receptionistInstructions || '—'}</dd>
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
                  {selectedClient.onboarding.statusUpdatedAt && (
                    <p className="mt-3 text-[0.65rem] uppercase tracking-wide text-white/50">
                      Last updated {formatDate(selectedClient.onboarding.statusUpdatedAt)}
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
