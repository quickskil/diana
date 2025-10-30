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
              <div className="card h-full p-5 space-y-2">
                <div className="text-sm text-white/60">{study.context}</div>
                <h2 className="text-lg font-semibold text-white/95">{study.title}</h2>
                <div className="text-3xl font-extrabold text-white/95">{study.metric}</div>
                <p className="text-sm text-white/70">{study.outcome}</p>
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
          <div className="card p-6 text-center space-y-3">
            <h2 className="text-xl font-semibold text-white/95">Want the numbers for your niche?</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              We’ll share a tailored forecast, sample creative, and how we’d roll out the automated funnel step by step.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/contact" className="btn">
                Book a call
              </Link>
              <Link href="/pricing" className="btn-ghost">
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
