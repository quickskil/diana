// app/voice-demo/page.tsx
import MiniChart from "@/components/MiniChart";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Live Voice Demo",
  description:
    "Dial +1 (213) 681-0660 to hear Business Booster AI’s receptionist qualify leads, book meetings, and hand off priority callers.",
};

function cleanTel(n: string) {
  return n.replace(/[^\d+]/g, "");
}

/** Small, reusable chip (mirrors Pricing vibe) */
function ValueChip({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85">
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </span>
  );
}

export default function VoiceDemoPage() {
  const BRAND = "Business Booster AI";
  const DEMO_NUMBER = "+1 (213) 681-0660";
  const telHref = `tel:${cleanTel(DEMO_NUMBER)}`;

  return (
    <main id="main" className="section relative overflow-hidden" role="main" aria-labelledby="voice-title">
      {/* Ambient gradient (brand hues) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 0% 0%, rgba(124,58,237,.18), transparent 60%)," +
            "radial-gradient(1000px 500px at 100% 10%, rgba(96,165,250,.16), transparent 60%)," +
            "radial-gradient(800px 400px at 10% 95%, rgba(52,211,153,.14), transparent 60%)",
          WebkitMaskImage:
            "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
          maskImage:
            "radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)",
        }}
      />

      <div className="container space-y-16">
        {/* HERO */}
        <header className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <ValueChip>Live demo</ValueChip>
              <ValueChip>5-star voice</ValueChip>
              <ValueChip>Answers 24/7</ValueChip>
            </div>

            <div className="space-y-3">
              <h1 id="voice-title" className="text-balance">
                Meet the AI receptionist that sounds on-brand
              </h1>
              <p className="lead text-white/80">
                Call to hear how {BRAND} greets new leads, qualifies them in seconds,
                and books meetings without ever missing a call.
              </p>
            </div>

            <ul className="grid gap-3 text-left text-sm text-white/70 md:grid-cols-2">
              <li className="flex items-start gap-2 rounded-xl bg-white/5 p-3 backdrop-blur">
                <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                  ✓
                </span>
                <span>
                  Instantly introduces your brand, captures intent, and follows a
                  proven qualifying flow.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-white/5 p-3 backdrop-blur">
                <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-sky-400/20 text-sky-300">
                  ✓
                </span>
                <span>
                  Warm-transfers priority callers to your team and books everyone else
                  straight onto your calendar.
                </span>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-white/5 p-3 backdrop-blur md:col-span-2">
                <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-violet-400/20 text-violet-300">
                  ✓
                </span>
                <span>
                  Real transcripts and summaries drop into your CRM and Slack so every
                  morning starts with ready-to-close leads.
                </span>
              </li>
            </ul>
          </div>

          <aside className="relative">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-violet-500/50 via-sky-400/40 to-emerald-400/40 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
                <span>Live voice agent</span>
                <span>{BRAND}</span>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-sm text-white/70">Direct line to our AI receptionist</p>
                <p className="text-3xl font-semibold text-white sm:text-4xl">{DEMO_NUMBER}</p>
              </div>

              <a
                href={telHref}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400 px-6 py-4 text-base font-semibold text-black shadow-lg shadow-violet-500/30 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/80"
                aria-label={`Call the demo receptionist now at ${DEMO_NUMBER}`}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-black/20 text-lg">📞</span>
                Call now
                <span aria-hidden className="text-sm font-medium text-black/70">
                  (Tap to launch dialer)
                </span>
              </a>

              <div className="mt-8 grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-white/70">
                <CallMetric label="Avg. handle" value="2m 18s" accent="violet" />
                <CallMetric label="First-call answer" value="100%" accent="sky" />
                <CallMetric label="Bookings captured" value="92%" accent="emerald" />
              </div>

              <p className="mt-6 text-center text-xs text-white/60">
                Calls may be recorded with consent. Carrier rates apply.
              </p>
            </div>
          </aside>
        </header>

        {/* WHAT TO TRY (cards styled like Pricing) */}
        <section aria-label="What to try" className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            title="Booking"
            copy="Ask for a time next week. The agent will offer slots and confirm the meeting."
          />
          <FeatureCard
            title="Warm transfer"
            copy="Say you’d like to speak to a specialist now. During open hours it will try to connect you."
          />
          <FeatureCard
            title="Qualifying"
            copy="Describe your need. It asks a few short questions and summarizes for the team."
          />
        </section>

        {/* HOW IT WORKS */}
        <section aria-label="How it works" className="grid lg:grid-cols-3 gap-4">
          <InfoCard title="Answers instantly" copy="No voicemail or phone tag. Every inquiry gets a friendly, on-brand response." />
          <InfoCard title="Books 24/7" copy="After hours it schedules directly to your calendar so mornings start with meetings." />
          <InfoCard title="Hands off with context" copy="When it’s urgent, it bridges the call to your team and shares the notes." />
        </section>

        {/* SOCIAL PROOF / MINI FAQ (optional clarity like Pricing language) */}
        <section className="grid md:grid-cols-3 gap-3">
          <MiniAnswer
            q="Do I need a special phone line?"
            a="No — we can connect to your existing number or provide an AI line and forward to your team as needed."
          />
          <MiniAnswer
            q="What if someone calls after hours?"
            a="The agent answers, qualifies, and books a slot on your calendar. Urgent calls can request a callback."
          />
          <MiniAnswer
            q="Can it hand off to a human?"
            a="Yes. During open hours it warm-transfers to your team and shares the notes so you start in sync."
          />
        </section>

        {/* Secondary CTA */}
        <section className="text-center space-y-3 relative">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-6 h-32 blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 50%, rgba(124,58,237,.35), rgba(96,165,250,.25) 60%, transparent)",
            }}
          />
          <p className="relative text-white/85 text-lg">
            Want this on your site and phone line?
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <Link
              href="/contact"
              className="btn inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Book a Strategy Call"
            >
              Book a Strategy Call
            </Link>
            <Link
              href="/pricing"
              className="btn-ghost inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label="See pricing"
            >
              See friendly pricing
            </Link>
          </div>
        </section>
      </div>

    </main>
  );
}

