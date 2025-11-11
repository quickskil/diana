'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { describeSelection, normaliseServiceSelection } from '@/lib/plans';
import type { OnboardingProject, OnboardingStatus } from '@/lib/types/user';
import { formatDateTime, useAdmin } from '../../admin-context';

const statusLabelMap: Record<OnboardingStatus, string> = {
  'not-started': 'Not started',
  'submitted': 'Submitted for review',
  'in-progress': 'In progress',
  'launch-ready': 'Launch-ready'
};

const statusOptions: { value: OnboardingStatus; label: string; description: string }[] = [
  { value: 'not-started', label: 'Not started', description: 'Waiting for onboarding submission.' },
  { value: 'submitted', label: 'Submitted for review', description: 'Client has delivered onboarding details.' },
  { value: 'in-progress', label: 'In progress', description: 'Strategy, creative, or AI training underway.' },
  { value: 'launch-ready', label: 'Launch-ready', description: 'Green-lit for go-live and automation handoff.' }
];

function formatList(value?: string) {
  if (!value) return null;
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function SectionList({ title, value }: { title: string; value?: string }) {
  const list = formatList(value);
  if (!list || list.length === 0) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/50">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-white/70">
        {list.map((line, index) => (
          <li key={`${title}-${index}`} className="rounded-lg border border-white/10 bg-black/30 px-3 py-1">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IntakeField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/70">{value}</p>
    </div>
  );
}

function ProjectSummary({ project }: { project: OnboardingProject }) {
  const plan = describeSelection(
    normaliseServiceSelection(project.data?.services ?? (project.data as unknown as { plan?: string })?.plan ?? null)
  );
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <p className="text-xs uppercase tracking-wide text-white/50">Plan selection</p>
        <p className="mt-1 text-lg font-semibold text-white">{plan.label}</p>
        <p className="text-sm text-white/70">{plan.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <IntakeField label="Primary metric" value={project.data.primaryMetric} />
        <IntakeField label="Launch timeline" value={project.data.launchTimeline} />
        <IntakeField label="Monthly ad budget" value={project.data.monthlyAdBudget} />
        <IntakeField label="Team size" value={project.data.teamSize} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <IntakeField label="Goals" value={project.data.goals} />
        <IntakeField label="Challenges" value={project.data.challenges} />
        <IntakeField label="Target audience" value={project.data.targetAudience} />
        <IntakeField label="Unique value prop" value={project.data.uniqueValueProp} />
      </div>

      <SectionList title="Ad channels" value={project.data.adChannels} />
      <SectionList title="Follow up process" value={project.data.followUpProcess} />
      <SectionList title="Integrations" value={project.data.integrations} />

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/70">
        <p className="text-xs uppercase tracking-wide text-white/50">Notes</p>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{project.data.notes || 'No additional notes provided.'}</p>
      </div>
    </div>
  );
}

export default function OnboardingDashboard() {
  const {
    clients,
    events,
    eventsLoading,
    updateOnboardingStatus,
    refreshEvents
  } = useAdmin();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<OnboardingStatus>('not-started');
  const [statusNote, setStatusNote] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<boolean | null>(null);

  const onboardedClients = useMemo(
    () => clients.filter(client => Array.isArray(client.onboardingProjects) && client.onboardingProjects.length > 0),
    [clients]
  );

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
    if (!selectedClient?.onboardingProjects?.length) {
      setSelectedProjectId(null);
      return;
    }
    setSelectedProjectId(prev => {
      if (prev && selectedClient.onboardingProjects.some(project => project.id === prev)) {
        return prev;
      }
      return selectedClient.onboardingProjects[0]?.id ?? null;
    });
  }, [selectedClient]);

  const selectedProject = useMemo(() => {
    if (!selectedClient?.onboardingProjects?.length) return null;
    const fallback = selectedClient.onboardingProjects[0] ?? null;
    if (!selectedProjectId) return fallback;
    return selectedClient.onboardingProjects.find(project => project.id === selectedProjectId) ?? fallback;
  }, [selectedClient, selectedProjectId]);

  useEffect(() => {
    if (!selectedProject) {
      setStatusDraft('not-started');
      setStatusNote('');
      setStatusFeedback(null);
      setStatusSuccess(null);
      return;
    }
    setStatusDraft(selectedProject.status ?? 'submitted');
    setStatusNote(selectedProject.statusNote ?? '');
    setStatusFeedback(null);
    setStatusSuccess(null);
  }, [selectedProject]);

  const selectedClientEvents = useMemo(() => {
    if (!selectedClient?.email) return [];
    const email = selectedClient.email.toLowerCase();
    return events.filter(
      event =>
        event.attendees?.some(att => att.email?.toLowerCase() === email) || event.organizer?.toLowerCase() === email
    );
  }, [events, selectedClient?.email]);

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedClient || !selectedProject) {
      setStatusFeedback('Client has not submitted onboarding yet.');
      setStatusSuccess(false);
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

  const handleRefreshEvents = useCallback(() => {
    void refreshEvents();
  }, [refreshEvents]);

  return (
    <div className="space-y-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Client onboarding overview</h2>
            <p className="text-sm text-white/70">Track service selections, goals, and launch timelines.</p>
          </div>
          <div className="text-sm text-white/60">
            {onboardedClients.length} onboarding submissions • {clients.length} total clients
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
                  <td colSpan={8} className="px-4 py-6 text-center text-white/60">
                    No client accounts yet. Invite teams to register via the portal to populate this view.
                  </td>
                </tr>
              ) : (
                clients.map(client => {
                  const projects = client.onboardingProjects ?? [];
                  const primary = projects[0] ?? null;
                  const planSummary = primary
                    ? describeSelection(
                        normaliseServiceSelection(
                          primary.data?.services ?? (primary.data as unknown as { plan?: string })?.plan ?? null
                        )
                      )
                    : null;
                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-white/5 ${client.id === selectedClientId ? 'bg-white/5' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{client.name || 'Unnamed client'}</div>
                        <div className="text-xs text-white/60">{client.email}</div>
                        {client.company && <div className="text-xs text-white/55">{client.company}</div>}
                      </td>
                      <td className="px-4 py-4 text-white/75">{planSummary?.label ?? '—'}</td>
                      <td className="px-4 py-4 text-white/75">{primary?.data.primaryMetric ?? '—'}</td>
                      <td className="px-4 py-4 text-white/75">{primary?.data.launchTimeline || '—'}</td>
                      <td className="px-4 py-4 text-white/75">{primary ? statusLabelMap[primary.status] : 'Not started'}</td>
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
                      <td className="px-4 py-4 text-white/60">
                        {primary?.completedAt ? formatDateTime(primary.completedAt) : 'Not submitted'}
                      </td>
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

      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Onboarding dossier</h2>
            <p className="text-sm text-white/70">Review the full intake and keep teams aligned on progress.</p>
          </div>
          <button
            type="button"
            onClick={handleRefreshEvents}
            className="self-start rounded-xl border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white/70 hover:border-white/40"
          >
            Refresh Cal.com sync
          </button>
        </div>

        {!selectedClient ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/60">
            Select a client from the table above to view their onboarding details.
          </p>
        ) : !selectedProject ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/70">
              <h3 className="text-lg font-semibold text-white">{selectedClient.name || selectedClient.email}</h3>
              <p className="mt-2 text-sm text-white/65">We’re still waiting on their onboarding submission.</p>
            </div>
            <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
              <p>Send a nudge so they can provide service selections, creative inputs, and AI voice scripting requirements.</p>
            </aside>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,340px]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <h3 className="text-lg font-semibold text-white">Project snapshot</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Status</p>
                    <p className="mt-1 text-sm text-white/80">{statusLabelMap[selectedProject.status]}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Last updated</p>
                    <p className="mt-1 text-sm text-white/70">{formatDateTime(selectedProject.statusUpdatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Created</p>
                    <p className="mt-1 text-sm text-white/70">{formatDateTime(selectedProject.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">Submission</p>
                    <p className="mt-1 text-sm text-white/70">{formatDateTime(selectedProject.completedAt)}</p>
                  </div>
                </div>
              </div>

              <ProjectSummary project={selectedProject} />
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <h3 className="text-lg font-semibold text-white">Status control</h3>
                <form
                  className="mt-4 space-y-4"
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    void handleStatusUpdate();
                  }}
                >
                  <div className="space-y-2">
                    {statusOptions.map(option => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                          statusDraft === option.value
                            ? 'border-sky-400 bg-sky-500/10 text-white'
                            : 'border-white/15 bg-black/20 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={statusDraft === option.value}
                          onChange={() => setStatusDraft(option.value)}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-sm font-semibold">{option.label}</span>
                          <span className="text-xs text-white/60">{option.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="status-note">
                      Status note
                    </label>
                    <textarea
                      id="status-note"
                      value={statusNote}
                      onChange={event => setStatusNote(event.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 p-3 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                      placeholder="Share blockers, owner, or next action for this rollout."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={statusSaving}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {statusSaving ? 'Saving…' : 'Update status'}
                  </button>
                  {statusFeedback && (
                    <p
                      className={`mt-3 rounded-xl px-3 py-2 text-xs ${
                        statusSuccess ? 'bg-emerald-500/10 text-emerald-200' : 'bg-red-500/10 text-red-200'
                      }`}
                    >
                      {statusFeedback}
                    </p>
                  )}
                </form>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-xs text-white/60">
                <p className="font-semibold text-white">Client record</p>
                <p className="mt-2 break-words">{selectedClient.email}</p>
                {selectedClient.company && <p className="mt-1">{selectedClient.company}</p>}
                <p className="mt-1">Joined {formatDateTime(selectedClient.createdAt)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-xs text-white/60">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">Cal.com bookings</p>
                  {eventsLoading && <span className="text-[0.65rem] uppercase tracking-wide text-white/50">Loading…</span>}
                </div>
                {selectedClientEvents.length === 0 ? (
                  <p className="mt-2 text-white/60">No linked events yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-white/70">
                    {selectedClientEvents.map(event => (
                      <li key={event.id} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                        <p className="text-white">{event.title || 'Untitled event'}</p>
                        <p className="text-[0.7rem] text-white/60">
                          {formatDateTime(event.startTime)} → {formatDateTime(event.endTime)}
                        </p>
                        {event.bookingUrl && (
                          <a
                            className="mt-1 block text-[0.7rem] text-sky-300 underline-offset-4 hover:underline"
                            href={event.bookingUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
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
    </div>
  );
}

