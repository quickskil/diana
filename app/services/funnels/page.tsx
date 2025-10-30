// app/services/funnels/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  Search,
  Megaphone,
  MousePointerClick,
  PhoneCall,
  CalendarCheck,
  Handshake,
  ArrowRight,
  GaugeCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import ServicePill from "@/components/ServicePill";

export const metadata: Metadata = {
  title: "Funnels",
  description:
    "Simple system: ads bring the right people, a fast page makes it easy to book, and an AI receptionist answers instantly so you never miss a lead.",
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
      {/* Ambient gradient (paint only, LCP-friendly) */}
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
          <h1 id="svc-title" className="leading-tight">
            Funnels that turn clicks into <span className="text-brand">booked calls</span>
          </h1>
          <p className="lead max-w-3xl">
            We keep it simple: <b>ads</b> bring the right people, a <b>fast page</b> makes
            it easy to book, and an <b>AI receptionist</b> answers instantly so you never
            miss a lead — day or night.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="btn">See pricing</Link>
            <Link href="/contact" className="btn-ghost">Book a call</Link>
          </div>

          {/* quick value chips */}
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
            <Chip icon={GaugeCircle}>Fast load = more calls</Chip>
            <Chip icon={Sparkles}>Clear offer, simple next step</Chip>
            <Chip icon={CheckCircle2}>24/7 answer + scheduling</Chip>
          </ul>
        </header>

        {/* PLAIN-ENGLISH FUNNEL */}
        <section aria-label="The simple funnel" className="space-y-4">
          <h2 className="text-white/95 font-semibold">How the system works</h2>

          <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-3">
            <Stage
              icon={Search}
              title="Ads find the right people"
              bullets={[
                "Google: show up when they’re looking",
                "Meta: reach likely buyers and stay top-of-mind",
              ]}
              accent="from-lime-400/20 to-sky-400/10"
            />
            <StageArrow />

            <Stage
              icon={MousePointerClick}
              title="Fast page makes it easy"
              bullets={[
                "Value up top with proof",
                "Book a call or short form — one scroll",
              ]}
              accent="from-sky-400/20 to-violet-400/10"
            />
            <StageArrow />

            <Stage
              icon={PhoneCall}
              title="AI answers instantly"
              bullets={[
                "Qualifies new callers 24/7",
                "Books meetings or gathers details",
              ]}
              accent="from-violet-400/20 to-fuchsia-400/10"
            />
            <StageArrow />

            <Stage
              icon={Handshake}
              title="Warm transfer when hot"
              bullets={[
                "During open hours we bridge live",
                "After hours we schedule for you",
              ]}
              accent="from-fuchsia-400/20 to-lime-400/10"
            />
          </div>

          <p className="text-white/60 text-sm">
            Result: quick response, less friction, and more conversations that turn into customers.
          </p>
        </section>

        {/* OUTCOMES */}
        <section aria-label="What you get" className="grid md:grid-cols-3 gap-4">
          <Outcome
            title="More qualified leads"
            copy="Clear message and a short path to “Book a Call” so good visitors don’t fall through the cracks."
          />
          <Outcome
            title="Lower costs over time"
            copy="Tighter ad-to-page match and faster load keep bounce low and make each click work harder."
          />
          <Outcome
            title="Always-on response"
            copy="AI receptionist answers immediately, schedules meetings, or warm-transfers to your team."
          />
        </section>

        {/* WHAT'S INCLUDED / OPTIONS */}
        <section aria-label="Deliverables" className="grid md:grid-cols-2 gap-4">
          <Card title="Included" items={[
            "Landing page with hero, proof, and clear CTA",
            "Inline calendar or short mobile-first form",
            "Speed pass (quick first paint, stable layout)",
            "Clean goals: leads, calls, bookings",
            "Weekly review and simple action plan",
          ]} />
          <Card title="Options" items={[
            "A/B tests: offer, headline, proof placement",
            "Retargeting flows and post-submit upsells",
            "AI voice receptionist (answer, qualify, book, route)",
            "CRM routing, source tags, and call summaries",
          ]} />
        </section>

        {/* QUICK PLAN */}
        <section aria-label="Quick plan" className="card p-6 space-y-3">
          <h2 className="font-semibold">Your first 3 weeks</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Plan k="Week 1" title="Launch the converter" copy="Focus page live. Proof in place. Booking/form working. Tracking verified." />
            <Plan k="Week 2" title="Remove friction" copy="Cut fields, clarify offer, surface proof sooner. Real-device speed checks." />
            <Plan k="Week 3+" title="Add fuel" copy="Turn on/scale ads, keep fresh creative, and feed learnings back into the page." />
          </div>
          <p className="text-xs text-white/55">
            We measure success by <b>booked calls</b> and qualified leads — not vanity clicks.
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
            Want a funnel that answers instantly and books more calls?
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
      </div>
    </main>
  );
}

/* ----------------------- helpers (server-safe) ----------------------- */

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

function Stage({
  icon: Icon,
  title,
  bullets,
  accent,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  bullets: string[];
  accent: string;
}) {
  return (
    <div className="rounded-2xl p-[1px]" style={{ background: ring }}>
      <article
        className={`card rounded-2xl bg-black/75 border border-white/10 p-5 bg-gradient-to-br ${accent}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon className="opacity-90" aria-hidden />
          <div className="font-semibold">{title}</div>
        </div>
        <ul className="text-sm text-white/75 space-y-1 list-disc list-inside">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function StageArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <div aria-hidden className="h-0.5 w-10 bg-white/30 relative">
        <span className="absolute -right-1 -top-1 rotate-45 block h-2 w-2 border-r border-t border-white/40" />
      </div>
    </div>
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

function Plan({ k, title, copy }: { k: string; title: string; copy: string }) {
  return (
    <div className="relative">
      <div className="text-white/40 text-sm">{k}</div>
      <div className="font-semibold">{title}</div>
      <p className="text-white/75 text-sm mt-1">{copy}</p>
    </div>
  );
}
