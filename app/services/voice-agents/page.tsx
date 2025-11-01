// app/services/voice-agents/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  PhoneIncoming,
  PhoneOutgoing,
  PhoneCall,
  CalendarCheck,
  Handshake,
  MousePointerClick,
  GaugeCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import ServicePill from "@/components/ServicePill";

export const metadata: Metadata = {
  title: "AI Voice Receptionists",
  description:
    "Answer inbound calls instantly and auto-callback new web leads. We qualify, book, and warm-transfer so you never miss revenue.",
};

const ring =
  "linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9), rgba(52,211,153,.85))";

export default function Page() {
  return (
    <main
      id="main"
      className="section relative overflow-hidden"
      role="main"
      aria-labelledby="svc-title"
    >
      {/* Ambient gradient (paint-only, no JS) */}
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
        <header className="space-y-3">
          <ServicePill />
          <h1 id="svc-title">AI Voice Receptionists</h1>
          <p className="lead max-w-3xl">
            <b>Never miss a lead.</b> We answer inbound calls instantly and{" "}
            <b>auto-call new website leads</b> within seconds. Every conversation
            gets qualified, <b>booked</b>, or <b>warm-transferred</b> to your team.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="btn">See pricing</Link>
            <Link href="/contact" className="btn-ghost">Book a call</Link>
          </div>

          {/* quick value chips */}
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
            <Chip icon={GaugeCircle}>Fast answer & follow-up</Chip>
            <Chip icon={CheckCircle2}>More bookings, fewer no-shows</Chip>
            <Chip icon={ShieldCheck}>Clear consent & opt-out built in</Chip>
          </ul>
        </header>

        {/* OUTCOMES */}
        <section aria-label="What you get" className="grid md:grid-cols-3 gap-4">
          <Outcome
            title="Instant response = more meetings"
            copy="Inbound calls get answered right away. New web leads get an automatic callback in seconds—before a competitor does."
          />
          <Outcome
            title="Fewer missed calls, lower CPL"
            copy="Protect the clicks your ads and SEO already paid for. More conversations turn into demos, quotes, and show-ups."
          />
          <Outcome
            title="Clean hand-off & reporting"
            copy="Notes, summaries, and calendar/CRM logging so your team has context and you can see what’s working."
          />
        </section>

        {/* TWO TRACKS: INBOUND + OUTBOUND */}
        <section aria-label="How it works" className="space-y-4">
          <h2 className="text-lg font-semibold">Two simple tracks</h2>

          {/* INBOUND TRACK */}
          <div className="relative overflow-hidden rounded-2xl p-[1px]" style={{ background: ring }}>
            <div className="rounded-2xl bg-black/75 border border-white/10 p-5">
              <header className="flex items-center gap-2 mb-2">
                <PhoneIncoming className="opacity-90" aria-hidden />
                <h3 className="font-semibold">Inbound calls — answered live</h3>
              </header>
              <div className="grid md:grid-cols-4 gap-3">
                <FlowBox
                  title="1) Answer"
                  bullets={[
                    "Greets in your brand voice",
                    "States purpose & consent",
                    "Captures name + reason",
                  ]}
                  accent="from-emerald-400/20 to-sky-400/10"
                />
                <FlowArrow />
                <FlowBox
                  title="2) Qualify"
                  bullets={[
                    "A few quick fit questions",
                    "Location/availability checks",
                    "Routes based on rules",
                  ]}
                  accent="from-sky-400/20 to-violet-400/10"
                />
                <FlowArrow />
                <FlowBox
                  title="3) Schedule"
                  bullets={[
                    "Offers slots & confirms details",
                    "Sends invite + summary",
                    "Logs in CRM with source",
                  ]}
                  accent="from-violet-400/20 to-fuchsia-400/10"
                />
                <FlowArrow />
                <FlowBox
                  title="4) Warm-transfer"
                  bullets={[
                    "Consults briefly with your rep",
                    "Bridges caller + rep live",
                    "Hands off with context",
                  ]}
                  accent="from-fuchsia-400/20 to-lime-400/10"
                />
              </div>
            </div>
          </div>

          {/* OUTBOUND TRACK */}
          <div className="relative overflow-hidden rounded-2xl p-[1px]" style={{ background: ring }}>
            <div className="rounded-2xl bg-black/75 border border-white/10 p-5">
              <header className="flex items-center gap-2 mb-2">
                <PhoneOutgoing className="opacity-90" aria-hidden />
                <h3 className="font-semibold">Outbound callbacks — triggered by your website</h3>
              </header>
              <p className="text-white/75 text-sm mb-3">
                When someone requests a call, submits a form, or abandons a booking,
                we automatically phone them back (with consent), ask a few friendly
                questions, and <b>book the meeting</b>—or hand off live if your team is available.
              </p>

              <div className="grid md:grid-cols-4 gap-3">
                <FlowBox
                  title="1) Trigger"
                  bullets={[
                    "Form submit / call-back request",
                    "Chat lead or missed call",
                    "Abandoned booking",
                  ]}
                  accent="from-lime-400/20 to-sky-400/10"
                />
                <FlowArrow />
                <FlowBox
                  title="2) Auto-call in seconds"
                  bullets={[
                    "Clear intro + consent reminder",
                    "‘Still a good time to chat?’",
                    "Captures quick context",
                  ]}
                  accent="from-sky-400/20 to-violet-400/10"
                />
                <FlowArrow />
                <FlowBox
                  title="3) Qualify & schedule"
                  bullets={[
                    "Basic fit questions",
                    "Offer times or instant link",
                    "Send invite + confirmation",
                  ]}
                  accent="from-violet-400/20 to-fuchsia-400/10"
                />
                <FlowArrow />
                <FlowBox
                  title="4) Warm-transfer (if hot)"
                  bullets={[
                    "Checks rep availability",
                    "Bridges instantly when possible",
                    "Leaves notes for follow-up",
                  ]}
                  accent="from-fuchsia-400/20 to-lime-400/10"
                />
              </div>

              <div className="mt-3 grid sm:grid-cols-3 gap-2 text-sm">
                <MiniCard icon={MousePointerClick} title="Website-aware">
                  Triggers from forms, chat, missed calls, or CTA clicks.
                </MiniCard>
                <MiniCard icon={CalendarCheck} title="Smart SLAs">
                  Retry windows, time-of-day rules, and max attempts.
                </MiniCard>
                <MiniCard icon={ShieldCheck} title="Consent first">
                  Clear opt-in/opt-out and reason for the call.
                </MiniCard>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-sm">
            Result: faster response, fewer drop-offs, and more meetings on your calendar.
          </p>
        </section>

        {/* DELIVERABLES */}
        <section aria-label="Deliverables" className="grid md:grid-cols-2 gap-4">
          <Card
            title="Included"
            items={[
              "Custom scripts & routing rules",
              "Warm-transfer to your team during open hours",
              "Cal.com (or your scheduler) for 24/7 bookings",
              "CRM & inbox logging with source tags",
              "Summaries and optional recordings (with consent)",
            ]}
          />
          <Card
            title="Options"
            items={[
              "Website triggers for outbound callbacks (forms, chat, missed calls, abandoned booking)",
              "SIP/WebRTC integration with your phone system",
              "Caller-ID reputation support (STIR/SHAKEN-aware providers)",
              "Multi-language voices & regional coverage",
            ]}
          />
        </section>

        {/* TRUST & COMPLIANCE (plain language) */}
        <section aria-label="Trust" className="grid lg:grid-cols-3 gap-4">
          <Trust
            title="Consent & opt-out"
            copy="We include clear consent language and easy opt-outs for marketing outreach. Revocation is honored promptly."
            note="We will align scripts to your policies; this is not legal advice."
          />
          <Trust
            title="Recording disclosures"
            copy="Rules vary by state. Where recording is enabled, we announce it when required and log acknowledgements."
            note="We’ll configure prompts per your location requirements."
          />
          <Trust
            title="Caller-ID trust"
            copy="We work with providers that support STIR/SHAKEN so legitimate calls are less likely to be flagged."
            note="Brand-safe labeling improves answer rates."
          />
        </section>

        {/* PRICING TEASER */}
        <section aria-label="Pricing" className="grid md:grid-cols-3 gap-4">
          <Price tier="Starter" price="from $99/mo" blurb="Essential answering + scheduling for a single line." />
          <Price tier="Growth" price="from $219/mo" blurb="Warm-transfers, CRM logging, and call reporting." />
          <Price tier="Scale" price="Custom" blurb="Multi-line, advanced compliance, call-labeling & QA." />
          <p className="text-xs text-white/50 md:col-span-3">
            Transparent per-minute usage applies. We’ll tailor a plan around your call volume and hours.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center space-y-3 relative">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-6 h-32 blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 50%, rgba(124,58,237,.35), rgba(96,165,250,.25) 60%, transparent)",
            }}
          />
          <p className="relative text-white/80 text-lg">
            Ready to answer every call and auto-callback new web leads?
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <Link href="/contact" className="btn inline-flex items-center gap-2">
              <CalendarCheck className="size-4" />
              Book a Strategy Call
            </Link>
            <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
              See friendly pricing
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* Gentle legal note */}
        <p className="text-xs text-white/40">
          We help operationalize best practices, but you should consult your counsel for jurisdiction-specific legal guidance.
        </p>
      </div>
    </main>
  );
}

