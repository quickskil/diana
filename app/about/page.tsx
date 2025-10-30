// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket, Search, Megaphone, PhoneCall, MousePointerClick, // services
  CheckCircle2, Handshake, GaugeCircle, Sparkles, Users,   // principles
  CalendarCheck, ArrowRight                                // CTAs
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "We help businesses turn more visitors into booked calls with websites, ads, and AI voice that never misses a lead.",
};

export default function Page() {
  return (
    <main
      id="main"
      className="section relative overflow-hidden"
      role="main"
      aria-labelledby="about-title"
    >
      {/* Ambient gradient (pure CSS, no JS) */}
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

      <div className="container space-y-14">
        {/* HERO */}
        <header className="space-y-5 text-center">
          <div className="inline-flex items-center gap-2 badge">
            Friendly • No-pressure • Built to grow
          </div>
          <h1 id="about-title">We help you book more business — automatically</h1>
          <p className="lead max-w-3xl mx-auto">
            We blend <b>conversion-focused websites</b>, <b>Google & Meta ads</b>, and an
            <b> AI voice receptionist</b> that answers instantly. Result: more qualified
            inquiries turn into <b>booked calls</b>, even after hours.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/case-studies" className="btn-ghost">See real outcomes</Link>
            <Link href="/contact" className="btn">Book a Strategy Call</Link>
          </div>
          <p className="text-xs text-white/50">
            Start small. Scale when it pays. No long-term contracts.
          </p>
        </header>

        {/* WHAT WE MAKE (client-friendly, outcome-first) */}
        <section aria-label="What we make" className="space-y-4">
          <h2 className="text-center">What we make for you</h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto">
            Simple, effective pieces that work together. You can start with one, or
            run the full system for compounding results.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard
              icon={Rocket}
              title="Website that sells"
              points={[
                "Fast, clean, easy to trust",
                "Clear offer + proof up top",
                "One-click booking or short form",
              ]}
              cta={{ label: "See Websites", href: "/services/websites" }}
            />
            <ServiceCard
              icon={Search}
              title="Google Ads"
              points={[
                "Show up when they’re searching",
                "Send clicks to the right page",
                "Lower cost as relevance improves",
              ]}
              cta={{ label: "See Google Ads", href: "/services/google-ads" }}
            />
            <ServiceCard
              icon={Megaphone}
              title="Meta Ads"
              points={[
                "Thumb-stop creative that explains fast",
                "Short hooks, clear value, strong proof",
                "Keep winners fresh, retire losers",
              ]}
              cta={{ label: "See Meta Ads", href: "/services/meta-ads" }}
            />
            <ServiceCard
              icon={PhoneCall}
              title="AI Voice Receptionist"
              points={[
                "Answers 24/7 in your brand voice",
                "Qualifies + books meetings",
                "Warm-transfers hot leads to your team",
              ]}
              cta={{ label: "See Voice", href: "/services/voice-agents" }}
            />
          </div>
        </section>

        {/* HOW IT WORKS (plain language, no jargon) */}
        <section aria-label="How it works">
          <div className="card p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Step
                k="01"
                title="Launch the converter"
                copy="We ship a focused page that’s quick to load and easy to book. Your best offer, proof above the fold, and a clear next step."
              />
              <Step
                k="02"
                title="Turn on demand"
                copy="We run Google & Meta so the right people find you. As results come in, we double down on what works and cut what doesn’t."
              />
              <Step
                k="03"
                title="Answer instantly"
                copy="Our AI receptionist picks up every call, books meetings, or warm-transfers to your team. No more missed opportunities."
              />
            </div>
          </div>
        </section>

        {/* WHY THIS WORKS (micro-proof, human terms) */}
        <section aria-label="Why this works" className="grid lg:grid-cols-3 gap-4">
          <MiniProof
            icon={GaugeCircle}
            title="Fast pages win more"
            copy="When pages feel instant, more visitors stick around and convert. We prioritize quick first impressions and a smooth path to book."
          />
          <MiniProof
            icon={MousePointerClick}
            title="Right message, right page"
            copy="Ads and pages say the same thing — so clicks are less wasted and your costs drop over time."
          />
          <MiniProof
            icon={Users}
            title="Respond first, win first"
            copy="Answering quickly turns interest into conversations. The voice agent does it even when you’re closed."
          />
        </section>

        {/* PRINCIPLES (sets the tone) */}
        <section aria-label="Principles" className="grid md:grid-cols-4 gap-4">
          <Principle icon={Handshake} title="No pressure" body="Friendly chat. Clear plan. If we’re not a fit, you still leave with next steps." />
          <Principle icon={CheckCircle2} title="Simple pricing" body="Start small, add only what pays for itself. No long-term contracts." />
          <Principle icon={Sparkles} title="Focus on the needle" body="We optimize for booked calls and revenue-leading signals, not vanity metrics." />
          <Principle icon={CalendarCheck} title="Built to iterate" body="We make steady weekly improvements so results compound." />
        </section>

        {/* SOCIAL PROOF LITE */}
        <section aria-label="Client outcomes" className="grid md:grid-cols-3 gap-4">
          <OutcomeCard metric="ROAS 3.2 → 5.0" label="DTC composite" desc="Clearer value in ads + faster product page reduced drop-off." />
          <OutcomeCard metric="Demos +92%" label="SaaS composite" desc="Search intent captured; pricing page made easier to understand." />
          <OutcomeCard metric="Answer rate +40%" label="Local services composite" desc="Voice agent booked after-hours; warm transfers during open hours." />
        </section>

        {/* BIG CTA STRIP */}
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
            Want a plan that pays for itself fast?
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <Link href="/contact" className="btn inline-flex items-center gap-2">
              <CalendarCheck className="size-4" />
              Book a Strategy Call
            </Link>
            <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
              <ArrowRight className="size-4" />
              See friendly pricing
            </Link>
          </div>
          <p className="relative text-xs text-white/55">
            Zero pressure. If we’re not a fit, you’ll still leave with a clear plan.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ---------- presentational helpers (server-safe) ---------- */

function ServiceCard({
  icon: Icon,
  title,
  points,
  cta,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  points: string[];
  cta: { label: string; href: string };
}) {
  return (
    <article
      className="card p-6 relative overflow-hidden rounded-2xl"
      style={{
        backgroundImage:
          "radial-gradient(200% 120% at 120% -20%, rgba(255,255,255,.06), transparent 40%)",
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className="size-5 opacity-90 mt-0.5" aria-hidden />
        <div className="w-full">
          <h3 className="font-semibold">{title}</h3>
          <ul className="mt-2 text-sm text-white/70 space-y-1 list-disc list-inside">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div className="mt-4">
            <Link href={cta.href} className="btn-ghost">{cta.label}</Link>
          </div>
        </div>
      </div>

      {/* bottom shimmer line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 bottom-0 h-px opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
        }}
      />
    </article>
  );
}

function Step({ k, title, copy }: { k: string; title: string; copy: string }) {
  return (
    <div className="relative">
      <div className="text-white/40 text-sm">{k}</div>
      <div className="font-semibold">{title}</div>
      <p className="text-white/70 text-sm mt-1">{copy}</p>
    </div>
  );
}

function MiniProof({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  copy: string;
}) {
  return (
    <article className="card p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 opacity-85" aria-hidden />
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-white/70 text-sm mt-2">{copy}</p>
    </article>
  );
}

function Principle({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
}) {
  return (
    <article className="card p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 opacity-85" aria-hidden />
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-white/70 text-sm mt-2">{body}</p>
    </article>
  );
}

function OutcomeCard({
  metric,
  label,
  desc,
}: {
  metric: string;
  label: string;
  desc: string;
}) {
  return (
    <article className="card p-5">
      <div className="text-3xl font-extrabold tracking-tight">{metric}</div>
      <div className="text-white/60">{label}</div>
      <p className="text-white/70 text-sm mt-1">{desc}</p>
    </article>
  );
}