/* ---------- presentational helpers (Pricing-style cards) ---------- */

function FeatureCard({ title, copy }: { title: string; copy: string }) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-200 will-change-transform focus-within:scale-[1.01] hover:scale-[1.01]"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,.55), rgba(96,165,250,.45), rgba(52,211,153,.45))",
      }}
    >
      <div className="card h-full rounded-2xl bg-black/70 p-6">
        <div className="font-semibold">{title}</div>
        <p className="text-white/75 text-sm mt-1">
          {copy}
        </p>
        <div
          aria-hidden
          className="absolute left-0 right-0 bottom-0 h-px opacity-40"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)" }}
        />
      </div>
    </article>
  );
}

function InfoCard({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="card p-5 transition-colors hover:bg-white/[0.06]">
      <div className="font-semibold">{title}</div>
      <p className="text-sm text-white/75 mt-1">{copy}</p>
    </article>
  );
}

function MiniAnswer({ q, a }: { q: string; a: string }) {
  return (
    <article className="card p-4">
      <div className="font-medium mb-1">{q}</div>
      <p className="text-sm text-white/75">{a}</p>
    </article>
  );
}

function CallMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "violet" | "sky" | "emerald";
}) {
  const gradientClass =
    accent === "violet"
      ? "from-violet-400/40 to-fuchsia-400/40"
      : accent === "sky"
        ? "from-sky-400/40 to-cyan-400/40"
        : "from-emerald-400/40 to-lime-400/40";

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
      <span
        aria-hidden
        className={`inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br p-[1px] ${gradientClass}`}
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-black/80 text-sm font-semibold text-white/80">
          ★
        </span>
      </span>
    </div>
  );
}
