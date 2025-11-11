'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, FolderKanban, Plus, Settings2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import {
  PLAN_CATALOG,
  DEFAULT_SERVICE_SELECTION,
  SERVICE_LIST,
  describeSelection,
  formatCurrency as formatSelectionCurrency
} from '@/lib/plans';
import {
  defaultOnboarding,
  type OnboardingForm,
  type OnboardingProject,
  type OnboardingStatus,
  type SafeUser
} from '@/lib/types/user';
import type { DepositSummary } from '@/lib/types/payments';

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

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
});

const formatDate = (value?: string) => {
  if (!value) return 'TBD';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return dateTimeFormat.format(parsed);
};

const statusLabels: Record<OnboardingStatus, string> = {
  'not-started': 'Not started',
  'submitted': 'Submitted for review',
  'in-progress': 'In progress',
  'launch-ready': 'Launch-ready'
};

const computeCoverage = (form: OnboardingForm) => {
  const entries = Object.entries(form).filter(([key]) => key !== 'plan');
  const answered = entries.reduce((total, [, value]) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return total + 1;
    }
    return total;
  }, 0);
  const total = entries.length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return { answered, total, pct } as const;
};

const statusNextStep: Record<OnboardingStatus, string> = {
  'not-started': 'Complete the onboarding prompts to unlock your kickoff roadmap.',
  'submitted': 'We’re reviewing your answers and will follow up with launch timing.',
  'in-progress': 'We’re building assets — keep an eye out for review notes.',
  'launch-ready': 'We’re queued for launch — expect scheduling confirmation shortly.'
};

