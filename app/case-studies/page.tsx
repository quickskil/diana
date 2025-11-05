// app/case-studies/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "See how the automated funnel performs across industries — from local services to SaaS and eCommerce.",
};

type Study = {
  title: string;
  metric: string;
  context: string;
  outcome: string;
};

const studies: Study[] = [
  {
    title: "Local Services",
    metric: "Booked jobs 2.1×",
    context: "HVAC & roofing teams",
    outcome: "Neighborhood landing page + AI voice to handle overflow and after-hours calls added steady appointments each week.",
  },
  {
    title: "B2B SaaS",
    metric: "Demo requests +88%",
    context: "Growth-stage platform",
    outcome: "Role-based messaging, synchronized ads, and instant voice follow-up meant more pipeline without adding SDR headcount.",
  },
  {
    title: "DTC & eCom",
    metric: "ROAS 3.5 → 5.1",
    context: "Skincare & supplements",
    outcome:
      "Faster product experiences and creatives that mirrored the landing page increased conversion and let spend scale profitably.",
  },
];

const proofPoints = [
  {
    title: "One system",
    copy: "Website, ads, and voice follow-up are run together so learnings move fast and nothing falls through the cracks.",
  },
  {
    title: "Real-time response",
    copy: "AI calls, books, and summarizes in your tone. You start the morning with meetings on the calendar, not missed calls.",
  },
  {
    title: "Continuous optimization",
    copy: "Weekly reviews highlight the wins, the trims, and the next tests — always tied to revenue, not vanity metrics.",
  },
];

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="cs-title">
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

      <div className="container space-y-10">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 id="cs-title">Proof the automated funnel works</h1>
          <p className="text-white/70">
            A few snapshots from the industries we serve most. Each win combines a conversion-first page, intent-led traffic,
            and voice follow-up that never sleeps.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4" aria-label="Highlights by industry">
          {studies.map((study) => (
            <div key={study.title} className="radiant-card">
              <div className="card h-full p-5 space-y-3">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{study.context}</span>
                  <span className="badge">{study.metric}</span>
                </div>
                <h2 className="text-lg font-semibold text-white/95">{study.title}</h2>
                <p className="text-sm text-white/70">{study.outcome}</p>
                <Link href="/contact" className="text-xs font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:decoration-white">
                  Ask for the full playbook
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="grid md:grid-cols-3 gap-4" aria-label="Why results stick">
          {proofPoints.map((point) => (
            <div key={point.title} className="radiant-card">
              <div className="card h-full p-5 space-y-2">
                <h2 className="text-lg font-semibold text-white/95">{point.title}</h2>
                <p className="text-sm text-white/70">{point.copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-4 text-center">
            <h2 className="text-xl font-semibold text-white/95">Want the numbers for your niche?</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              We’ll share a tailored forecast, sample creative, and how we’d roll out the automated funnel step by step.
            </p>
            <div className="grid gap-4 md:grid-cols-3 text-left">
              <div className="rounded-lg border border-white/10 p-4">
                <h3 className="font-semibold text-white/90">15-minute discovery call</h3>
                <p className="text-sm text-white/70">
                  Align on your revenue goals, current funnel gaps, and what an automated follow-up engine could unlock.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 p-4">
                <h3 className="font-semibold text-white/90">Custom performance forecast</h3>
                <p className="text-sm text-white/70">
                  Receive a projected pipeline model, channel mix, and sample creatives tailored to your vertical.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 p-4">
                <h3 className="font-semibold text-white/90">Roadmap & next steps</h3>
                <p className="text-sm text-white/70">
                  Get a clear rollout plan, ownership expectations, and the KPIs we’ll monitor in the first 30 days.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/contact" className="btn">
                Book a call
              </Link>
              <Link href="/contact" className="btn-ghost">
                Schedule a walkthrough
              </Link>
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card p-6 md:p-10 grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white/95">Book your discovery call</h2>
              <p className="text-sm text-white/70">
                Spend 15 minutes exploring how the automated funnel would plug into your stack. We’ll review quick wins, traffic
                priorities, and what it takes to launch without disrupting current campaigns.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-white/70">
                <li>Audit your existing demand engine and identify the biggest conversion leaks.</li>
                <li>Outline how voice follow-up, nurture, and reporting adapt to your buyer journey.</li>
                <li>End with a documented next step so your team knows exactly how to move forward.</li>
              </ul>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-sm text-white/70">Ready for next steps?</p>
              <h3 className="text-xl font-semibold text-white/95">Lock in your discovery call</h3>
              <p className="text-sm text-white/70">
                Pick a time that works for you or ring us now — we’ll confirm details and send prep notes right away.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/contact" className="btn">
                  Schedule your call
                </Link>
                <Link href="tel:+12136810660" className="btn-ghost">
                  Call (555) 555-1234
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
