// app/voice-demo/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import RequestCallbackButton from "@/components/RequestCallbackButton"; // client component

export const metadata: Metadata = {
  title: "Live Voice Demo",
  description:
    "Call our AI receptionist or request a callback to hear how it greets, qualifies, and books—24/7.",
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
  const DEMO_NUMBER = process.env.NEXT_PUBLIC_DEMO_NUMBER || "+1 (555) 010-0000";
  const RETELL_PUBLIC_KEY = process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY || "";
  const RETELL_VOICE_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_VOICE_AGENT_ID || "";
  const RETELL_PHONE_NUMBER = process.env.NEXT_PUBLIC_RETELL_PHONE_NUMBER || ""; // +15551234567
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY || "";

  const hasWidgetCreds =
    Boolean(RETELL_PUBLIC_KEY) &&
    Boolean(RETELL_VOICE_AGENT_ID) &&
    Boolean(RETELL_PHONE_NUMBER);

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

      <div className="container space-y-12">
        {/* HERO */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2">
            <ValueChip>Live Demo</ValueChip>
            <ValueChip>Real AI Receptionist</ValueChip>
            <ValueChip>Warm-Transfers & Bookings</ValueChip>
          </div>

          <h1 id="voice-title">Talk to our AI receptionist</h1>

          <p className="lead max-w-3xl mx-auto text-white/80">
            This is the same agent we use to answer new inquiries for {BRAND}. It{" "}
            <b>greets</b>, asks a <b>few quick questions</b>, then <b>books a time</b> or{" "}
            <b>warm-transfers</b> to a human when it’s a good fit.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={telHref}
              className="btn h-12 px-6 rounded-xl"
              aria-label={`Call the demo receptionist now at ${DEMO_NUMBER}`}
            >
              📞 Call now: {DEMO_NUMBER}
            </a>

            {hasWidgetCreds ? (
              <RequestCallbackButton label="☎️ Request a callback" />
            ) : (
              <button
                type="button"
                className="btn-ghost h-12 px-6 rounded-xl opacity-60 cursor-not-allowed"
                title="Callback widget unavailable: missing RETELL env keys"
                aria-disabled="true"
              >
                ☎️ Request a callback
              </button>
            )}
          </div>

          <p className="text-xs text-white/60">
            Carrier rates may apply. For quality and training, calls may be recorded with consent.
          </p>

          {/* Dev-only hint when widget creds missing */}
          {!hasWidgetCreds && process.env.NODE_ENV !== "production" && (
            <p className="mt-1 text-[11px] text-amber-300/85">
              Set <code>NEXT_PUBLIC_RETELL_PUBLIC_KEY</code>,{" "}
              <code>NEXT_PUBLIC_RETELL_VOICE_AGENT_ID</code>,{" "}
              <code>NEXT_PUBLIC_RETELL_PHONE_NUMBER</code> to enable the callback widget.
            </p>
          )}
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

      {/* Retell Website Callback Widget (safe: no function props) */}
      {hasWidgetCreds && (
        <>
          {RECAPTCHA_SITE_KEY ? (
            <Script
              id="recaptcha-v3"
              src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
              strategy="afterInteractive"
              crossOrigin="anonymous"
            />
          ) : null}

          <Script
            id="retell-widget"
            src="https://dashboard.retellai.com/retell-widget.js"
            type="module"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            data-public-key={RETELL_PUBLIC_KEY}
            data-agent-id={RETELL_VOICE_AGENT_ID}
            data-widget="callback"
            data-phone-number={RETELL_PHONE_NUMBER}
            data-title="Request a Call"
            data-countries="US,CA,GB"
            data-color="#7C3AED"
            {...(RECAPTCHA_SITE_KEY ? { "data-recaptcha-key": RECAPTCHA_SITE_KEY } as any : {})}
          />
        </>
      )}
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