/* -------------------- helpers (server-safe) -------------------- */

function Chip({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <li className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </li>
  );
}

function Outcome({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[1px]" style={{ background: ring }}>
      <article
        className="card h-full rounded-2xl bg-black/70 p-5"
        style={{
          backgroundImage:
            "radial-gradient(200% 120% at 120% -20%, rgba(255,255,255,.06), transparent 40%)",
        }}
      >
        <h3 className="font-semibold">{title}</h3>
        <p className="text-white/75 text-sm mt-1">{copy}</p>
        <div
          aria-hidden
          className="absolute left-0 right-0 bottom-0 h-px opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
          }}
        />
      </article>
    </div>
  );
}

function FlowBox({
  title,
  bullets,
  accent,
}: {
  title: string;
  bullets: string[];
  accent?: string;
}) {
  const bg = accent || "from-white/5 to-white/0";
  return (
    <article
      className={`card p-5 relative overflow-hidden bg-gradient-to-br ${bg}`}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,.03), transparent)",
      }}
    >
      <div className="font-semibold">{title}</div>
      <ul className="mt-2 text-sm text-white/75 space-y-1 list-disc list-inside">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </article>
  );
}

function FlowArrow() {
  return (
    <div className="hidden md:flex items-center justify-center">
      <div aria-hidden className="h-0.5 w-10 bg-white/30 relative">
        <span className="absolute -right-1 -top-1 rotate-45 block h-2 w-2 border-r border-t border-white/40" />
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 font-medium">
        <Icon className="size-4 opacity-90" />
        {title}
      </div>
      <div className="text-sm text-white/70 mt-1">{children}</div>
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="card p-6">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 text-sm text-white/75 space-y-2 list-disc list-inside">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </article>
  );
}

function Trust({ title, copy, note }: { title: string; copy: string; note?: string }) {
  return (
    <article className="card p-6">
      <div className="font-semibold">{title}</div>
      <p className="text-white/75 text-sm mt-1">{copy}</p>
      {note && <p className="text-xs text-white/55 mt-2">{note}</p>}
    </article>
  );
}

function Price({ tier, price, blurb }: { tier: string; price: string; blurb: string }) {
  return (
    <article className="card p-6">
      <div className="text-sm text-white/60">{tier}</div>
      <div className="text-3xl font-extrabold">{price}</div>
      <p className="text-white/75 text-sm mt-1">{blurb}</p>
    </article>
  );
}
