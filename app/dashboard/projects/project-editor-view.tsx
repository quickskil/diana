'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { PLAN_CATALOG, PLAN_LIST } from '@/lib/plans';
import {
  defaultOnboarding,
  type OnboardingForm,
  type OnboardingStatus,
  type SafeUser
} from '@/lib/types/user';

const statusLabels: Record<OnboardingStatus, string> = {
  'not-started': 'Not started',
  'submitted': 'Submitted for review',
  'in-progress': 'In progress',
  'launch-ready': 'Launch-ready'
};

interface ProjectEditorViewProps {
  projectId?: string | null;
}

export default function ProjectEditorView({ projectId = null }: ProjectEditorViewProps) {
  const router = useRouter();
  const { hydrated, currentUser, saveOnboarding } = useAuth();
  const [allowedUser, setAllowedUser] = useState<SafeUser | null>(null);
  const [form, setForm] = useState<OnboardingForm>({ ...defaultOnboarding });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId);
  const [projectLabel, setProjectLabel] = useState('New onboarding');
  const [creatingProject, setCreatingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stepSaving, setStepSaving] = useState(false);
  const [onboardingFeedback, setOnboardingFeedback] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const initialStepRender = useRef(true);
  const stepListRef = useRef<HTMLDivElement | null>(null);
  const stepContentRef = useRef<HTMLDivElement | null>(null);

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
    if (projectId && allowedUser.onboardingProjects?.some(project => project.id === projectId)) {
      setSelectedProjectId(projectId);
      return;
    }
    if (!projectId && allowedUser.onboardingProjects?.length) {
      const latest = [...allowedUser.onboardingProjects].sort((a, b) =>
        a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0
      )[0];
      setSelectedProjectId(latest?.id ?? null);
    }
  }, [allowedUser, projectId]);

  const selectedProject = useMemo(() => {
    if (!allowedUser?.onboardingProjects) {
      return null;
    }
    if (!selectedProjectId) {
      return null;
    }
    return allowedUser.onboardingProjects.find(project => project.id === selectedProjectId) ?? null;
  }, [allowedUser?.onboardingProjects, selectedProjectId]);

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

  const planDetails = useMemo(() => PLAN_CATALOG[form.plan] ?? PLAN_CATALOG['launch'], [form.plan]);

  const steps = [
    {
      id: 'kickoff',
      title: 'Kickoff & billing contact',
      subtitle: 'Choose your rollout plan and who we coordinate payment with.',
      render: () => (
        <div className="space-y-6">
          <section>
            <p className="text-sm text-white/70">Pick the package that fits your current goals. You can upgrade at any time.</p>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 xl:overflow-visible xl:[mask-image:none] [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
              {PLAN_LIST.map(plan => {
                const active = form.plan === plan.key;
                return (
                  <button
                    key={plan.key}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, plan: plan.key }))}
                    className={`group flex min-w-[240px] max-w-xs flex-1 flex-col justify-between rounded-2xl border px-5 py-5 text-left transition ${
                      active
                        ? 'border-sky-400/80 bg-gradient-to-br from-sky-500/30 via-cyan-500/10 to-transparent shadow-[0_0_30px_rgba(56,189,248,0.35)]'
                        : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                    }`}
                    aria-pressed={active}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                          <p className="text-sm text-white/70">{plan.tagline}</p>
                        </div>
                        {active && (
                          <span className="rounded-full border border-emerald-400/70 bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-100">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-white/60">{plan.description}</p>
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-white/55">
                      {plan.bullets.map(point => (
                        <li key={point} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-sky-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="billingContactName" className="block text-sm font-medium text-white/80">
                Billing contact name
              </label>
              <input
                id="billingContactName"
                value={form.billingContactName}
                onChange={(event) => setForm(prev => ({ ...prev, billingContactName: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                placeholder="Who should receive billing notices?"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="billingContactEmail" className="block text-sm font-medium text-white/80">
                Billing contact email
              </label>
              <input
                id="billingContactEmail"
                type="email"
                value={form.billingContactEmail}
                onChange={(event) => setForm(prev => ({ ...prev, billingContactEmail: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                placeholder="billing@yourcompany.com"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="billingNotes" className="block text-sm font-medium text-white/80">
                Billing notes or procurement requirements
              </label>
              <textarea
                id="billingNotes"
                value={form.billingNotes}
                onChange={(event) => setForm(prev => ({ ...prev, billingNotes: event.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                placeholder="E.g. vendor onboarding steps, PO numbers, or invoice formats."
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'company',
      title: 'Company & positioning',
      subtitle: 'Tell us about your offer so we can calibrate messaging and assets.',
      render: () => (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm font-medium text-white/80">
              Company name
            </label>
            <input
              id="companyName"
              value={form.companyName}
              onChange={(event) => setForm(prev => ({ ...prev, companyName: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Your brand or product"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="website" className="block text-sm font-medium text-white/80">
              Website
            </label>
            <input
              id="website"
              value={form.website}
              onChange={(event) => setForm(prev => ({ ...prev, website: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="https://"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="primaryMetric" className="block text-sm font-medium text-white/80">
              What’s the primary metric you’re driving?
            </label>
            <input
              id="primaryMetric"
              value={form.primaryMetric}
              onChange={(event) => setForm(prev => ({ ...prev, primaryMetric: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. Booked consultations, qualified demos, etc."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="monthlyAdBudget" className="block text-sm font-medium text-white/80">
              Monthly media budget (if applicable)
            </label>
            <input
              id="monthlyAdBudget"
              value={form.monthlyAdBudget}
              onChange={(event) => setForm(prev => ({ ...prev, monthlyAdBudget: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="$5k, $15k, etc."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="salesCycle" className="block text-sm font-medium text-white/80">
              Typical sales cycle length
            </label>
            <input
              id="salesCycle"
              value={form.salesCycle}
              onChange={(event) => setForm(prev => ({ ...prev, salesCycle: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. 7 days, 3 weeks, etc."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="teamSize" className="block text-sm font-medium text-white/80">
              Sales team size & coverage
            </label>
            <input
              id="teamSize"
              value={form.teamSize}
              onChange={(event) => setForm(prev => ({ ...prev, teamSize: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. 3 closers, 2 SDRs, etc."
            />
          </div>
        </div>
      )
    },
    {
      id: 'stack',
      title: 'Tech stack & automations',
      subtitle: 'Map where we should plug in so nothing falls through the cracks.',
      render: () => (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="crmTools" className="block text-sm font-medium text-white/80">
              CRM or lead management tools
            </label>
            <textarea
              id="crmTools"
              value={form.crmTools}
              onChange={(event) => setForm(prev => ({ ...prev, crmTools: event.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="HubSpot, Salesforce, Airtable, etc."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="voiceCoverage" className="block text-sm font-medium text-white/80">
              Phone coverage or receptionist hours
            </label>
            <textarea
              id="voiceCoverage"
              value={form.voiceCoverage}
              onChange={(event) => setForm(prev => ({ ...prev, voiceCoverage: event.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. 9am-6pm ET, 24/7, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="calLink" className="block text-sm font-medium text-white/80">
              Booking link or calendar URL
            </label>
            <input
              id="calLink"
              value={form.calLink}
              onChange={(event) => setForm(prev => ({ ...prev, calLink: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="https://cal.com/your-team"
            />
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Goals & objections',
      subtitle: 'Share expectations so we can architect the rollout.',
      render: () => (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="goals" className="block text-sm font-medium text-white/80">
              What does success look like in 90 days?
            </label>
            <textarea
              id="goals"
              value={form.goals}
              onChange={(event) => setForm(prev => ({ ...prev, goals: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share revenue targets, booked calls, or other KPIs."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="challenges" className="block text-sm font-medium text-white/80">
              What’s been the biggest challenge so far?
            </label>
            <textarea
              id="challenges"
              value={form.challenges}
              onChange={(event) => setForm(prev => ({ ...prev, challenges: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share objections, funnel drop-offs, or any blockers."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="launchTimeline" className="block text-sm font-medium text-white/80">
              Ideal launch timeline
            </label>
            <textarea
              id="launchTimeline"
              value={form.launchTimeline}
              onChange={(event) => setForm(prev => ({ ...prev, launchTimeline: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="E.g. Launch in 4 weeks, align with conference dates, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-white/80">
              Additional notes for the build squad
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) => setForm(prev => ({ ...prev, notes: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share context we should know before kickoff."
            />
          </div>
        </div>
      )
    },
    {
      id: 'audience',
      title: 'Audience & messaging',
      subtitle: 'Dial in who we’re targeting and how we should speak with them.',
      render: () => (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="targetAudience" className="block text-sm font-medium text-white/80">
              Target audience
            </label>
            <textarea
              id="targetAudience"
              value={form.targetAudience}
              onChange={(event) => setForm(prev => ({ ...prev, targetAudience: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Demographics, industries, or personas."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="uniqueValueProp" className="block text-sm font-medium text-white/80">
              Unique value prop or differentiator
            </label>
            <textarea
              id="uniqueValueProp"
              value={form.uniqueValueProp}
              onChange={(event) => setForm(prev => ({ ...prev, uniqueValueProp: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Why do customers choose you over alternatives?"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="offerDetails" className="block text-sm font-medium text-white/80">
              Offer details
            </label>
            <textarea
              id="offerDetails"
              value={form.offerDetails}
              onChange={(event) => setForm(prev => ({ ...prev, offerDetails: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Pricing, guarantee, bonuses, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="brandVoice" className="block text-sm font-medium text-white/80">
              Brand voice or tone preferences
            </label>
            <textarea
              id="brandVoice"
              value={form.brandVoice}
              onChange={(event) => setForm(prev => ({ ...prev, brandVoice: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Formal, energetic, conversational, etc."
            />
          </div>
        </div>
      )
    },
    {
      id: 'channels',
      title: 'Channels & follow-up',
      subtitle: 'Tell us where you’re running traffic and how you close the loop.',
      render: () => (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="adChannels" className="block text-sm font-medium text-white/80">
              Primary ad or acquisition channels
            </label>
            <textarea
              id="adChannels"
              value={form.adChannels}
              onChange={(event) => setForm(prev => ({ ...prev, adChannels: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Meta, Google, outbound, partnerships, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="followUpProcess" className="block text-sm font-medium text-white/80">
              Follow-up process after a lead books
            </label>
            <textarea
              id="followUpProcess"
              value={form.followUpProcess}
              onChange={(event) => setForm(prev => ({ ...prev, followUpProcess: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="How do you nurture and close leads?"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="receptionistInstructions" className="block text-sm font-medium text-white/80">
              AI receptionist instructions
            </label>
            <textarea
              id="receptionistInstructions"
              value={form.receptionistInstructions}
              onChange={(event) => setForm(prev => ({ ...prev, receptionistInstructions: event.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
              placeholder="Share greetings, qualification questions, hand-off triggers, and compliance language."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="integrations" className="block text-sm font-medium text-white/80">
              Integrations & tools to connect
            </label>
            <textarea
              id="integrations"
              value={form.integrations}
              onChange={(event) => setForm(prev => ({ ...prev, integrations: event.target.value }))}
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
      return { ok: false, message: 'You need to be signed in.' } as const;
    }
    const result = await saveOnboarding({
      form,
      label: projectLabel,
      projectId: selectedProject?.id || undefined
    });
    if (!result.ok) {
      return { ok: false, message: result.message ?? 'Unable to save onboarding right now.' } as const;
    }
    return { ok: true, message: result.message ?? 'Onboarding saved.', user: result.user } as const;
  }, [allowedUser, form, projectLabel, saveOnboarding, selectedProject?.id]);

  const onSaveDraft = useCallback(async () => {
    if (stepSaving) return;
    setStepSaving(true);
    const result = await persistOnboarding();
    if (!result.ok) {
      setOnboardingFeedback(result.message ?? 'We could not save your onboarding details.');
      setStepSaving(false);
      return;
    }
    setOnboardingFeedback(result.message ?? 'Onboarding saved.');
    setStepSaving(false);
  }, [persistOnboarding, stepSaving]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [allowedUser, goToStep, isLastStep, persistOnboarding, saving, stepIndex]
  );

  const handleStartNewProject = useCallback(async () => {
    if (!allowedUser || creatingProject) return;
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
        router.replace(`/dashboard/projects/${newest.id}`);
      }
    }
    setCreatingProject(false);
  }, [allowedUser, creatingProject, router, saveOnboarding]);

  if (!allowedUser) {
    return (
      <main id="main" className="container py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-10 text-center text-white/80">
          Loading your project workspace…
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10 text-white">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Project workspace</p>
              <h1 className="text-3xl font-semibold md:text-4xl">{projectLabel}</h1>
              <p className="mt-2 text-sm text-white/70">
                Capture the launch details your build squad needs. Updates autosave when you move between steps.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Back to dashboard
              </Link>
              <button
                type="button"
                onClick={() => void handleStartNewProject()}
                disabled={creatingProject}
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-sm font-medium text-white transition hover:border-sky-300/60 hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="size-4" />
                {creatingProject ? 'Creating…' : 'Start another project'}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-white/60">Progress</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-3xl font-semibold text-white">{roundedProgress}%</span>
                <span className="text-xs text-white/60">Step {stepIndex + 1} of {totalSteps}</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-white/65">Up next: {nextStepLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-white/60">Data coverage</p>
              <div className="mt-3 text-lg font-semibold text-white">
                {answeredStats.answered} of {answeredStats.total} prompts
              </div>
              <p className="mt-2 text-xs text-white/70">
                {answeredStats.pct >= 85
                  ? 'Launch-ready detail — nothing critical missing.'
                  : answeredStats.pct >= 60
                    ? 'Great start. Fill in the remaining prompts to unlock deeper automation.'
                    : 'Share more context so the build squad can personalise copy, ads, and scripts.'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-white/60">Status</p>
              <div className="mt-3 text-lg font-semibold text-white">
                {selectedProject ? statusLabels[selectedProject.status] : 'Draft project'}
              </div>
              <p className="mt-2 text-xs text-white/70">Last updated {lastUpdatedLabel}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allowedUser.onboardingProjects?.map(project => {
              const active = project.id === selectedProject?.id;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    router.replace(`/dashboard/projects/${project.id}`);
                  }}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    active
                      ? 'border border-sky-400 bg-sky-500/20 text-white shadow-sm shadow-sky-500/30'
                      : 'border border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
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

          <div>
            <label htmlFor="projectLabel" className="block text-sm font-medium text-white/80">
              Project name
            </label>
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
        </header>

        <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.65fr,1fr]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl backdrop-blur">
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

            {onboardingFeedback && (
              <p
                className={`rounded-xl px-4 py-3 text-sm ${
                  onboardingFeedback.includes('not') || onboardingFeedback.includes('Unable')
                    ? 'bg-red-500/15 text-red-300'
                    : 'bg-emerald-500/15 text-emerald-300'
                }`}
              >
                {onboardingFeedback}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                {stepIndex > 0 && (
                  <button type="button" className="btn-ghost" onClick={() => goToStep(stepIndex - 1)}>
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
              <h3 className="text-lg font-semibold">Plan highlights</h3>
              <p className="mt-1 text-sm text-white/70">{planDetails.description}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {planDetails.bullets.map(point => (
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
              <p className="mt-2 text-xs text-white/60">We’ll reply within one business day with next steps.</p>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}

function formatDate(value?: string) {
  if (!value) return 'TBD';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
}
