'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CATALOG, PLAN_LIST } from '@/lib/plans';
import { defaultOnboarding, type OnboardingForm, type OnboardingStatus, type SafeUser } from '@/lib/types/user';

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
  const { hydrated, currentUser, saveOnboarding } = useAuth();
  const [allowedUser, setAllowedUser] = useState<SafeUser | null>(null);
  const [form, setForm] = useState<OnboardingForm>({ ...defaultOnboarding });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);

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
    const onboarding = allowedUser.onboarding?.data
      ? { ...defaultOnboarding, ...allowedUser.onboarding.data }
      : { ...defaultOnboarding };
    setForm(onboarding);
  }, [allowedUser]);

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

  useEffect(() => {
    if (!allowedUser?.email) return;
    void refreshEvents();
  }, [allowedUser?.email, refreshEvents]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!allowedUser || saving) return;
    setSaving(true);
    setFeedback(null);
    const result = await saveOnboarding(form);
    if (!result.ok) {
      setFeedback(result.message ?? 'We could not save your onboarding details.');
      setSaving(false);
      return;
    }
    setFeedback(result.message ?? 'Onboarding saved.');
    setSaving(false);
  };

  const planDetails = useMemo(() => PLAN_CATALOG[form.plan] ?? PLAN_CATALOG['launch'], [form.plan]);

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
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-purple-900/20 p-10 text-white shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/55">Client Portal</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Welcome back, {allowedUser.name || 'there'}!</h1>
              <p className="mt-3 max-w-2xl text-white/75">
                Complete your onboarding so we can align the launch plan, campaigns, and AI receptionist. Your answers feed directly into the kickoff roadmap and booking automations.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-sm text-white/75">
              <div className="text-xs uppercase tracking-wide text-white/60">Current plan</div>
              <div className="mt-1 text-lg font-semibold">{planDetails.name}</div>
              <div className="text-white/60">{planDetails.tagline}</div>
              {allowedUser.onboarding?.completedAt && (
                <div className="mt-3 text-xs text-emerald-300">
                  Last updated {formatDate(allowedUser.onboarding.completedAt)}
                </div>
              )}
              {allowedUser.onboarding?.status && (
                <div className="mt-2 text-xs text-white/60">
                  Status: {statusLabels[allowedUser.onboarding.status] ?? allowedUser.onboarding.status}
                  {allowedUser.onboarding.statusNote && (
                    <span className="block text-[0.7rem] text-white/50">{allowedUser.onboarding.statusNote}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.65fr,1fr]">
          <form onSubmit={onSubmit} className="space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl backdrop-blur">
            <section>
              <h2 className="text-xl font-semibold text-white">1. Choose your rollout plan</h2>
              <p className="mt-1 text-sm text-white/70">Pick the package that fits your current goals. You can upgrade at any time.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {PLAN_LIST.map(plan => {
                  const active = form.plan === plan.key;
                  return (
                    <label
                      key={plan.key}
                      className={`relative block cursor-pointer rounded-2xl border ${active ? 'border-sky-400 bg-sky-400/10 shadow-lg shadow-sky-500/15' : 'border-white/12 bg-black/40 hover:border-white/25'}`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        className="sr-only"
                        value={plan.key}
                        checked={active}
                        onChange={() => setForm(prev => ({ ...prev, plan: plan.key }))}
                      />
                      <div className="flex h-full flex-col gap-2 p-5 text-white">
                        <div className="text-sm uppercase tracking-wide text-white/60">{plan.tagline}</div>
                        <div className="text-xl font-semibold">{plan.name}</div>
                        <div className="text-sm text-white/70">{plan.price}</div>
                        <ul className="mt-3 space-y-1 text-sm text-white/70">
                          {plan.bullets.map(bullet => (
                            <li key={bullet}>• {bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-xl font-semibold text-white">2. Tell us about your business</h2>
              <p className="text-sm text-white/70">These details help us align messaging, creative, and automation to your team.</p>
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
            </section>

            <section className="space-y-5">
              <h2 className="text-xl font-semibold text-white">3. Systems & availability</h2>
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
                    placeholder="Weekdays 8a-6p ET"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="calLink" className="block text-sm font-medium text-white/80">Cal.com booking link</label>
                <input
                  id="calLink"
                  type="url"
                  value={form.calLink}
                  onChange={(e) => setForm(prev => ({ ...prev, calLink: e.target.value }))}
                  placeholder="https://cal.com/your-team/demo"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-xl font-semibold text-white">4. Goals & launch timeline</h2>
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
            </section>

            <section className="space-y-5">
              <h2 className="text-xl font-semibold text-white">5. Voice agent & creative playbook</h2>
              <p className="text-sm text-white/70">The AI receptionist and ad squads pull directly from these answers.</p>
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
            </section>

            {feedback && (
              <p className={`rounded-xl px-4 py-3 text-sm ${feedback.includes('not') || feedback.includes('Unable') ? 'bg-red-500/15 text-red-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                {feedback}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save onboarding'}
              </button>
              <span className="text-sm text-white/60">We’ll email a copy of these notes to your strategist before kickoff.</span>
            </div>
          </form>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-white shadow-lg">
            <section>
              <h3 className="text-lg font-semibold">Your rollout blueprint</h3>
              <p className="mt-1 text-sm text-white/70">Here’s what we execute once onboarding is complete.</p>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li>
                  <span className="font-semibold text-white">Week 0:</span> Strategy call to align on metrics, message, and required assets.
                </li>
                <li>
                  <span className="font-semibold text-white">Weeks 1-2:</span> Build the conversion flow, draft ads, and script the AI receptionist.
                </li>
                <li>
                  <span className="font-semibold text-white">Week 3:</span> Launch, QA across devices, and plug insights into your reporting hub.
                </li>
                <li>
                  <span className="font-semibold text-white">Week 4:</span> Optimisation sprint with scorecards on booked calls and answered leads.
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
