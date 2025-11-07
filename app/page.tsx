import Link from "next/link";
import {
  CalendarClock,
  CalendarCheck,
  Phone,
  MessageSquareHeart,
  Rocket,
  Sparkles,
  LineChart,
  ShieldCheck,
  PhoneCall,
  Workflow,
  ArrowUpRight,
  Headset,
  Mic,
  Share2,
  ArrowRight,
  Headphones,
} from "lucide-react";

const stats = [
  {
    label: "Booked consultations",
    value: "+44%",
    description: "Average uplift after we align site, ads, and receptionist in one funnel.",
  },
  {
    label: "Answered leads",
    value: "93%",
    description: "AI receptionist answers or texts back every inquiry within 17 seconds.",
  },
  {
    label: "Hours saved monthly",
    value: "14",
    description: "Operators stay focused on closes instead of manual follow-up or reschedules.",
  },
];

const journey = [
  {
    title: "Strategy alignment",
    copy: "We audit how leads currently arrive, define the win metric, and agree on the rollout calendar in our kickoff call.",
  },
  {
    title: "Conversion build",
    copy: "Design and ship the site experience with clear proof, a frictionless booking flow, and integrations to your CRM and calendar.",
  },
  {
    title: "Traffic ignition",
    copy: "Launch paid search and social campaigns that mirror the site message, with daily monitoring on cost per booked call.",
  },
  {
    title: "Voice agent activation",
    copy: "Train the AI voice agent to answer forms, calls, and texts, warm-transfer during business hours, and sync availability with Cal.com.",
  },
];

const services = [
  {
    icon: Rocket,
    title: "Conversion-ready website",
    bullets: [
      "Launch pages that load fast and guide visitors to a single clear action.",
      "Message hierarchy written to match the ads and voice scripts.",
      "Booking flow wired into Calendly, Cal.com, or your native calendar.",
    ],
  },
  {
    icon: Share2,
    title: "Demand-driving ads",
    bullets: [
      "Search and social creative mirrors the on-page promise to lift quality.",
      "Weekly optimizations focus budget on keywords and audiences that convert.",
      "Insights shared in plain English so decisions stay focused on pipeline.",
    ],
  },
  {
    icon: Headset,
    title: "AI voice agent",
    bullets: [
      "Answers calls, texts, and form submissions within seconds—day or night.",
      "Books meetings, confirms details, or warm-transfers to your team on schedule.",
      "Integrates with your CRM plus Cal.com for synced availability and reminders.",
    ],
  },
];

const proof = [
  {
    headline: "Momentum: boutique med spa",
    result: "+58% booked consults in 60 days",
    body: "Launched a new homepage and ad set with unified messaging. AI receptionist handled after-hours callers and saved 9 hours of follow-up each week.",
  },
  {
    headline: "Reignite: B2B SaaS demos",
    result: "32 net-new demos per month",
    body: "Built a revenue page that speaks directly to operators, layered retargeting flows, and trained the voice agent to qualify by tech stack and budget before handoff.",
  },
  {
    headline: "Precision: legal services",
    result: "4.3x paid media efficiency",
    body: "Deployed geo-targeted landing experiences with testimonial proof bars and an immediate receptionist callback, keeping first-response times under one minute.",
  },
];

const commitments = [
  {
    icon: ShieldCheck,
    title: "Single accountable team",
    copy: "We own copy, design, media, and voice automation so there are no handoffs or agency gaps.",
  },
  {
    icon: Workflow,
    title: "Transparent rituals",
    copy: "Weekly scorecards, roadmaps, and live Loom reviews keep every initiative visible and actionable.",
  },
  {
    icon: Sparkles,
    title: "Compounding experiments",
    copy: "We ship tests every sprint—pricing angles, new offers, scripts—so performance never plateaus.",
  },
];

const callOptions = [
  {
    icon: CalendarCheck,
    title: "Schedule a strategy call",
    description: "Pick a 30-minute slot to review your funnel and build a rollout plan together.",
    href: "/contact",
    action: "Book a call",
  },
  {
    icon: PhoneCall,
    title: "Talk to our receptionist now",
    description: "Call and experience the AI receptionist first-hand. We can warm transfer you to a strategist.",
    href: "tel:+12136810660",
    action: "Call now",
  },
  {
    icon: MessageSquareHeart,
    title: "Request a callback",
    description: "Drop your details and we’ll text you within a few minutes to confirm the best time to connect.",
    href: "/contact?type=callback",
    action: "Request callback",
  },
];

