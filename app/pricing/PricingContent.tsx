"use client";

import MiniChart from "@/components/MiniChart";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarCheck, PhoneCall, Rocket, Search, ShieldCheck } from "lucide-react";

export type PricingTier = {
  name: string;
  headline: string;
  summary: string;
  deposit: string;
  depositNote: string;
  balance: string;
  balanceNote: string;
  ongoing: string;
  ongoingNote: string;
  total: string;
  bullets: string[];
  cta: string;
  trend: number[];
  color: "violet" | "sky" | "emerald";
  proof: string;
};

type PricingContentProps = {
  tiers: PricingTier[];
};

type PricingView = "deposit" | "balance" | "ongoing";

const viewOptions: { id: PricingView; label: string; helper: string }[] = [
  { id: "deposit", label: "Start for $99", helper: "Reserve your build slot" },
  { id: "balance", label: "Pay the build later", helper: "Only after launch approval" },
  { id: "ongoing", label: "Keep it growing", helper: "Light, flexible monthly care" },
];

const gradientStyles = {
  background:
    "radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.18), transparent 60%)," +
    "radial-gradient(1000px 500px at 100% 10%, rgba(96,165,250,.16), transparent 60%)," +
    "radial-gradient(800px 400px at 10% 95%, rgba(52,211,153,.14), transparent 60%)",
  WebkitMaskImage: "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
  maskImage: "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
} as const;

