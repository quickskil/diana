// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, PhoneCall, Rocket, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans for an automated funnel — start lean, add pieces as you grow.",
};

type Tier = {
  name: string;
  headline: string;
  price: string;
  caption: string;
  bullets: string[];
  cta: string;
};

const tiers: Tier[] = [
  {
    name: "Launch",
    headline: "Conversion website",
    price: "$499 setup",
    caption: "Hosting & care $25/mo",
    bullets: [
      "One-page funnel with booking",
      "Story, proof, and offer aligned",
      "Ready to grow into more pages",
    ],
    cta: "Start with the site",
  },
  {
    name: "Launch + Traffic",
    headline: "Site + ads",
    price: "$1,500 setup",
    caption: "Management 10% of ad spend",
    bullets: [
      "Search + social campaigns",
      "Message match from ad to page",
      "Weekly trims & reporting",
    ],
    cta: "Add traffic",
  },
  {
    name: "Full Funnel Automation",
    headline: "Site + ads + voice",
    price: "$2,900 setup",
    caption: "Voice from $99/mo",
    bullets: [
      "Everything in Launch + Traffic",
      "AI receptionist answers instantly",
      "Warm transfers & after-hours booking",
    ],
    cta: "Go fully automated",
  },
];

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="pricing-title">
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
          <h1 id="pricing-title">Pricing made for momentum</h1>
          <p className="text-white/70">
            Start with the minimum that proves ROI. Layer in ads and AI follow-up once the site is converting. Everything stays
            in sync because we run the entire funnel for you.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/80">
            <span className="pill"><Rocket className="size-4" aria-hidden /> Launch fast</span>
            <span className="pill"><Search className="size-4" aria-hidden /> Spend with intent</span>
            <span className="pill"><PhoneCall className="size-4" aria-hidden /> Answer every lead</span>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-4" aria-label="Pricing tiers">
          {tiers.map((tier) => (
            <div key={tier.name} className="radiant-card">
              <div className="card h-full p-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{tier.name}</span>
                  <span className="badge">Done for you</span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white/90">{tier.headline}</div>
                  <div className="text-3xl font-extrabold text-white/95">{tier.price}</div>
                  <div className="text-xs text-white/55">{tier.caption}</div>
                </div>
                <ul className="text-sm text-white/75 space-y-2">
                  {tier.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link href="/contact" className="btn inline-flex items-center gap-2">
                  {tier.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-3 text-center">
            <h2 className="text-xl font-semibold text-white/95">What every plan includes</h2>
            <p className="text-sm text-white/70">
              Conversion copy, speed optimizations, analytics setup, and weekly insight on what is booking calls. No surprise
              fees, no long-term commitments.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-sm text-white/80">
              <span className="pill">Calendar + form integration</span>
              <span className="pill">Transparent reporting</span>
              <span className="pill">Friendly support</span>
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-3 text-center">
            <h2 className="text-xl font-semibold text-white/95">Need a tailored quote?</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              We scope to your sales cycle, creative needs, and call volume. You’ll leave with a clear roadmap and the exact
              investment to make it happen.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/contact" className="btn inline-flex items-center gap-2">
                <PhoneCall className="size-4" aria-hidden />
                Talk with us
              </Link>
              <Link href="/contact" className="btn-ghost inline-flex items-center gap-2">
                <CalendarCheck className="size-4" aria-hidden />
                Book a time
              </Link>
            </div>
            <p className="text-xs text-white/55">No pressure — just a clear plan to automate your funnel.</p>
          </div>
        </section>

        <div className="text-[11px] text-white/45 text-center">
          Setup fees cover strategy, copy, design, and launch. Monthly amounts flex with volume — we size them with you before
          work starts.
        </div>
      </div>
    </main>
  );
}
