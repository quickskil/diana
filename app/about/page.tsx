// app/about/page.tsx
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
    body: "A conversion-ready site that tells the story quickly, builds trust, and drives every visitor to book a call.",
  },
  {
    icon: Search,
    title: "Traffic Engine",
    body: "Intent-led ads that echo the page, so every dollar goes toward conversations that actually close.",
  },
  {
    icon: PhoneCall,
    title: "Lead Response",
    body: "An AI receptionist that answers in seconds, books meetings, and warm-transfers hot opportunities to you.",
  },
];

const reasons = [
  {
    title: "Plain-language positioning",
    copy: "Prospects get what you do in under a minute. That clarity lowers friction and shortens sales cycles.",
  },
  {
    title: "Tight ad → page match",
    copy: "Clicks land on a page that repeats the same promise, so costs drop and more leads convert.",
  },
  {
    title: "Always-on follow-up",
    copy: "After-hours and overflow calls are answered, booked, and summarized — without adding headcount.",
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
    desc: "Search + social campaigns that mirror the page and feed the same CTA.",
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
          <div className="inline-flex items-center gap-2 badge">Automated funnel, real conversations</div>
          <h1 id="about-title">Your growth team for booked calls on autopilot</h1>
          <p className="lead text-white/75">
            We combine design, media, and AI follow-up into one simple service. The result: more qualified calls, less time
            chasing leads, and a pipeline you can rely on.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link href="/contact" className="btn">Book a strategy call</Link>
            <Link href="/pricing" className="btn-ghost">See pricing</Link>
          </div>
          <p className="text-xs text-white/55">Start lean. Scale when the numbers work. No long-term contracts.</p>
        </header>

        <section aria-labelledby="pillar-title" className="space-y-4">
          <h2 id="pillar-title" className="text-center">What we deliver together</h2>
          <p className="text-center text-white/70 max-w-2xl mx-auto">
            Three pieces, one pipeline. We own the hand-off from click to conversation so you can stay focused on closing.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="radiant-card">
                <div className="card h-full p-5 space-y-3">
                  <Icon className="size-6 opacity-90" aria-hidden />
                  <h3 className="font-semibold text-white/95">{title}</h3>
                  <p className="text-sm text-white/70">{body}</p>
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
                <div className="card h-full p-5 space-y-2">
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
            {steps.map((step) => (
              <div key={step.title} className="radiant-card">
                <div className="card h-full p-5 space-y-2">
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{step.label}</span>
                    <span className="badge">Done for you</span>
                  </div>
                  <h3 className="font-semibold text-white/95">{step.title}</h3>
                  <p className="text-sm text-white/70">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="radiant-card">
          <div className="card p-6 text-center space-y-3">
            <h2 className="text-2xl font-bold text-white/95">We stay close to the numbers</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              Weekly check-ins keep the funnel sharp. We show what booked, what needs trimming, and what we are testing next —
              all in plain language.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/80">
              <span className="pill"><Sparkles className="size-4" aria-hidden /> Conversion-first updates</span>
              <span className="pill"><Search className="size-4" aria-hidden /> Spend focused on wins</span>
              <span className="pill"><PhoneCall className="size-4" aria-hidden /> Call summaries in your inbox</span>
            </div>
          </div>
        </section>

        <section className="text-center space-y-3">
          <p className="text-white/70">Ready to see the playbook for your business?</p>
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
          <p className="text-xs text-white/55">Zero pressure. Leave with clear next steps either way.</p>
        </section>
      </div>
    </main>
  );
}