export default function DashboardView() {
  const router = useRouter();
  const { hydrated, currentUser, saveOnboarding, updateAccount } = useAuth();
  const [allowedUser, setAllowedUser] = useState<SafeUser | null>(null);
  const [activeSection, setActiveSection] = useState<'projects' | 'payments' | 'settings'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [projectFeedback, setProjectFeedback] = useState<string | null>(null);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    company: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountFeedback, setAccountFeedback] = useState<string | null>(null);
  const [accountSaving, setAccountSaving] = useState(false);
  const [depositSummary, setDepositSummary] = useState<DepositSummary | null>(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSample, setDepositSample] = useState(false);
  const [depositFeedback, setDepositFeedback] = useState<string | null>(null);
  const [depositCheckoutLoading, setDepositCheckoutLoading] = useState(false);
  const depositPaidRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    if (currentUser.role === 'admin') {
      router.replace('/admin');
      return;
    }
    setAllowedUser(currentUser);
  }, [currentUser, hydrated, router]);

  useEffect(() => {
    if (!allowedUser) return;
    const projects = Array.isArray(allowedUser.onboardingProjects)
      ? [...allowedUser.onboardingProjects]
      : [];
    projects.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0));
    setSelectedProjectId(prev => {
      if (prev && projects.some(project => project.id === prev)) {
        return prev;
      }
      return projects[0]?.id ?? null;
    });
    setAccountForm({
      name: allowedUser.name ?? '',
      email: allowedUser.email ?? '',
      company: allowedUser.company ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [allowedUser]);

  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('deposit') === 'success') {
      setDepositFeedback('Thanks! Your kickoff deposit is confirmed.');
      url.searchParams.delete('deposit');
      const next = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`;
      router.replace(next || '/dashboard');
      void refreshDeposit();
    }
  }, [hydrated, router]);

  useEffect(() => {
    if (!depositSummary) {
      if (!depositLoading) {
        setDepositFeedback(null);
      }
      depositPaidRef.current = false;
      return;
    }
    if (depositSummary.paid) {
      if (!depositPaidRef.current) {
        setDepositFeedback('Kickoff deposit received! We’ll reach out with next steps.');
      }
      depositPaidRef.current = true;
    } else {
      depositPaidRef.current = false;
    }
  }, [depositLoading, depositSummary]);

  const selectedProject = useMemo(() => {
    if (!allowedUser?.onboardingProjects) {
      return null;
    }
    if (!selectedProjectId) {
      return null;
    }
    return allowedUser.onboardingProjects.find(project => project.id === selectedProjectId) ?? null;
  }, [allowedUser?.onboardingProjects, selectedProjectId]);

  const planDetails = useMemo(
    () => PLAN_CATALOG[selectedProject?.data.plan ?? 'launch'] ?? PLAN_CATALOG['launch'],
    [selectedProject?.data.plan]
  );

  const projectCoverage = useMemo(
    () => computeCoverage(selectedProject?.data ?? defaultOnboarding),
    [selectedProject?.data]
  );

  const lastUpdatedLabel = useMemo(() => {
    if (selectedProject?.updatedAt) {
      return formatDate(selectedProject.updatedAt);
    }
    if (selectedProject?.createdAt) {
      return formatDate(selectedProject.createdAt);
    }
    return 'Not saved yet';
  }, [selectedProject?.createdAt, selectedProject?.updatedAt]);

  const currentStatusLabel = selectedProject ? statusLabels[selectedProject.status] : 'Not started';
  const currentStatusHint = selectedProject ? statusNextStep[selectedProject.status] : statusNextStep['not-started'];

  const sortedProjects = useMemo(() => {
    if (!allowedUser?.onboardingProjects) return [] as OnboardingProject[];
    return [...allowedUser.onboardingProjects].sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0));
  }, [allowedUser?.onboardingProjects]);

  const handleStartNewProject = useCallback(async () => {
    if (!allowedUser || creatingProject) return;
    setProjectFeedback(null);
    setCreatingProject(true);
    const labelBase = allowedUser.company ? `${allowedUser.company} project` : 'Project';
    const label = `${labelBase} ${(allowedUser.onboardingProjects?.length ?? 0) + 1}`;
    const result = await saveOnboarding({
      form: { ...defaultOnboarding },
      label,
      createNew: true
    });
    if (!result.ok) {
      setProjectFeedback(result.message ?? 'Unable to start a new project right now.');
      setCreatingProject(false);
      return;
    }
    const updatedUser = result.user ?? allowedUser;
    if (updatedUser?.onboardingProjects?.length) {
      const newest = [...updatedUser.onboardingProjects].sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0
      )[0];
      if (newest?.id) {
        setSelectedProjectId(newest.id);
        router.push(`/dashboard/projects/${newest.id}`);
      }
    }
    setCreatingProject(false);
  }, [allowedUser, creatingProject, router, saveOnboarding]);

  const refreshEvents = useCallback(async () => {
    if (!allowedUser?.email) return;
    setEventsLoading(true);
    setEventsError(null);
    try {
      const res = await fetch('/api/cal/events');
      if (!res.ok) {
        throw new Error('Unable to load Cal.com events right now.');
      }
      const data = (await res.json()) as {
        ok: boolean;
        events?: CalEvent[];
        usingSampleData?: boolean;
        message?: string;
      };
      if (!data.ok) {
        throw new Error(data.message || 'Unable to load Cal.com events right now.');
      }
      setUsingSampleData(Boolean(data.usingSampleData));
      setEvents(data.events ?? []);
    } catch (error) {
      setEventsError((error as Error).message);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [allowedUser?.email]);

  const refreshDeposit = useCallback(async () => {
    setDepositLoading(true);
    setDepositError(null);
    try {
      const res = await fetch('/api/payments/summary');
      if (!res.ok) {
        throw new Error('Unable to load deposit status right now.');
      }
      const data = (await res.json()) as {
        ok: boolean;
        summary?: DepositSummary;
        usingSampleData?: boolean;
        message?: string;
      };
      if (!data.ok) {
        throw new Error(data.message || 'Unable to load deposit status right now.');
      }
      setDepositSummary(data.summary ?? null);
      setDepositSample(Boolean(data.usingSampleData));
    } catch (error) {
      setDepositError((error as Error).message);
      setDepositSummary(null);
    } finally {
      setDepositLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowedUser?.email) return;
    void refreshEvents();
    void refreshDeposit();
  }, [allowedUser?.email, refreshDeposit, refreshEvents]);

  const handleDepositCheckout = useCallback(async () => {
    setDepositCheckoutLoading(true);
    setDepositFeedback(null);
    setDepositError(null);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (!res.ok || data.ok === false || !data.url) {
        throw new Error(data.message || 'Unable to start checkout.');
      }
      if (typeof window !== 'undefined') {
        window.location.href = data.url as string;
      }
    } catch (error) {
      setDepositFeedback((error as Error).message);
    } finally {
      setDepositCheckoutLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!allowedUser?.email) return;
    void refreshEvents();
    void refreshDeposit();
  }, [allowedUser?.email, refreshDeposit, refreshEvents]);

  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('deposit') === 'success') {
      setDepositFeedback('Thanks! Your kickoff deposit is confirmed.');
      url.searchParams.delete('deposit');
      const next = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`;
      router.replace(next || '/dashboard');
      void refreshDeposit();
    }
  }, [hydrated, refreshDeposit, router]);

  useEffect(() => {
    if (!depositSummary) {
      if (!depositLoading) {
        setDepositFeedback(null);
      }
      depositPaidRef.current = false;
      return;
    }
    if (depositSummary.paid) {
      if (!depositPaidRef.current) {
        setDepositFeedback('Kickoff deposit received! We’ll reach out with next steps.');
      }
      depositPaidRef.current = true;
    } else {
      depositPaidRef.current = false;
    }
  }, [depositLoading, depositSummary]);

  const serviceSummary = useMemo(() => {
    const selection = selectedProject?.data.services ?? DEFAULT_SERVICE_SELECTION;
    return describeSelection(selection);
  }, [
    selectedProject?.data.services?.website,
    selectedProject?.data.services?.ads,
    selectedProject?.data.services?.voice
  ]);

  const userServiceStatuses = allowedUser?.services ?? [];
  const fullFunnelActive = userServiceStatuses.length > 0 && userServiceStatuses.every(entry => entry.active);

  const formatCurrency = useCallback((amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount);
    } catch {
      return `${(currency || 'USD').toUpperCase()} ${amount.toFixed(2)}`;
    }
  }, []);
  const onAccountSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (accountSaving) {
        return;
      }

      setAccountFeedback(null);

      const trimmedName = accountForm.name.trim();
      const trimmedEmail = accountForm.email.trim();
      const trimmedCompany = accountForm.company.trim();

      if (!trimmedEmail) {
        setAccountFeedback('Email is required.');
        return;
      }

      if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
        setAccountFeedback('New password and confirmation do not match.');
        return;
      }

      if (accountForm.newPassword && accountForm.newPassword.length < 6) {
        setAccountFeedback('New password must be at least 6 characters.');
        return;
      }

      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        company: trimmedCompany,
        currentPassword: accountForm.currentPassword ? accountForm.currentPassword : undefined,
        newPassword: accountForm.newPassword ? accountForm.newPassword : null
      };

      setAccountSaving(true);
      const result = await updateAccount(payload);
      setAccountSaving(false);

      if (!result.ok) {
        setAccountFeedback(result.message ?? 'Unable to update your account.');
        return;
      }

      setAccountFeedback(result.message ?? 'Account updated.');
      setAccountForm(prev => ({
        ...prev,
        name: trimmedName,
        email: trimmedEmail,
        company: trimmedCompany,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    },
    [accountForm, accountSaving, updateAccount]
  );

  if (!allowedUser) {
    return (
      <main id="main" className="container py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-white/80">
          Loading your portal…
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard },
    { id: 'settings' as const, label: 'Settings', icon: Settings2 }
  ];

  return (
    <main id="main" className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-purple-900/20 p-10 text-white shadow-lg">
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/55">Client Portal</p>
              <h1 className="text-3xl font-semibold md:text-4xl">Welcome back, {allowedUser.name || 'there'}!</h1>
              <p className="max-w-3xl text-white/75">
                Track every onboarding project, download rollout guidance, and keep payments and account details in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80 shadow-inner shadow-white/5">
                <p className="text-xs uppercase tracking-wide text-white/60">Onboarding coverage</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-semibold text-white">{projectCoverage.pct}%</span>
                  <span className="text-xs text-white/60">
                    {projectCoverage.answered} of {projectCoverage.total} prompts
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500"
                    style={{ width: `${projectCoverage.pct}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-white/65">Current status: {currentStatusLabel}</p>
              </div>

              <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-5 text-sm text-white shadow-lg shadow-sky-500/20">
                <p className="text-xs uppercase tracking-wide text-sky-200/80">Primary metric</p>
                <div className="mt-3 text-lg font-semibold text-white">
                  {selectedProject?.data.primaryMetric || 'Booked consultations'}
                </div>
                <p className="mt-2 text-xs text-white/80">
                  We optimise your funnels and receptionist scripts to drive this metric every week.
                </p>
              </div>

              <div className="rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-transparent p-5 text-sm text-white shadow-lg shadow-fuchsia-500/20">
                <p className="text-xs uppercase tracking-wide text-white/70">Next milestone</p>
                <p className="mt-3 text-lg font-semibold text-white">{currentStatusLabel}</p>
                <p className="mt-2 text-xs text-white/75">{currentStatusHint}</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/30 p-5 text-sm text-white/80 shadow-lg">
                <div className="text-xs uppercase tracking-wide text-white/60">Active services</div>
                <div className="mt-1 text-lg font-semibold text-white">{serviceSummary.label}</div>
                <div className="text-white/70">{serviceSummary.tagline}</div>
                {fullFunnelActive ? (
                  <div className="mt-2 text-xs text-emerald-200">Full Funnel bundle activated — discounted launch pricing locked in.</div>
                ) : (
                  <div className="mt-2 text-xs text-white/55">Select services above to tailor your rollout. Add all three for bundled savings.</div>
                )}
                <div className="mt-3 text-xs text-white/60">Last activity {lastUpdatedLabel}</div>
                {selectedProject?.statusNote ? (
                  <div className="mt-2 text-xs text-white/65">
                    {selectedProject.statusNote}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-white/55">
                    {selectedProject
                      ? 'We’ll update your status as soon as onboarding is submitted.'
                      : 'Start a project to unlock launch tracking.'}
                  </div>
                )}
              </div>
            </div>
            {userServiceStatuses.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {userServiceStatuses.map(status => {
                  const definition = SERVICE_LIST.find(item => item.key === status.key);
                  const active = Boolean(status.active);
                  return (
                    <div
                      key={status.key}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80 shadow-inner"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{definition?.name ?? status.key}</p>
                          <p className="text-xs text-white/60">{definition?.tagline}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            active
                              ? 'border border-emerald-400/70 bg-emerald-500/15 text-emerald-100'
                              : 'border border-white/20 bg-white/5 text-white/60'
                          }`}
                        >
                          {active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-white/60">{definition?.description}</p>
                      <div className="mt-3 space-y-1 text-xs text-white/60">
                        <p>Due at approval: {formatSelectionCurrency(definition?.dueAtApprovalCents ?? status.priceCents ?? 0)}</p>
                        {definition?.ongoingNote && <p>Ongoing: {definition.ongoingNote}</p>}
                      </div>
                      <p className={`mt-3 text-xs ${active ? 'text-emerald-200' : 'text-white/55'}`}>
                        {active
                          ? 'We’ll surface performance metrics here after launch.'
                          : 'Toggle this service in onboarding when you’re ready to activate it.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
          {tabs.map(tab => {
            const active = activeSection === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                  active ? 'bg-white text-black font-semibold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeSection === 'projects' && (
          <>
            <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Projects overview</h2>
                  <p className="text-sm text-white/70">
                    Compare every launch at a glance and open the dedicated workspace to edit details.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedProjectId && (
                    <Link
                      href={`/dashboard/projects/${selectedProjectId}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:border-white/60 hover:bg-white/10"
                    >
                      <FolderKanban className="size-4" />
                      Open project workspace
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleStartNewProject()}
                    disabled={creatingProject}
                    className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-sm font-medium text-white transition hover:border-sky-300/60 hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="size-4" />
                    {creatingProject ? 'Creating…' : 'Start new project'}
                  </button>
                </div>
              </div>
              {projectFeedback && (
                <p
                  className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                    projectFeedback.toLowerCase().includes('unable') || projectFeedback.toLowerCase().includes('error')
                      ? 'bg-red-500/15 text-red-200'
                      : 'bg-emerald-500/15 text-emerald-200'
                  }`}
                >
                  {projectFeedback}
                </p>
              )}
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-white/60">
                    <tr>
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Coverage</th>
                      <th className="px-4 py-3">Updated</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedProjects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-white/60">
                          No onboarding projects yet. Start one to craft your rollout blueprint.
                        </td>
                      </tr>
                    ) : (
                      sortedProjects.map(project => {
                        const coverage = computeCoverage(project.data);
                        const active = project.id === selectedProjectId;
                        return (
                          <tr
                            key={project.id}
                            className={`transition hover:bg-white/5 ${active ? 'bg-white/10' : ''}`}
                            onClick={() => setSelectedProjectId(project.id)}
                          >
                            <td className="px-4 py-4 text-white">
                              <div className="font-semibold">{project.label || 'Project'}</div>
                              <div className="text-xs text-white/60">Created {formatDate(project.createdAt)}</div>
                            </td>
                            <td className="px-4 py-4 text-white/75">
                              <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
                                {statusLabels[project.status]}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-white/75">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-white">{coverage.pct}%</span>
                                <div className="h-2 w-24 rounded-full bg-white/10">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500"
                                    style={{ width: `${coverage.pct}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-white/60">
                                {coverage.answered} of {coverage.total} prompts
                              </div>
                            </td>
                            <td className="px-4 py-4 text-white/70">{formatDate(project.updatedAt)}</td>
                            <td className="px-4 py-4">
                              <Link
                                href={`/dashboard/projects/${project.id}`}
                                className="inline-flex items-center justify-center rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
                              >
                                Open
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

              <aside className="space-y-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-white shadow-lg">
                <section>
                  <h3 className="text-lg font-semibold">Your rollout blueprint</h3>
                  <p className="mt-1 text-sm text-white/70">Here’s what we execute once onboarding is complete.</p>
                  <ul className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
                    <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="font-semibold text-white">Week 0:</span>
                      <p className="mt-1 text-xs text-white/65">Strategy call to align on metrics, message, and required assets.</p>
                    </li>
                    <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="font-semibold text-white">Weeks 1-2:</span>
                      <p className="mt-1 text-xs text-white/65">Build the conversion flow, draft ads, and script the AI receptionist.</p>
                    </li>
                    <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="font-semibold text-white">Week 3:</span>
                      <p className="mt-1 text-xs text-white/65">Launch, QA across devices, and plug insights into your reporting hub.</p>
                    </li>
                    <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="font-semibold text-white">Week 4:</span>
                      <p className="mt-1 text-xs text-white/65">Optimisation sprint with scorecards on booked calls and answered leads.</p>
                    </li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold">Service highlights</h3>
                  <p className="mt-1 text-sm text-white/70">{serviceSummary.description}</p>
                  <ul className="mt-3 space-y-2 text-sm text-white/75">
                    {serviceSummary.bullets.map(point => (
                      <li key={point}>• {point}</li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80">
                  <h4 className="text-sm font-semibold text-white">Need a tailored quote?</h4>
                  <p className="mt-1 text-sm">
                    If your scope spans multiple brands or requires deeper integrations, drop us a line at{' '}
                    <a className="text-sky-300 underline-offset-4 hover:underline" href="mailto:hello@businessbooster.ai">
                      hello@businessbooster.ai
                    </a>
                    .
                  </p>
                </section>
              </aside>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold">Plan highlights</h3>
                <p className="mt-1 text-sm text-white/70">{planDetails.description}</p>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  {planDetails.bullets.map(point => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </section>
              <section className="rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/80 shadow-lg">
                <h4 className="text-lg font-semibold text-white">Need a tailored quote?</h4>
                <p className="mt-1 text-sm">
                  If your scope spans multiple brands or requires deeper integrations, drop us a line at{' '}
                  <a className="text-sky-300 underline-offset-4 hover:underline" href="mailto:hello@businessbooster.ai">
                    hello@businessbooster.ai
                  </a>
                  .
                </p>
                <p className="mt-2 text-xs text-white/60">We’ll reply within one business day with next steps.</p>
              </section>
            </div>

            <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Your Cal.com events</h2>
                  <p className="text-sm text-white/70">We sync bookings tied to {allowedUser.email}. Refresh anytime.</p>
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
                      <th className="px-4 py-3">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.length === 0 && !eventsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-white/60">
                          No bookings yet. As soon as calls land on your calendar, they will appear here.
                        </td>
                      </tr>
                    ) : (
                      events.map(event => (
                        <tr key={event.id}>
                          <td className="px-4 py-4 text-white/80">
                            <div className="font-semibold text-white">{event.title || 'Cal.com booking'}</div>
                            {event.description && <div className="text-xs text-white/55">{event.description}</div>}
                          </td>
                          <td className="px-4 py-4 text-white/75">
                            {formatDate(event.startTime)} → {formatDate(event.endTime)}
                          </td>
                          <td className="px-4 py-4 text-white/75">{event.status || 'Scheduled'}</td>
                          <td className="px-4 py-4 text-white/75">
                            {event.attendees && event.attendees.length > 0
                              ? event.attendees.map(att => att.email || att.name || 'Guest').join(', ')
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
          </>
        )}

        {activeSection === 'payments' && (
          <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Kickoff deposit</h2>
                <p className="text-sm text-white/70">Secure your build slot with a $99 Stripe payment.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void refreshDeposit()}
                  disabled={depositLoading}
                  className="rounded-xl border border-white/20 px-4 py-2 text-xs text-white hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {depositLoading ? 'Checking…' : 'Refresh status'}
                </button>
                {depositSample && (
                  <span className="rounded-full border border-amber-300/60 bg-amber-500/10 px-3 py-1 text-[0.7rem] text-amber-200">
                    Demo data — add STRIPE_SECRET_KEY for live payments
                  </span>
                )}
              </div>
            </header>

            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <p className="font-semibold text-emerald-200">How payment works</p>
              <ul className="mt-2 space-y-1 text-emerald-100/90">
                <li>• Reserve your build slot with a $99 kickoff deposit.</li>
                <li>• We sprint on copy, design, and automation as soon as the deposit clears.</li>
                <li>• The remaining balance is invoiced only after you approve the launch.</li>
              </ul>
            </div>

            {depositError && (
              <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{depositError}</p>
            )}

            <div className="space-y-3 text-sm text-white/75">
              {depositSummary ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        depositSummary.paid ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'
                      }`}
                    >
                      {depositSummary.paid ? 'Paid' : 'Awaiting deposit'}
                    </span>
                    <span>{formatCurrency(depositSummary.amount, depositSummary.currency)}</span>
                    {depositSummary.lastPaymentAt && (
                      <span className="text-xs text-white/60">Updated {formatDate(depositSummary.lastPaymentAt)}</span>
                    )}
                  </div>
                  <p className="text-white/70">
                    {depositSummary.paid
                      ? 'Awesome! We’re already lining up design and copy so you can approve the launch faster.'
                      : 'Submit the deposit to trigger the build sprint. We’ll notify you as soon as the payment clears.'}
                  </p>
                  {depositSummary.receiptUrl && (
                    <a
                      href={depositSummary.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-xs font-semibold text-sky-300 underline-offset-4 hover:underline"
                    >
                      View Stripe receipt
                    </a>
                  )}
                </>
              ) : (
                <p className="text-white/70">
                  When you’re ready we’ll redirect you to Stripe to submit the $99 kickoff deposit. It’s fully credited toward your final balance.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => void handleDepositCheckout()}
                disabled={depositCheckoutLoading || depositSummary?.paid}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {depositSummary?.paid ? 'Deposit received' : depositCheckoutLoading ? 'Redirecting…' : 'Pay $99 kickoff deposit'}
              </button>
              {depositFeedback && (
                <p className={`text-xs ${depositSummary?.paid ? 'text-emerald-200' : 'text-white/70'}`}>{depositFeedback}</p>
              )}
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
            <header>
              <h2 className="text-2xl font-semibold">Account settings</h2>
              <p className="text-sm text-white/70">Update your contact information and password anytime.</p>
            </header>

            <form onSubmit={onAccountSubmit} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="accountName" className="block text-sm font-medium text-white/80">
                  Full name
                </label>
                <input
                  id="accountName"
                  type="text"
                  value={accountForm.name}
                  onChange={event => setAccountForm(prev => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accountEmail" className="block text-sm font-medium text-white/80">
                  Email address
                </label>
                <input
                  id="accountEmail"
                  type="email"
                  value={accountForm.email}
                  onChange={event => setAccountForm(prev => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accountCompany" className="block text-sm font-medium text-white/80">
                  Company name
                </label>
                <input
                  id="accountCompany"
                  type="text"
                  value={accountForm.company}
                  onChange={event => setAccountForm(prev => ({ ...prev, company: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
              <div />
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-white/80">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={accountForm.currentPassword}
                  onChange={event => setAccountForm(prev => ({ ...prev, currentPassword: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-white/80">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={accountForm.newPassword}
                  onChange={event => setAccountForm(prev => ({ ...prev, newPassword: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={event => setAccountForm(prev => ({ ...prev, confirmPassword: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              {accountFeedback && (
                <div className="md:col-span-2">
                  <p
                    className={`rounded-xl px-4 py-3 text-sm ${
                      accountFeedback.toLowerCase().includes('unable')
                        ? 'bg-red-500/15 text-red-200'
                        : 'bg-emerald-500/15 text-emerald-200'
                    }`}
                  >
                    {accountFeedback}
                  </p>
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={accountSaving}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {accountSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
