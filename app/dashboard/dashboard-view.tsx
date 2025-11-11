'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, FolderKanban, Plus, Settings2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DEFAULT_SERVICE_SELECTION,
  SERVICE_LIST,
  describeSelection,
  formatCurrency as formatSelectionCurrency,
  type ServiceKey
} from '@/lib/plans';
import { defaultOnboarding, type OnboardingForm, type OnboardingStatus, type SafeUser } from '@/lib/types/user';
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

export default function DashboardView() {
  const router = useRouter();
  const { hydrated, currentUser, saveOnboarding, updateAccount } = useAuth();
  const [allowedUser, setAllowedUser] = useState<SafeUser | null>(null);
  const [form, setForm] = useState<OnboardingForm>({ ...defaultOnboarding });
  const [activeSection, setActiveSection] = useState<'projects' | 'payments' | 'settings'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectLabel, setProjectLabel] = useState('New onboarding');
  const [creatingProject, setCreatingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stepSaving, setStepSaving] = useState(false);
  const [onboardingFeedback, setOnboardingFeedback] = useState<string | null>(null);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
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
  const initialStepRender = useRef(true);
  const stepListRef = useRef<HTMLDivElement | null>(null);
  const stepContentRef = useRef<HTMLDivElement | null>(null);
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
    if (!allowedUser) return;
    const projects = allowedUser.onboardingProjects ?? [];
    const activeProject = selectedProjectId
      ? projects.find(project => project.id === selectedProjectId) ?? null
      : null;
    if (activeProject) {
      setForm({ ...defaultOnboarding, ...activeProject.data });
      setProjectLabel(activeProject.label || 'Project');
    } else {
      setForm({ ...defaultOnboarding });
      setProjectLabel(prev => {
        if (prev && prev.trim()) {
          return prev;
        }
        return allowedUser.company ? `${allowedUser.company} onboarding` : 'New onboarding';
      });
    }
    setStepIndex(0);
  }, [allowedUser, selectedProjectId]);

  useEffect(() => {
    setDepositSummary(null);
    setDepositFeedback(null);
    depositPaidRef.current = false;
  }, [allowedUser?.id]);

  const selectedProject = useMemo(() => {
    if (!allowedUser?.onboardingProjects) {
      return null;
    }
    if (!selectedProjectId) {
      return null;
    }
    return allowedUser.onboardingProjects.find(project => project.id === selectedProjectId) ?? null;
  }, [allowedUser?.onboardingProjects, selectedProjectId]);

  const tabs = useMemo(
    () => [
      { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
      { id: 'payments' as const, label: 'Payments', icon: CreditCard },
      { id: 'settings' as const, label: 'Settings', icon: Settings2 }
    ],
    []
  );

  const handleStartNewProject = useCallback(async () => {
    if (!allowedUser || creatingProject) return;
    setActiveSection('projects');
    setCreatingProject(true);
    setOnboardingFeedback(null);
    const labelBase = allowedUser.company ? `${allowedUser.company} project` : 'Project';
    const label = `${labelBase} ${(allowedUser.onboardingProjects?.length ?? 0) + 1}`;
    setProjectLabel(label);
    setSelectedProjectId(null);
    setForm({ ...defaultOnboarding });
    setStepIndex(0);
    const result = await saveOnboarding({
      form: { ...defaultOnboarding },
      label,
      createNew: true
    });
    if (!result.ok) {
      setOnboardingFeedback(result.message ?? 'Unable to start a new project right now.');
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
      }
    }
    setCreatingProject(false);
  }, [allowedUser, creatingProject, saveOnboarding]);

  const refreshEvents = useCallback(async () => {
    if (!allowedUser?.email) return;
    setEventsLoading(true);
    setEventsError(null);
    try {
      const res = await fetch(`/api/cal-events?email=${encodeURIComponent(allowedUser.email)}`, { cache: 'no-store' });
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
  }, [allowedUser?.email]);

  const refreshDeposit = useCallback(async () => {
    setDepositLoading(true);
    setDepositError(null);
    try {
      const res = await fetch('/api/payments/summary', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.message || 'Unable to check payments.');
      }
      setDepositSummary(data.deposit ?? null);
      setDepositSample(Boolean(data.sample));
    } catch (error) {
      setDepositError((error as Error).message);
    } finally {
      setDepositLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (initialStepRender.current) {
      initialStepRender.current = false;
      return;
    }
    setOnboardingFeedback(null);
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (!isDesktop && stepContentRef.current) {
      stepContentRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    if (isDesktop && stepListRef.current) {
      const currentStepButton = stepListRef.current.querySelector<HTMLButtonElement>(
        `[data-step-index="${stepIndex}"]`
      );
      currentStepButton?.scrollIntoView({ block: 'nearest' });
    }
  }, [stepIndex]);

  const serviceSummary = useMemo(() => {
    const selection = form.services ?? DEFAULT_SERVICE_SELECTION;
    return describeSelection(selection);
  }, [form.services]);

  const userServiceStatuses = allowedUser?.services ?? [];
  const fullFunnelActive = userServiceStatuses.length > 0 && userServiceStatuses.every(entry => entry.active);

  const handleToggleService = useCallback((key: ServiceKey) => {
    setForm(prev => {
      const current = prev.services ?? { ...DEFAULT_SERVICE_SELECTION };
      return {
        ...prev,
        services: { ...current, [key]: !current[key] }
      };
    });
  }, []);

  const handleSelectAllServices = useCallback(() => {
    setForm(prev => ({
      ...prev,
      services: { website: true, ads: true, voice: true }
    }));
  }, []);

  const formatCurrency = useCallback((amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount);
    } catch {
      return `${(currency || 'USD').toUpperCase()} ${amount.toFixed(2)}`;
    }
  }, []);
  const steps = [
    {
      id: 'kickoff',
      title: 'Kickoff & billing contact',
      subtitle: 'Choose your service mix and who we coordinate payment with.',
      render: () => (
        <div className="space-y-6">
          <section>
            <p className="text-sm text-white/70">
              Pick the services that fit your current goals. You can add or remove pieces whenever you need.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {SERVICE_LIST.map(service => {
                const active = Boolean(form.services?.[service.key]);
                return (
                  <button
                    key={service.key}
                    type="button"
                    onClick={() => handleToggleService(service.key)}
                    className={`flex flex-col justify-between rounded-2xl border px-5 py-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
                      active
                        ? 'border-sky-400/80 bg-gradient-to-br from-sky-500/25 via-cyan-500/10 to-transparent shadow-[0_0_30px_rgba(56,189,248,0.35)]'
                        : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                    }`}
                    aria-pressed={active}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          <p className="text-sm text-white/70">{service.tagline}</p>
                        </div>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                            active
                              ? 'border-emerald-400/70 bg-emerald-500/20 text-emerald-100'
                              : 'border-white/20 bg-white/5 text-white/70'
                          }`}
                        >
                          {active ? 'Selected' : 'Tap to add'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-white/80">
                        <p>{formatSelectionCurrency(service.dueAtApprovalCents)} due at approval</p>
                        <p className="text-xs text-white/55">{service.ongoingNote}</p>
                      </div>
                      <ul className="space-y-2 text-xs text-white/65">
                        {service.bullets.map(point => (
                          <li key={point} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-sky-300/70" aria-hidden />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">Kickoff deposit</p>
                  <p className="text-lg font-semibold">{formatSelectionCurrency(serviceSummary.depositCents)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">Due at approval</p>
                  <p className="text-lg font-semibold">{formatSelectionCurrency(serviceSummary.dueAtApprovalCents)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">Total launch</p>
                  <p className="text-lg font-semibold">{formatSelectionCurrency(serviceSummary.totalLaunchCents)}</p>
                </div>
              </div>
              {serviceSummary.discountCents > 0 ? (
                <p className="text-xs text-emerald-200">
                  Bundle savings applied — {formatSelectionCurrency(serviceSummary.discountCents)} off the due-at-approval total for the Full Funnel package.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectAllServices}
                  className="text-xs font-semibold text-sky-200 underline-offset-2 hover:underline"
                >
                  Activate the Full Funnel bundle for extra savings
                </button>
              )}
              {serviceSummary.ongoingNotes.length > 0 && (
                <p className="text-xs text-white/60">
                  Ongoing: {serviceSummary.ongoingNotes.join(' • ')}
                </p>
              )}
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="billingContactName" className="block text-sm font-medium text-white/80">Billing contact name</label>
              <input
                id="billingContactName"
                type="text"
                value={form.billingContactName}
                onChange={(e) => setForm(prev => ({ ...prev, billingContactName: e.target.value }))}
                placeholder="Who should receive invoices?"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="billingContactEmail" className="block text-sm font-medium text-white/80">Billing contact email</label>
              <input
                id="billingContactEmail"
                type="email"
                value={form.billingContactEmail}
                onChange={(e) => setForm(prev => ({ ...prev, billingContactEmail: e.target.value }))}
                placeholder="billing@company.com"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="billingNotes" className="block text-sm font-medium text-white/80">Billing notes or PO requirements (optional)</label>
            <textarea
              id="billingNotes"
              value={form.billingNotes}
              onChange={(e) => setForm(prev => ({ ...prev, billingNotes: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share PO numbers, billing addresses, or anything else we should include."
            />
          </div>

          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <p className="text-emerald-200 font-semibold">How payment works</p>
            <ul className="mt-2 space-y-1 text-emerald-100/90">
              <li>• Reserve your build slot with a $99 kickoff deposit.</li>
              <li>• We sprint on copy, design, and automation as soon as the deposit clears.</li>
              <li>• The remaining balance is invoiced only after you approve the launch.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'business',
      title: 'Business basics',
      subtitle: 'Tell us who you are and what success looks like.',
      render: () => (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-white/80">Company name</label>
            <input
              id="companyName"
              type="text"
              value={form.companyName}
              onChange={(e) => setForm(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Business Booster AI"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-white/80">Website or landing page</label>
            <input
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://businessbooster.ai"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="primaryMetric" className="block text-sm font-medium text-white/80">Primary success metric</label>
            <input
              id="primaryMetric"
              type="text"
              value={form.primaryMetric}
              onChange={(e) => setForm(prev => ({ ...prev, primaryMetric: e.target.value }))}
              placeholder="Booked consultations, demos, etc."
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="monthlyAdBudget" className="block text-sm font-medium text-white/80">Monthly ad budget (if any)</label>
            <input
              id="monthlyAdBudget"
              type="text"
              value={form.monthlyAdBudget}
              onChange={(e) => setForm(prev => ({ ...prev, monthlyAdBudget: e.target.value }))}
              placeholder="$3k/mo on Meta + Google"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="salesCycle" className="block text-sm font-medium text-white/80">Average sales cycle</label>
            <input
              id="salesCycle"
              type="text"
              value={form.salesCycle}
              onChange={(e) => setForm(prev => ({ ...prev, salesCycle: e.target.value }))}
              placeholder="e.g. 2 calls across 14 days"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-white/80">Team answering leads</label>
            <input
              id="teamSize"
              type="text"
              value={form.teamSize}
              onChange={(e) => setForm(prev => ({ ...prev, teamSize: e.target.value }))}
              placeholder="Sales pod of 3 reps"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
        </div>
      )
    },
    {
      id: 'systems',
      title: 'Systems & availability',
      subtitle: 'Connect the dots so every lead is routed instantly.',
      render: () => (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="crmTools" className="block text-sm font-medium text-white/80">CRM & routing tools</label>
              <input
                id="crmTools"
                type="text"
                value={form.crmTools}
                onChange={(e) => setForm(prev => ({ ...prev, crmTools: e.target.value }))}
                placeholder="HubSpot, Salesforce, etc."
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="voiceCoverage" className="block text-sm font-medium text-white/80">Voice coverage & hours</label>
              <input
                id="voiceCoverage"
                type="text"
                value={form.voiceCoverage}
                onChange={(e) => setForm(prev => ({ ...prev, voiceCoverage: e.target.value }))}
                placeholder="24/7 with warm transfer weekdays 9-5"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="calLink" className="block text-sm font-medium text-white/80">Primary booking link</label>
              <input
                id="calLink"
                type="url"
                value={form.calLink}
                onChange={(e) => setForm(prev => ({ ...prev, calLink: e.target.value }))}
                placeholder="https://cal.com/yourteam"
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Goals & launch timeline',
      subtitle: 'Share expectations so we can architect the rollout.',
      render: () => (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="goals" className="block text-sm font-medium text-white/80">What does success look like?</label>
            <textarea
              id="goals"
              value={form.goals}
              onChange={(e) => setForm(prev => ({ ...prev, goals: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. 30 booked consultations per month within 60 days."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="challenges" className="block text-sm font-medium text-white/80">Biggest challenges today</label>
            <textarea
              id="challenges"
              value={form.challenges}
              onChange={(e) => setForm(prev => ({ ...prev, challenges: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share any messaging gaps, follow-up issues, or technical blockers."
            />
          </div>
          <div>
            <label htmlFor="launchTimeline" className="block text-sm font-medium text-white/80">Preferred launch timeline</label>
            <input
              id="launchTimeline"
              type="text"
              value={form.launchTimeline}
              onChange={(e) => setForm(prev => ({ ...prev, launchTimeline: e.target.value }))}
              placeholder="Kickoff this month, go live within 21 days"
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-white/80">Any extra context?</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share stakeholder names, compliance requirements, or creative assets."
            />
          </div>
        </div>
      )
    },
    {
      id: 'voice',
      title: 'Voice agent & creative playbook',
      subtitle: 'Everything the AI receptionist and ad squads need to sound like you.',
      render: () => (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-white/80">Primary audience segments</label>
            <textarea
              id="targetAudience"
              value={form.targetAudience}
              onChange={(e) => setForm(prev => ({ ...prev, targetAudience: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. Operations leaders at B2B SaaS brands, Med spa owners in Austin, etc."
            />
          </div>
          <div>
            <label htmlFor="uniqueValueProp" className="block text-sm font-medium text-white/80">Core promise / proof</label>
            <textarea
              id="uniqueValueProp"
              value={form.uniqueValueProp}
              onChange={(e) => setForm(prev => ({ ...prev, uniqueValueProp: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share your positioning, differentiators, and testimonials to feature."
            />
          </div>
          <div>
            <label htmlFor="offerDetails" className="block text-sm font-medium text-white/80">Offer details</label>
            <textarea
              id="offerDetails"
              value={form.offerDetails}
              onChange={(e) => setForm(prev => ({ ...prev, offerDetails: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Outline the packages, pricing ranges, and any promos we should highlight."
            />
          </div>
          <div>
            <label htmlFor="brandVoice" className="block text-sm font-medium text-white/80">Brand voice guidelines</label>
            <textarea
              id="brandVoice"
              value={form.brandVoice}
              onChange={(e) => setForm(prev => ({ ...prev, brandVoice: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. Confident, friendly, and data-backed. Words or phrases to embrace or avoid."
            />
          </div>
          <div>
            <label htmlFor="adChannels" className="block text-sm font-medium text-white/80">Active or desired ad channels</label>
            <textarea
              id="adChannels"
              value={form.adChannels}
              onChange={(e) => setForm(prev => ({ ...prev, adChannels: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="List search, social, retargeting, or offline channels we should prioritise."
            />
          </div>
          <div>
            <label htmlFor="followUpProcess" className="block text-sm font-medium text-white/80">Current follow-up process</label>
            <textarea
              id="followUpProcess"
              value={form.followUpProcess}
              onChange={(e) => setForm(prev => ({ ...prev, followUpProcess: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Describe how leads are nurtured today, including SLAs and hand-offs."
            />
          </div>
          <div>
            <label htmlFor="receptionistInstructions" className="block text-sm font-medium text-white/80">Voice agent scripts & guardrails</label>
            <textarea
              id="receptionistInstructions"
              value={form.receptionistInstructions}
              onChange={(e) => setForm(prev => ({ ...prev, receptionistInstructions: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share greetings, qualification questions, hand-off triggers, and compliance language."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="integrations" className="block text-sm font-medium text-white/80">Integrations & tools to connect</label>
            <textarea
              id="integrations"
              value={form.integrations}
              onChange={(e) => setForm(prev => ({ ...prev, integrations: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. HubSpot pipeline, Slack alerts, call tracking, or other systems we should sync."
            />
          </div>
        </div>
      )
    }
  ];
  const totalSteps = steps.length;
  const isLastStep = totalSteps > 0 ? stepIndex >= totalSteps - 1 : true;
  const progressPct = totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : totalSteps === 1 ? 100 : 0;
  const roundedProgress = Number.isFinite(progressPct) ? Math.round(progressPct) : 0;
  const currentStep = steps[stepIndex] ?? steps[0];
  const nextStep = !isLastStep ? steps[stepIndex + 1] : null;

  const answeredStats = useMemo(() => {
    const entries = Object.entries(form).filter(([key]) => key !== 'services');
    const answered = entries.reduce((total, [, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        return total + 1;
      }
      return total;
    }, 0);
    const total = entries.length;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { answered, total, pct } as const;
  }, [form]);

  const nextStepLabel = useMemo(() => {
    if (isLastStep) {
      return 'Submit onboarding & schedule kickoff';
    }
    return nextStep?.title ?? 'Review & submit';
  }, [isLastStep, nextStep?.title]);

  const lastUpdatedLabel = useMemo(() => {
    if (selectedProject?.updatedAt) {
      return formatDate(selectedProject.updatedAt);
    }
    if (selectedProject?.createdAt) {
      return formatDate(selectedProject.createdAt);
    }
    return 'Not saved yet';
  }, [selectedProject?.createdAt, selectedProject?.updatedAt]);

  const goToStep = useCallback(
    (index: number) => {
      if (totalSteps === 0) return;
      const next = Math.max(0, Math.min(totalSteps - 1, index));
      setStepIndex(next);
    },
    [totalSteps]
  );

  const persistOnboarding = useCallback(async () => {
    if (!allowedUser) {
      return { ok: false, message: 'You need to be logged in to save.' } as const;
    }
    const result = await saveOnboarding({
      form,
      projectId: selectedProject?.id ?? undefined,
      label: projectLabel
    });
    return result;
  }, [allowedUser, form, projectLabel, saveOnboarding, selectedProject?.id]);

  const onSaveDraft = useCallback(async () => {
    if (!allowedUser || stepSaving) return;
    setStepSaving(true);
    setOnboardingFeedback(null);
    const result = await persistOnboarding();
    if (!result.ok) {
      setOnboardingFeedback(result.message ?? 'We could not save your onboarding details.');
      setStepSaving(false);
      return;
    }
    setOnboardingFeedback(result.message ?? 'Onboarding saved.');
    setStepSaving(false);
  }, [allowedUser, persistOnboarding, stepSaving]);

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allowedUser) return;
    if (!isLastStep) {
      goToStep(stepIndex + 1);
      return;
    }
    if (saving) return;
    setSaving(true);
    setOnboardingFeedback(null);
    const result = await persistOnboarding();
    if (!result.ok) {
      setOnboardingFeedback(result.message ?? 'We could not save your onboarding details.');
      setSaving(false);
      return;
    }
    setOnboardingFeedback(result.message ?? 'Onboarding saved.');
    setSaving(false);
  }, [allowedUser, goToStep, isLastStep, persistOnboarding, saving, stepIndex]);

  const onAccountSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allowedUser || accountSaving) return;
    setAccountSaving(true);
    setAccountFeedback(null);
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      setAccountFeedback('New password and confirmation do not match.');
      setAccountSaving(false);
      return;
    }
    const payload = {
      name: accountForm.name.trim(),
      email: accountForm.email.trim(),
      company: accountForm.company.trim(),
      currentPassword: accountForm.currentPassword ? accountForm.currentPassword : undefined,
      newPassword: accountForm.newPassword ? accountForm.newPassword : null
    };
    const result = await updateAccount(payload);
    if (!result.ok) {
      setAccountFeedback(result.message ?? 'Unable to update your account.');
      setAccountSaving(false);
      return;
    }
    setAccountFeedback(result.message ?? 'Account updated.');
    setAccountSaving(false);
    setAccountForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  }, [accountForm, accountSaving, allowedUser, updateAccount]);

  if (!allowedUser) {
    return (
      <main id="main" className="container py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-white/80">
          Loading your portal…
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-purple-900/20 p-10 text-white shadow-lg">
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/55">Client Portal</p>
              <h1 className="text-3xl font-semibold md:text-4xl">Welcome back, {allowedUser.name || 'there'}!</h1>
              <p className="max-w-3xl text-white/75">
                Complete your onboarding so we can align the launch plan, campaigns, and AI receptionist. Your answers feed directly into the kickoff roadmap and booking automations.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80 shadow-inner shadow-white/5">
                <p className="text-xs uppercase tracking-wide text-white/60">Onboarding progress</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-semibold text-white">{roundedProgress}%</span>
                  <span className="text-xs text-white/60">Step {stepIndex + 1} of {totalSteps}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="mt-3 text-xs text-white/65">Up next: {nextStepLabel}</p>
              </div>

              <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-5 text-sm text-white shadow-lg shadow-sky-500/20">
                <p className="text-xs uppercase tracking-wide text-sky-200/80">Data coverage</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-white">{answeredStats.answered}</span>
                  <span className="text-sm text-white/70">of {answeredStats.total} prompts</span>
                </div>
                <p className="mt-2 text-xs text-white/80">
                  {answeredStats.pct >= 85
                    ? 'Launch-ready detail — nothing critical missing.'
                    : answeredStats.pct >= 60
                      ? 'Great start. Fill in the remaining prompts to unlock deeper automation.'
                      : 'Share more context so the build squad can personalise copy, ads, and scripts.'}
                </p>
              </div>

              <div className="rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/10 to-transparent p-5 text-sm text-white shadow-lg shadow-fuchsia-500/20">
                <p className="text-xs uppercase tracking-wide text-white/70">Next milestone</p>
                <p className="mt-3 text-lg font-semibold text-white">{nextStepLabel}</p>
                <p className="mt-2 text-xs text-white/75">
                  {isLastStep
                    ? 'Give everything a final review and hit submit so we can lock in your launch schedule.'
                    : `We’ll guide you through ${currentStep?.title?.toLowerCase() || 'this step'} and prep for what’s next.`}
                </p>
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
                {selectedProject?.status ? (
                  <div className="mt-2 text-xs text-white/65">
                    Status: {statusLabels[selectedProject.status] ?? selectedProject.status}
                    {selectedProject.statusNote && (
                      <span className="block text-[0.7rem] text-white/50">{selectedProject.statusNote}</span>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-white/55">We’ll update your status as soon as onboarding is submitted.</div>
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
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${active ? 'bg-white text-black font-semibold shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeSection === 'projects' && (
          <>
            <div className="grid gap-8 lg:grid-cols-[1.65fr,1fr]">
              <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl backdrop-blur">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {allowedUser.onboardingProjects?.map(project => {
                          const active = project.id === selectedProject?.id;
                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => setSelectedProjectId(project.id)}
                              className={`rounded-full px-3 py-1 text-xs transition ${active ? 'border border-sky-400 bg-sky-500/20 text-white shadow-sm shadow-sky-500/30' : 'border border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}
                            >
                              {project.label || 'Project'}
                            </button>
                          );
                        })}
                        {!selectedProject && (
                          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                            Draft project
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleStartNewProject()}
                        disabled={creatingProject}
                        className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Plus className="size-4" />
                        {creatingProject ? 'Creating…' : 'Start new project'}
                      </button>
                    </div>

                    <div>
                      <label htmlFor="projectLabel" className="block text-sm font-medium text-white/80">Project name</label>
                      <input
                        id="projectLabel"
                        type="text"
                        value={projectLabel}
                        onChange={(event) => setProjectLabel(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                        placeholder="e.g. Q2 funnel refresh"
                      />
                      <p className="mt-1 text-xs text-white/50">Rename projects so you can track concurrent launches at a glance.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div
                      ref={stepListRef}
                      className="rounded-2xl border border-white/10 bg-black/45 p-6 shadow-inner shadow-black/20"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50">Onboarding progress</p>
                          <div className="mt-3 flex items-baseline gap-3">
                            <span className="text-3xl font-semibold text-white">{roundedProgress}%</span>
                            <span className="text-xs text-white/60">Step {stepIndex + 1} of {totalSteps}</span>
                          </div>
                          <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            {answeredStats.pct}% data coverage
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                            <span className="size-1.5 rounded-full bg-sky-400" />
                            {answeredStats.answered} of {answeredStats.total} prompts
                          </span>
                        </div>
                      </div>

                      <nav className="mt-6 flex gap-3 overflow-x-auto pb-1" aria-label="Onboarding steps">
                        {steps.map((step, index) => {
                          const status = index < stepIndex ? 'complete' : index === stepIndex ? 'current' : 'upcoming';
                          return (
                            <button
                              key={step.id}
                              type="button"
                              data-step-index={index}
                              onClick={() => goToStep(index)}
                              aria-current={status === 'current' ? 'step' : undefined}
                              className={`group flex min-w-[220px] flex-1 items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                                status === 'current'
                                  ? 'border-sky-400/70 bg-sky-500/15 shadow-lg shadow-sky-500/20'
                                  : status === 'complete'
                                    ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100 shadow-inner shadow-emerald-500/20'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                                  status === 'complete'
                                    ? 'bg-emerald-500/80 text-white'
                                    : status === 'current'
                                      ? 'bg-sky-500 text-white'
                                      : 'bg-white/10 text-white/70 group-hover:text-white'
                                }`}
                              >
                                {index + 1}
                              </span>
                              <span className="space-y-1">
                                <span className="block text-sm font-semibold text-white">{step.title}</span>
                                <span className="block text-xs leading-relaxed text-white/60">{step.subtitle}</span>
                              </span>
                            </button>
                          );
                        })}
                      </nav>

                      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                        <p className="font-semibold text-white/80">Pro tip</p>
                        <p className="mt-1 leading-relaxed">
                          Your answers autosave when you move between steps. Leave sections blank if they don’t apply—we’ll prompt during kickoff.
                        </p>
                      </div>
                    </div>

                    <section
                      ref={stepContentRef}
                      className="space-y-6 rounded-2xl border border-white/10 bg-black/50 p-6 shadow-lg shadow-black/20"
                    >
                      <header className="space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/50 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-100">
                          Step {stepIndex + 1} of {totalSteps}
                        </span>
                        <h2 className="text-2xl font-semibold text-white">{currentStep.title}</h2>
                        <p className="text-sm text-white/70">{currentStep.subtitle}</p>
                      </header>
                      <div className="space-y-6">{currentStep.render()}</div>
                    </section>
                  </div>

                  {onboardingFeedback && (
                    <p className={`rounded-xl px-4 py-3 text-sm ${onboardingFeedback.includes('not') || onboardingFeedback.includes('Unable') ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                      {onboardingFeedback}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      {stepIndex > 0 && (
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => goToStep(stepIndex - 1)}
                        >
                          Previous step
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => void onSaveDraft()}
                        disabled={stepSaving || saving}
                      >
                        {stepSaving ? 'Saving…' : 'Save progress'}
                      </button>
                    </div>
                    <div>
                      <button
                        type={isLastStep ? 'submit' : 'button'}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={!isLastStep ? () => goToStep(stepIndex + 1) : undefined}
                        disabled={isLastStep ? saving : false}
                      >
                        {isLastStep ? (saving ? 'Submitting…' : 'Submit onboarding') : 'Next step'}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-white/60">We’ll email a copy of these notes to your strategist before kickoff.</p>
                </div>
              </form>

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
                    <a className="text-sky-300 underline-offset-4 hover:underline" href="mailto:hello@businessbooster.ai">hello@businessbooster.ai</a>.
                  </p>
                  <p className="mt-2 text-xs text-white/60">We’ll reply within one business day with next steps.</p>
                </section>
              </aside>
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
                            {event.description && (
                              <div className="text-xs text-white/55">{event.description}</div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-white/75">{formatDate(event.startTime)} → {formatDate(event.endTime)}</td>
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
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${depositSummary.paid ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}`}
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
          <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Account & access</h2>
              <span className="rounded-full border border-sky-400/50 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">Client portal</span>
            </div>
            <p className="mt-2 text-sm text-white/70">Update your login details or billing contact. Email changes require your current password.</p>
            <form onSubmit={onAccountSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="accountName" className="block text-xs font-medium uppercase tracking-wide text-white/60">Full name</label>
                  <input
                    id="accountName"
                    type="text"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="accountEmail" className="block text-xs font-medium uppercase tracking-wide text-white/60">Email</label>
                  <input
                    id="accountEmail"
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="accountCompany" className="block text-xs font-medium uppercase tracking-wide text-white/60">Company (optional)</label>
                  <input
                    id="accountCompany"
                    type="text"
                    value={accountForm.company}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, company: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="currentPassword" className="block text-xs font-medium uppercase tracking-wide text-white/60">Current password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={accountForm.currentPassword}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                    placeholder="Required to change email or password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-xs font-medium uppercase tracking-wide text-white/60">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={accountForm.newPassword}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="confirmPassword" className="block text-xs font-medium uppercase tracking-wide text-white/60">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={accountForm.confirmPassword}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
              {accountFeedback && (
                <p className={`rounded-xl px-4 py-2 text-xs ${accountFeedback.includes('not') || accountFeedback.includes('Unable') || accountFeedback.includes('match') ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                  {accountFeedback}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition disabled:cursor-not-allowed disabled:opacity-60"
                disabled={accountSaving}
              >
                {accountSaving ? 'Updating account…' : 'Save account settings'}
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
