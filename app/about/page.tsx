// app/about/page.tsx
import MiniChart from "@/components/MiniChart";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, PhoneCall, Rocket, Search, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "We build automated funnels — conversion-first sites, matching ads, and AI voice follow-up — so you can stay focused on closing deals.",
};

const pillars = [
  {
    icon: Rocket,
    title: "Funnel Foundation",
    body: "We build the homepage like a trusted friend explaining what you do and why it matters.",
    stat: "+37% booked calls",
  },
  {
    icon: Search,
    title: "Traffic Engine",
    body: "Ads mirror the page promise so every click lands on something familiar and fast.",
    stat: "-24% cost per lead",
  },
  {
    icon: PhoneCall,
    title: "Lead Response",
    body: "An AI receptionist that answers right away, books meetings, and hands off hot leads with context.",
    stat: "93% answer rate",
  },
];

const reasons = [
  {
    title: "Plain-language positioning",
    copy: "We explain your offer like a friend would, so prospects nod along within seconds.",
  },
  {
    title: "Tight ad → page match",
    copy: "Ads and landing pages speak the same language, lowering costs and boosting trust.",
  },
  {
    title: "Always-on follow-up",
    copy: "Our AI receptionist answers instantly, books meetings, and shares notes so nothing slips through.",
  },
];

const steps = [
  {
    label: "Week 1",
    title: "Launch the conversion page",
    desc: "Copy, design, and proof wrapped into a single action-focused experience.",
  },
  {
    label: "Week 2",
    title: "Light up the demand",
    desc: "Search + social that mirror the page and send people to the same friendly CTA.",
  },
  {
    label: "Always on",
    title: "Let the voice agent respond",
    desc: "Every inquiry is greeted, qualified, and either booked or transferred in real time.",
  },
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

      <div className="container space-y-12">
        <header className="space-y-5 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 badge">Automated funnel, friendly team</div>
          <h1 id="about-title">We build the whole funnel so you can just close</h1>
          <p className="lead text-white/75">
            Design, media, and AI follow-up under one roof. We keep it conversational, share what’s working each week, and keep
            your calendar full without you chasing leads.
          </p>
          <div className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
            Most teams add 8-12 qualified conversations within the first 60 days once the full system is live.
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link href="/contact" className="btn">Book a friendly strategy chat</Link>
            <Link href="/pricing" className="btn-ghost">See pricing</Link>
          </div>
          <p className="text-xs text-white/55">Start lean. Scale when the numbers work. No long-term contracts.</p>
        </header>

        <section aria-labelledby="pillar-title" className="space-y-4">
          <h2 id="pillar-title" className="text-center">What we deliver together</h2>
          <p className="text-center text-white/70 max-w-2xl mx-auto">
            Three pieces, one pipeline. We handle the hand-off from click to booked call so you can stay focused on closing.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {pillars.map(({ icon: Icon, title, body, stat }) => (
              <div key={title} className="radiant-card">
                <div className="card h-full p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="size-5 opacity-90" aria-hidden />
                    </span>
                    <span className="badge">{stat}</span>
                  </div>
                  <h3 className="font-semibold text-white/95">{title}</h3>
                  <p className="text-sm text-white/70">{body}</p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/60">
                    Clients typically report {stat} within the first 60 days.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="reason-title" className="space-y-4">
          <h2 id="reason-title" className="text-center">Why the system works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {reasons.map((item) => (
              <div key={item.title} className="radiant-card">
                <div className="card h-full p-5 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    <Sparkles className="size-3.5" aria-hidden />
                    Real-world playbook
                  </div>
                  <h3 className="font-semibold text-white/95">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="step-title" className="space-y-4">
          <h2 id="step-title" className="text-center">How we plug in</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <div key={step.title} className="radiant-card">
                <div className="card h-full p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{step.label}</span>
                    <span className="badge">Done for you</span>
                  </div>
                  <h3 className="font-semibold text-white/95">{step.title}</h3>
                  <p className="text-sm text-white/70">{step.desc}</p>
                  <div className="space-y-1">
                    <div className="progress-track" aria-hidden>
                      <div className="progress-bar" style={{ width: `${((idx + 1) / steps.length) * 100}%` }} />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">Step {idx + 1}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="radiant-card">
          <div className="card grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] md:items-center">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white/95">We stay close to the numbers</h2>
              <p className="text-sm text-white/70">
                Weekly check-ins keep the funnel sharp. We show what booked, what we trimmed, and the next experiment — all in
                plain language.
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/80 md:justify-start">
                <span className="pill"><Sparkles className="size-4" aria-hidden /> Conversion-first updates</span>
                <span className="pill"><Search className="size-4" aria-hidden /> Spend focused on wins</span>
                <span className="pill"><PhoneCall className="size-4" aria-hidden /> Call summaries in your inbox</span>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
              <div className="flex items-center justify-between text-white/60">
                <span>Weekly booked calls</span>
                <span className="badge">Live dashboard</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Friday updates highlight wins, trims, and next experiments. Want a sample? We’ll walk through one on a quick call.
              </p>
              <Link href="/contact" className="btn h-10 w-full text-sm">
                Get a sample update
              </Link>
              <p className="text-xs text-white/55">You get a concise loom and written recap every Friday.</p>
            </div>
          </div>
        </section>

        <section className="text-center space-y-4">
          <p className="text-white/70">Want us to sketch your funnel on a quick call?</p>
          <div className="mx-auto max-w-xs">
            <MiniChart values={[12, 16, 22, 29, 34, 39, 44, 52]} color="violet" ariaLabel="Booked calls increasing month over month" />
            <p className="mt-2 text-xs text-white/55">What the first eight weeks typically look like once everything is connected.</p>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link href="/contact" className="btn">
              <PhoneCall className="size-4" aria-hidden />
              Book a call
            </Link>
            <Link href="/pricing" className="btn-ghost">
              <CalendarCheck className="size-4" aria-hidden />
              Explore pricing
            </Link>
          </div>
          <p className="text-xs text-white/55">Zero pressure. Leave with a roadmap either way.</p>
        </section>
      </div>
    </main>
  );
}
