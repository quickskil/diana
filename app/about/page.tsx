// app/about/page.tsx
import MiniChart from "@/components/MiniChart";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Compass,
  Lightbulb,
  PhoneCall,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "We build automated funnels — conversion-first sites, matching ads, and AI voice follow-up — so you can stay focused on closing deals.",
};

const system = [
  {
    icon: Rocket,
    label: "Funnel launch",
    title: "Narrative that wins trust",
    copy: "Story-first homepage, credibility modules, and fast-loading lead flows built from customer interviews.",
    stat: "+41% demo volume",
  },
  {
    icon: Search,
    label: "Traffic alignment",
    title: "Ads that echo the promise",
    copy: "Search, social, and retargeting creative that mirrors the on-page copy so every click feels familiar.",
    stat: "-27% CPL",
  },
  {
    icon: PhoneCall,
    label: "AI follow-up",
    title: "Instant response, human handoff",
    copy: "Voice agent answers in seconds, qualifies intent, and books meetings with full transcripts and CRM sync.",
    stat: "93% answer rate",
  },
];

const flywheel = [
  {
    title: "Diagnose the reality",
    body: "Deep-dive on offer, objections, and call recordings to write the positioning people repeat back.",
  },
  {
    title: "Design conversion paths",
    body: "Ship one flagship funnel, retarget assets, and lead magnets that support the core storyline.",
  },
  {
    title: "Direct the demand",
    body: "Stand up multi-channel campaigns with audience sequencing, creative testing, and offer rotation.",
  },
  {
    title: "Delight every lead",
    body: "AI receptionist answers 24/7, routes urgent prospects to humans, and shares call recaps automatically.",
  },
  {
    title: "Double-down with data",
    body: "Weekly reviews cover pipeline metrics, experiment backlog, and qualitative feedback from recorded calls.",
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Clarity beats cleverness",
    copy: "We translate complex products into language a distracted buyer can understand in 15 seconds.",
  },
  {
    icon: Compass,
    title: "Marketing meets ops",
    copy: "Every campaign is wired to your CRM, scheduling, and reporting so revenue teams have one source of truth.",
  },
  {
    icon: Lightbulb,
    title: "Experiment every week",
    copy: "We run micro-tests, share the numbers, and either scale the win or archive it with notes.",
  },
  {
    icon: Users,
    title: "Human + AI partnership",
    copy: "Voice agents never replace your closers; they tee up rich context and hand off when a human touch matters.",
  },
];

const snapshots = [
  {
    title: "Buyer journey heatmap",
    description: "Scroll depth, click trails, and question tracking turn anonymous traffic into clear prioritization cues.",
  },
  {
    title: "Channel match reports",
    description: "Ad promise, landing copy, and AI scripts updated together so no prospect hears mixed messaging.",
  },
  {
    title: "Revenue room cadence",
    description: "30-minute weekly sync with a clear agenda: wins, trims, next tests, and requested enablement assets.",
  },
];