const faqs = [
  {
    q: "How fast can we launch after the discovery call?",
    a: "Our team prepares the messaging sprint immediately. Sites and media campaigns are typically live within 21 days, and the AI receptionist is trained in parallel so it goes live the same week as the new funnel.",
  },
  {
    q: "Do you integrate with our existing CRM and calendars?",
    a: "Yes. We connect directly to HubSpot, Salesforce, GoHighLevel, Calendly, Cal.com, and most major scheduling tools. Leads, transcripts, and bookings sync in real time with your workflows.",
  },
  {
    q: "What does ongoing optimization look like?",
    a: "Every week you receive a scorecard covering booked calls, cost-per-lead, and receptionist performance. We propose experiments, ship new assets, and review receptionist conversations to keep improving conversion quality.",
  },
  {
    q: "Is the AI receptionist compliant for regulated industries?",
    a: "We configure disclosures, consent language, and data retention per industry guidelines. Calls are recorded, securely stored, and can be routed to human agents whenever additional compliance oversight is needed.",
  },
];

export default function Page() {
  return (
    <main className="space-y-12 pb-16 md:space-y-16 md:pb-24">
      <HeroSection />
      <StatsSection />
      <JourneySection />
      <ServicesSection />
      <ProofSection />
      <CommitmentSection />
      <EngagementTimeline />
      <CallToActionSection />
      <FaqSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950 px-10 py-10 shadow-xl">
          <div className="absolute -top-40 -right-20 size-[420px] rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-32 left-10 size-[320px] rounded-full bg-emerald-500/15 blur-3xl" aria-hidden />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-white/80">
                <Sparkles className="size-4" aria-hidden />
                Full-funnel revenue team
              </div>

              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Turn curious clicks into scheduled conversations with one connected growth system.
              </h1>

              <p className="max-w-2xl text-lg text-white/75 md:text-xl">
                Business Booster AI designs the conversion-ready site, runs paid traffic that matches the message, and trains an AI voice agent to answer every inquiry, book meetings, or warm-transfer on schedule.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/contact" className="btn h-12 gap-2 text-base">
                  <CalendarClock className="size-5" aria-hidden />
                  Schedule my strategy call
                </Link>
                <Link href="#schedule" className="btn-ghost h-12 gap-2 text-base">
                  <Phone className="size-5" aria-hidden />
                  Explore call options
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "What you get",
                    value: "Site, ads, AI receptionist",
                  },
                  {
                    label: "Primary metric",
                    value: "Booked consultations",
                  },
                  {
                    label: "Engagement",
                    value: "One monthly retainer",
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-wide text-white/50">{item.label}</p>
                    <p className="mt-1 font-semibold text-white/85">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <header className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200/80">How we make the call inevitable</p>
                <p className="text-base text-white/75">
                  We connect every touchpoint so prospects glide from curiosity to confirmed calendar event.
                </p>
              </header>
              <ul className="space-y-4 text-sm text-white/75">
                <li className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                  <LineChart className="mt-1 size-5 text-indigo-300" aria-hidden />
                  <span>Messaging, creative, and receptionist scripts reference the same promise and proof for total alignment.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                  <Mic className="mt-1 size-5 text-emerald-300" aria-hidden />
                  <span>Voice AI answers within seconds, qualifies, and books or warm-transfers based on your team’s availability.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                  <ShieldCheck className="mt-1 size-5 text-sky-300" aria-hidden />
                  <span>Scorecards tie spend to revenue, so growth decisions are anchored in pipeline impact—not vanity metrics.</span>
                </li>
              </ul>
              <div className="space-y-3">
                <Link href="/voice-demo" className="btn inline-flex h-11 w-full items-center justify-center gap-2 text-sm">
                  <Headphones className="size-4" aria-hidden />
                  Try the live voice demo
                </Link>
                <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
                  Review live case studies <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid gap-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="space-y-3">
              <p className="text-sm uppercase tracking-wide text-white/50">{item.label}</p>
              <p className="text-4xl font-semibold text-white">{item.value}</p>
              <p className="text-sm text-white/65">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="section">
      <div className="container grid gap-12 lg:grid-cols-[0.6fr_1fr]">
        <div className="space-y-6">
          <p className="badge">The lead journey</p>
          <h2 className="text-balance">From first touch to booked meeting—mapped before we launch.</h2>
          <p className="text-lg text-white/70">
            Prospects encounter a consistent narrative, frictionless scheduling, and proactive follow-up. This is the blueprint we walk through on your strategy call.
          </p>
          <Link href="/contact" className="btn inline-flex h-11 w-fit items-center gap-2">
            <CalendarClock className="size-4" aria-hidden />
            Map my funnel with you
          </Link>
        </div>

        <ol className="grid gap-6">
          {journey.map((step, index) => (
            <li key={step.title} className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-400 via-sky-400 to-emerald-400" aria-hidden />
              <div className="pl-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Step {index + 1}</p>
                <p className="mt-2 text-xl font-semibold text-white/90">{step.title}</p>
                <p className="mt-3 text-sm text-white/65">{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="section">
      <div className="container space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="badge">What we deploy</p>
          <h2 className="text-balance">Three linked disciplines—website, ads, and voice agent—driving one outcome.</h2>
          <p className="text-lg text-white/70">
            Every deliverable is built to hand off momentum to the next, so by the time a lead reaches your team they already know what to expect and how to move forward.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_18px_40px_-30px_rgba(99,102,241,0.7)]"
            >
              <span className="h-1.5 w-16 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400" aria-hidden />
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <service.icon className="size-5 text-indigo-200" aria-hidden />
                </span>
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <ArrowRight className="mt-1 size-4 text-white/40" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="section">
      <div className="container space-y-10">
        <div className="max-w-3xl space-y-4">
          <p className="badge">Recent wins</p>
          <h2 className="text-balance">Specialists across service, SaaS, and local lead gen trust Business Booster AI.</h2>
          <p className="text-lg text-white/70">
            On your call we’ll unpack the playbooks behind these results and how they map to your pipeline.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {proof.map((item) => (
            <article key={item.headline} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/75 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/50">{item.headline}</p>
              <p className="text-lg font-semibold text-white">{item.result}</p>
              <p className="text-sm text-white/70">{item.body}</p>
              <Link href="/case-studies" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white">
                Explore the playbook <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommitmentSection() {
  return (
    <section className="section">
      <div className="container grid gap-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/80 to-slate-950/80 p-10 lg:grid-cols-[0.7fr_1fr]">
        <div className="space-y-5">
          <p className="badge">Why teams stay</p>
          <h2 className="text-balance">You get enterprise-level execution with the pace of a dedicated growth pod.</h2>
          <p className="text-lg text-white/70">
            We plug into your CRM, routing rules, and calendar stack to act like an in-house revenue team. Every experiment is prioritized for impact on scheduled conversations.
          </p>
          <Link href="/pricing" className="btn-ghost inline-flex h-11 w-fit items-center gap-2">
            Review engagement structure <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
          {commitments.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
              <item.icon className="size-8 text-indigo-300" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EngagementTimeline() {
  const timeline = [
    {
      title: "Week 0",
      headline: "Strategy call",
      description: "Assess funnel metrics, identify quick wins, and decide if we’re a fit to co-own outcomes.",
    },
    {
      title: "Weeks 1-3",
      headline: "Build and launch",
      description: "Ship conversion site, ad creative, and receptionist training simultaneously.",
    },
    {
      title: "Week 4",
      headline: "Optimization sprint",
      description: "Analyze first 30 days of calls and campaign data, prioritize next experiments.",
    },
    {
      title: "Month 2+",
      headline: "Scale",
      description: "Layer nurture sequences, expand channels, and replicate what converts best.",
    },
  ];

  return (
    <section className="section">
      <div className="container space-y-8">
        <div className="max-w-2xl space-y-4">
          <p className="badge">Engagement timeline</p>
          <h2 className="text-balance">Know exactly what happens after you book the call.</h2>
          <p className="text-lg text-white/70">
            The scheduling link kicks off a collaborative rollout. We’ll share this roadmap and tailor each milestone to your team during the session.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{item.title}</p>
              <p className="mt-3 text-lg font-semibold text-white">{item.headline}</p>
              <p className="mt-3 text-sm text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToActionSection() {
  return (
    <section id="schedule" className="section">
      <div className="container space-y-10">
        <div className="max-w-3xl space-y-4">
          <p className="badge">Take the next step</p>
          <h2 className="text-balance">We have three fast ways to connect—pick what works best for you.</h2>
          <p className="text-lg text-white/70">
            Whether you want to experience the receptionist, review numbers live, or have us follow up, the path to a booked call is ready right now.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {callOptions.map((option) => (
            <div key={option.title} className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <option.icon className="size-9 text-indigo-300" aria-hidden />
              <h3 className="text-xl font-semibold text-white">{option.title}</h3>
              <p className="text-sm text-white/70">{option.description}</p>
              <Link
                href={option.href}
                className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-500"
              >
                {option.action}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white/85">Prefer email?</p>
            <p>Send a note to <a href="mailto:hello@businessbooster.ai" className="text-indigo-300 hover:text-indigo-200">hello@businessbooster.ai</a> and we’ll reply within a business day.</p>
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-100">
            View retainers and deliverables <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[0.7fr_1fr]">
        <div className="space-y-4">
          <p className="badge">FAQs</p>
          <h2 className="text-balance">What teams ask before they book the call.</h2>
          <p className="text-lg text-white/70">
            Have something more specific? Bring it to the strategy call or mention it when you speak with the receptionist.
          </p>
        </div>
        <div className="space-y-6">
          {faqs.map((item) => (
            <div key={item.q} className="space-y-2 rounded-3xl border border-white/10 bg-slate-900/75 p-6">
              <p className="text-base font-semibold text-white">{item.q}</p>
              <p className="text-sm text-white/70">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