export default function PricingContent({ tiers }: PricingContentProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [view, setView] = useState<PricingView>("deposit");

  const activeTier = tiers[activeIndex];

  const highlight =
    view === "deposit" ? activeTier.deposit : view === "balance" ? activeTier.balance : activeTier.ongoing;
  const highlightNote =
    view === "deposit" ? activeTier.depositNote : view === "balance" ? activeTier.balanceNote : activeTier.ongoingNote;

  return (
    <main className="section relative overflow-hidden" aria-labelledby="pricing-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={gradientStyles} />

      <div className="container space-y-10">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 id="pricing-title">Kick off for $99 — scale into ads and AI once it’s working</h1>
          <p className="text-white/70">
            A single kickoff deposit secures your build. You approve every milestone before we invoice the rest, so you
            can prove ROI without stressing cash flow.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-white/80">
            <span className="pill">
              <Rocket className="size-4" aria-hidden /> Launch fast
            </span>
            <span className="pill">
              <Search className="size-4" aria-hidden /> Spend with intent
            </span>
            <span className="pill">
              <ShieldCheck className="size-4" aria-hidden /> Pay balance after approval
            </span>
            <span className="pill">
              <PhoneCall className="size-4" aria-hidden /> Answer every lead
            </span>
          </div>
        </header>

        <section className="radiant-card" aria-label="Interactive pricing tiers">
          <div className="card p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {viewOptions.map((option) => {
                const isActive = option.id === view;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setView(option.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
                      isActive
                        ? "border-white/80 bg-white text-slate-900 shadow-lg shadow-black/30"
                        : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold tracking-wide uppercase text-xs">{option.label}</span>
                      <span className="text-[11px] text-white/65" aria-hidden>
                        {option.helper}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{activeTier.name}</span>
                  <span className="badge">Done for you</span>
                </div>
                <div className="mt-4 space-y-3" aria-live="polite">
                  <div className="text-[13px] uppercase tracking-wide text-white/55">{activeTier.headline}</div>
                  <div className="text-4xl font-black text-white">{highlight}</div>
                  <div className="text-sm text-emerald-200/80">{highlightNote}</div>
                  <div className="text-xs text-white/50">{activeTier.total}</div>
                </div>

                <p className="mt-4 text-sm text-white/70 leading-relaxed">{activeTier.summary}</p>
                <p className="text-xs text-white/50">{activeTier.proof}</p>

                <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(140px,180px)] md:items-center">
                  <ul className="space-y-2 text-sm text-white/80">
                    {activeTier.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <MiniChart
                    values={activeTier.trend}
                    color={activeTier.color}
                    ariaLabel={`${activeTier.name} projected lead flow over the first 8 weeks`}
                    className="mx-auto"
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn inline-flex items-center gap-2">
                    {activeTier.cta}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link href="/contact" className="btn-ghost inline-flex items-center gap-2 text-white/80">
                    <CalendarCheck className="size-4" aria-hidden />
                    Book a consult
                  </Link>
                </div>
              </article>

              <aside className="space-y-3" aria-label="Select a tier to preview">
                {tiers.map((tier, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={tier.name}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
                        isActive
                          ? "border-white/60 bg-white/15 shadow-lg shadow-black/30"
                          : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/12"
                      }`}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-center justify-between text-[13px] text-white/65">
                        <span className="font-semibold text-white/85">{tier.name}</span>
                        <span>{tier.headline}</span>
                      </div>
                      <div className="mt-2 text-sm text-white/80">{tier.summary}</div>
                      <div className="mt-2 text-xs text-white/55">{tier.total}</div>
                    </button>
                  );
                })}
              </aside>
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] md:items-center">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-xl font-semibold text-white/95">What every engagement includes</h2>
              <p className="text-sm text-white/70">
                Conversion copy, speed optimizations, analytics setup, and weekly insight on what is booking calls. No
                surprise fees, no long-term commitments.
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-sm text-white/80 md:justify-start">
                <span className="pill">Calendar + form integration</span>
                <span className="pill">Transparent reporting</span>
                <span className="pill">Friendly support</span>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
              <div className="flex items-center justify-between text-white/60">
                <span>Onboarding timeline</span>
                <span className="badge">2 weeks</span>
              </div>
              <ol className="space-y-2 text-xs text-white/60">
                <li>
                  <strong className="text-white/80">Days 1-3:</strong> Kickoff, asset review, and copy outline.
                </li>
                <li>
                  <strong className="text-white/80">Days 4-7:</strong> Design & build the conversion flow.
                </li>
                <li>
                  <strong className="text-white/80">Days 8-14:</strong> Launch, QA, and campaign alignment.
                </li>
              </ol>
              <p className="text-xs text-white/55">We handle the heavy lifting — you just review and approve.</p>
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white/95">Two-step payment flow</h2>
            <p className="text-sm text-white/70 max-w-3xl">
              We only collect a $99 kickoff deposit to reserve your build slot. The remaining balance is invoiced once you’ve
              approved the launch and are thrilled with the results.
            </p>
            <ol className="grid gap-3 md:grid-cols-3 text-sm text-white/75">
              <li className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4">
                <div className="text-xs uppercase tracking-wide text-emerald-200">Step 1</div>
                <div className="mt-1 font-semibold text-white">Kickoff deposit</div>
                <p className="mt-1 text-emerald-100/80">
                  Secure your slot with $99 and complete onboarding so we can start copy, design, and automations immediately.
                </p>
              </li>
              <li className="rounded-2xl border border-sky-400/40 bg-sky-500/10 p-4">
                <div className="text-xs uppercase tracking-wide text-sky-200">Step 2</div>
                <div className="mt-1 font-semibold text-white">Build & review</div>
                <p className="mt-1 text-sky-100/80">
                  We share progress, implement feedback, and align everything from ads to AI receptionists.
                </p>
              </li>
              <li className="rounded-2xl border border-indigo-400/40 bg-indigo-500/10 p-4">
                <div className="text-xs uppercase tracking-wide text-indigo-200">Step 3</div>
                <div className="mt-1 font-semibold text-white">Approve & pay balance</div>
                <p className="mt-1 text-indigo-100/80">
                  Once you sign off on the launch, we issue the final invoice and push everything live.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-4 text-center">
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
            <p className="text-xs text-white/55">No pressure — just a clear roadmap to automate your funnel.</p>
          </div>
        </section>

        <div className="text-[11px] text-white/45 text-center">
          Setup fees cover strategy, copy, design, and launch. Monthly amounts flex with volume — we size them with you
          before work starts.
        </div>
      </div>
    </main>
  );
}