const stats = [
  { label: "Average ramp", value: "21 days" },
  { label: "Live funnels shipped", value: "58" },
  { label: "Pipeline influenced", value: "$42M" },
  { label: "Team response time", value: "<4 hrs" },
];

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="about-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.18), transparent 60%)," +
            "radial-gradient(1000px 500px at 100% 10%, rgba(96,165,250,.16), transparent 60%)," +
            "radial-gradient(800px 400px at 10% 95%, rgba(52,211,153,.14), transparent 60%)",
          WebkitMaskImage: "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
          maskImage: "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
        }}
      />

      <div className="container space-y-16">
        <header className="grid gap-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-violet-500/10 md:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 badge">Revenue-ready in weeks</div>
            <h1 id="about-title" className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              We design the growth engine, automate the follow-up, and keep your calendar full
            </h1>
            <p className="lead text-white/75">
              Business Booster pairs senior strategists, conversion design, media buying, and an AI voice desk so founders and
              sales teams can focus on closing — not duct taping tools together.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white/95">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn">
                <Sparkles className="size-4" aria-hidden />
                Book a discovery call
              </Link>
              <Link href="/pricing" className="btn-ghost">
                <ArrowUpRight className="size-4" aria-hidden />
                Explore engagement models
              </Link>
            </div>
            <p className="text-xs text-white/55">No retainers until launch. Cancel anytime after the first quarter if we are not delivering pipeline.</p>
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Weekly pipeline forecast</span>
              <span className="badge">Live dashboard</span>
            </div>
            <MiniChart values={[8, 12, 16, 21, 24, 29, 33, 39]} color="violet" ariaLabel="Pipeline forecast trend increasing steadily" />
            <div className="space-y-3 text-sm text-white/70">
              <p>
                Every Friday you get a quick Loom walkthrough, the numbers behind it, and a list of experiments queued for the
                next sprint.
              </p>
              <ul className="space-y-2 text-xs text-white/55">
                <li className="flex items-center gap-2">
                  <BadgeCheck className="size-3.5" aria-hidden /> Lead source attribution across ads, page, and calls
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="size-3.5" aria-hidden /> Voice agent transcripts with highlights and objections
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="size-3.5" aria-hidden /> Forecast adjustments with clear owner + next step
                </li>
              </ul>
            </div>
          </div>
        </header>

        <section aria-labelledby="system-title" className="space-y-6">
          <div className="space-y-3 text-center">
            <h2 id="system-title" className="text-3xl font-semibold text-white/95">One team, three pillars working in sync</h2>
            <p className="mx-auto max-w-2xl text-sm text-white/70">
              Most agencies ship assets and disappear. We stay embedded with your revenue org, continuously refining the funnel,
              ads, and AI scripts based on what real buyers are saying.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {system.map(({ icon: Icon, label, title, copy, stat }) => (
              <article key={title} className="radiant-card">
                <div className="card h-full space-y-4 p-6">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <Icon className="size-3.5" aria-hidden />
                      {label}
                    </span>
                    <span className="badge">{stat}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white/95">{title}</h3>
                  <p className="text-sm text-white/70">{copy}</p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/55">
                    Includes analytics wiring, copy playbooks, design systems, and technical implementation.
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="flywheel-title" className="radiant-card">
          <div className="card p-8">
            <div className="space-y-3 text-center">
              <h2 id="flywheel-title" className="text-3xl font-semibold text-white/95">Our revenue flywheel</h2>
              <p className="mx-auto max-w-3xl text-sm text-white/70">
                We plug into your stack in under a month, ship a conversion system, and then keep iterating alongside your sales
                crew. Here’s what the lifecycle looks like once we are in motion.
              </p>
            </div>
            <ol className="mt-8 grid gap-6 md:grid-cols-5">
              {flywheel.map((item, index) => (
                <li key={item.title} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.02] p-5 text-left">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/45">Phase {index + 1}</div>
                  <h3 className="text-base font-semibold text-white/95">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="principles-title" className="space-y-6">
          <div className="space-y-3 text-center">
            <h2 id="principles-title" className="text-3xl font-semibold text-white/95">How we show up every week</h2>
            <p className="mx-auto max-w-2xl text-sm text-white/70">
              Working with us feels like adding an operator that cares about the entire journey — from first impression to signed
              agreement.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="radiant-card">
                <div className="card h-full space-y-3 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                    <Icon className="size-4" aria-hidden />
                    Operating principle
                  </div>
                  <h3 className="text-lg font-semibold text-white/95">{title}</h3>
                  <p className="text-sm text-white/70">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="snapshots-title" className="radiant-card">
          <div className="card grid gap-8 p-8 md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:items-center">
            <div className="space-y-4">
              <h2 id="snapshots-title" className="text-3xl font-semibold text-white/95">What partnership feels like</h2>
              <p className="text-sm text-white/70">
                We operate as an extension of your go-to-market team. That means proactive reporting, accessible experts, and
                rapid experimentation that compounds.
              </p>
              <div className="space-y-3">
                {snapshots.map((snapshot) => (
                  <div key={snapshot.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="text-base font-semibold text-white/90">{snapshot.title}</h3>
                    <p className="text-sm text-white/65">{snapshot.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 rounded-[28px] border border-white/10 bg-slate-950/60 p-6 text-sm text-white/70">
              <h3 className="text-lg font-semibold text-white/95">Inside a weekly sync</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-1 size-4" aria-hidden />
                  <span>Quick wins board with new demos, ad angles, and copy tests that outperformed the control.</span>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneCall className="mt-1 size-4" aria-hidden />
                  <span>Call snippets highlighting objections, competitor mentions, and next-step commitments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 size-4" aria-hidden />
                  <span>Shared roadmap showing what ships next and who on your team is in the loop.</span>
                </li>
              </ul>
              <Link href="/case-studies" className="btn-ghost w-full justify-center">
                See recent wins
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-center">
          <p className="text-sm text-white/70">Ready for a funnel that feels bespoke to your buyers and effortless for your team?</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn">
              <PhoneCall className="size-4" aria-hidden />
              Book a strategy session
            </Link>
            <Link href="/pricing" className="btn-ghost">
              <CalendarCheck className="size-4" aria-hidden />
              Compare plans
            </Link>
          </div>
          <p className="text-xs text-white/55">Zero-pressure call. Walk away with a funnel outline and launch checklist even if we are not a fit.</p>
        </section>
      </div>
    </main>
  );
}
