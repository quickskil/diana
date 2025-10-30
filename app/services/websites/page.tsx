// app/services/websites/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  MousePointerClick,
  BadgeCheck,
  GaugeCircle,
  Users,
  CheckCircle2,
  CalendarCheck,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Search,
  Megaphone,
  Headphones,
} from "lucide-react";
import ServicePill from "@/components/ServicePill";

export const metadata: Metadata = {
  title: "Websites that convert",
  description:
    "Fast, trustworthy pages that turn clicks into booked calls — connected to your ads and AI voice receptionist.",
};

export default function Page() {
  const ring =
    "linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9), rgba(52,211,153,.85))";

  return (
    <main
      id="main"
      className="section relative overflow-hidden"
      role="main"
      aria-labelledby="svc-title"
    >
      {/* Ambient mesh + tasteful top bar */}
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
        {/* Top “Service” pill with gradient ring */}
        <ServicePill />

        {/* Hero */}
        <header className="space-y-4">
          <h1 id="svc-title">Websites that convert</h1>
          <p className="lead max-w-3xl">
            We build clean, fast pages that make it easy to{" "}
            <b>book a call</b>. Then we add traffic from{" "}
            <b>Google</b> & <b>Meta</b> and connect an{" "}
            <b>AI voice receptionist</b> — so you never miss a lead, day or
            night.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/pricing" className="btn inline-flex items-center gap-2">
              <BadgeCheck className="size-4" />
              See pricing
            </Link>
            <Link
              href="/contact"
              className="btn-ghost inline-flex items-center gap-2"
            >
              <CalendarCheck className="size-4" />
              Book a call
            </Link>
          </div>
        </header>

        {/* Outcomes (ValueBar-style shells) */}
        <section aria-label="What you get" className="grid md:grid-cols-3 gap-4">
          <ValueCard title="More qualified leads" ring={ring}>
            <FeatureRow
              icon={MousePointerClick}
              text="Clear offers and a low-friction booking flow."
            />
            <FeatureRow
              icon={Users}
              text="Proof and FAQs that remove doubts and drive action."
            />
            <FeatureRow
              icon={CheckCircle2}
              text="Built to guide visitors toward “Book a Call.”"
            />
          </ValueCard>

          <ValueCard title="Faster experience" ring={ring}>
            <FeatureRow
              icon={GaugeCircle}
              text="Quick first impression on phones and desktop."
            />
            <FeatureRow
              icon={Sparkles}
              text="Stable layout and smooth scrolling — no jank."
            />
            <FeatureRow
              icon={BadgeCheck}
              text="Ad landing experience improves, CPC trends down."
            />
          </ValueCard>

          <ValueCard title="Ready to scale" ring={ring}>
            <FeatureRow
              icon={Search}
              text="Search & PMAX pages mapped to keyword themes."
            />
            <FeatureRow
              icon={Megaphone}
              text="Meta creative testing with tight offer–page match."
            />
            <FeatureRow
              icon={Headphones}
              text="AI receptionist answers, books, and warm-transfers."
            />
          </ValueCard>
        </section>

        {/* Deliverables */}
        <section aria-label="Deliverables" className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h2 className="font-semibold">Included</h2>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={MousePointerClick}>
                Conversion-focused landing pages (hero, proof, CTA density)
              </Li>
              <Li icon={GaugeCircle}>
                Speed & UX pass (quick LCP, stable layout, responsive)
              </Li>
              <Li icon={CalendarCheck}>
                Booking flow — inline calendar or lead form with alerts
              </Li>
              <Li icon={BadgeCheck}>
                Analytics + server-side tagging (where supported)
              </Li>
              <Li icon={Sparkles}>
                Copy polish and trust imagery for clarity & credibility
              </Li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Options</h2>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={MousePointerClick}>
                Extra pages (Services, Proof, FAQ, Locations)
              </Li>
              <Li icon={Sparkles}>
                Split-tests for offers, headlines, and sections
              </Li>
              <Li icon={Megaphone}>
                Coordinated Google + Meta Ads, remarketing, YouTube
              </Li>
              <Li icon={Headphones}>
                AI voice receptionist (answers 24/7, books, warm-transfers)
              </Li>
              <Li icon={PhoneCall}>
                CRM/calendar integrations & call notes
              </Li>
            </ul>
          </div>
        </section>

        {/* Why it works (proof band) */}
        <section aria-label="Why this works" className="grid lg:grid-cols-3 gap-4">
          <MiniCard title="Speed → conversion" ring={ring}>
            Sites that feel fast keep more visitors and convert more. We aim for
            a quick LCP for most users (p75).
          </MiniCard>
          <MiniCard title="Relevance lowers costs" ring={ring}>
            Tight ad-to-page match improves Quality Score and can reduce CPC.
            Better relevance compounds ROAS.
          </MiniCard>
          <MiniCard title="Answer first, win more" ring={ring}>
            Instant response (or after-hours booking) captures intent you’d
            otherwise lose.
          </MiniCard>
        </section>

        {/* Process (three clear steps) */}
        <section aria-label="Process">
          <div className="card p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <StepCard
                k="01"
                title="Launch the converter"
                ring={ring}
                bullets={[
                  "Focused landing page that earns trust quickly",
                  "CTA placement that makes the next step obvious",
                  "Proof above the fold to reduce hesitation",
                ]}
                icon={Rocket}
              />
              <StepCard
                k="02"
                title="Turn on demand"
                ring={ring}
                bullets={[
                  "Search/PMAX mapped to landing relevance",
                  "Meta creative testing with short iteration cycles",
                  "Measure real outcomes: booked calls, CPL",
                ]}
                icon={Megaphone}
              />
              <StepCard
                k="03"
                title="Capture every lead"
                ring={ring}
                bullets={[
                  "AI receptionist answers, qualifies, and books",
                  "Warm-transfers during open hours with context",
                  "After hours: instant scheduling on your calendar",
                ]}
                icon={Headphones}
              />
            </div>
          </div>
        </section>

        {/* Starter package */}
        <section aria-label="Starter" className="grid md:grid-cols-3 gap-4">
          <article className="card p-6 md:col-span-2">
            <h2 className="font-semibold">Starter — Landing page</h2>
            <p className="text-white/75 text-sm mt-1">
              A clean, fast page built to book calls. Start simple, then add
              pages, ads, and voice when you’re ready.
            </p>
            <ul className="mt-3 text-sm text-white/75 space-y-2">
              <Li icon={MousePointerClick}>Hero that explains value fast</Li>
              <Li icon={Users}>Trust elements (logos, testimonials, FAQs)</Li>
              <Li icon={CalendarCheck}>
                Inline booking or form with instant alerts
              </Li>
            </ul>
          </article>

          <aside className="card p-6 flex flex-col relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 90% at 120% -20%, rgba(255,255,255,.06), transparent 40%)",
              }}
            />
            <div className="text-sm text-white/60">Friendly pricing</div>
            <div className="text-4xl font-extrabold">from $499</div>
            <div className="text-white/60">Hosting & monitoring $25/mo</div>
            <div className="mt-auto pt-3 flex gap-2">
              <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
                <BadgeCheck className="size-4" />
                See full pricing
              </Link>
              <Link href="/contact" className="btn inline-flex items-center gap-2">
                <CalendarCheck className="size-4" />
                Book a call
              </Link>
            </div>
          </aside>
        </section>

        {/* Bridge & confidence note */}
        <section className="space-y-4">
          <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="card p-4 text-sm text-white/75">
              <b>Website + Ads</b> bring the right people.
            </div>
            <ArrowRight className="mx-auto opacity-70 hidden md:block" aria-hidden />
            <div className="card p-4 text-sm text-white/75">
              <b>AI Receptionist</b> turns them into bookings — even after hours.
            </div>
          </div>
          <p className="text-center text-xs text-white/60 max-w-2xl mx-auto">
            Responding fast matters. We design your flow for speed and clarity
            so more conversations become customers.
          </p>
        </section>

        {/* Final CTA (strong contrast + icons) */}
        <section className="text-center space-y-5 relative">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-6 h-32 blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 50%, rgba(124,58,237,.35), rgba(96,165,250,.25) 60%, transparent)",
            }}
          />
          <p className="relative text-white/80 text-lg">
            Ready to turn more visitors into booked calls?
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <Link href="/contact" className="btn h-12 px-5 rounded-xl inline-flex items-center gap-2">
              <CalendarCheck className="size-4" />
              Book a Strategy Call
            </Link>
            <Link href="/case-studies" className="btn-ghost h-12 px-5 rounded-xl inline-flex items-center gap-2">
              <BadgeCheck className="size-4" />
              See results
            </Link>
          </div>
          <p className="text-white/60 text-sm">No long-term contracts • Clear pricing • Built to grow</p>
        </section>
      </div>
    </main>
  );
}

/* ------------------------ helpers ------------------------ */

function ValueCard({
  title,
  children,
  ring,
}: {
  title: string;
  children: React.ReactNode;
  ring: string;
}) {
  return (
    <div className="relative rounded-2xl p-[1px]" style={{ background: ring }}>
      <article className="card rounded-2xl bg-black/60 p-6 h-full">
        <h2 className="font-semibold">{title}</h2>
        <div className="mt-3 space-y-2">{children}</div>
      </article>
    </div>
  );
}

function MiniCard({
  title,
  children,
  ring,
}: {
  title: string;
  children: React.ReactNode;
  ring: string;
}) {
  return (
    <div className="relative rounded-2xl p-[1px]" style={{ background: ring }}>
      <article className="card rounded-2xl bg-black/60 p-5 h-full">
        <div className="font-semibold mb-1">{title}</div>
        <p className="text-white/75 text-sm">{children}</p>
      </article>
    </div>
  );
}

function StepCard({
  k,
  title,
  bullets,
  icon: Icon,
  ring,
}: {
  k: string;
  title: string;
  bullets: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ring: string;
}) {
  return (
    <div className="relative rounded-2xl p-[1px]" style={{ background: ring }}>
      <div className="card rounded-2xl bg-black/60 p-5 h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/40 text-sm">{k}</div>
          <Icon className="size-5 opacity-85" aria-hidden />
        </div>
        <div className="font-semibold">{title}</div>
        <ul className="mt-3 text-sm text-white/75 space-y-2">
          {bullets.map((b) => (
            <Li key={b} icon={CheckCircle2}>
              {b}
            </Li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm text-white/75">
      <Icon className="size-4 mt-0.5 opacity-85" aria-hidden />
      <span>{text}</span>
    </div>
  );
}

function Li({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="size-4 mt-0.5 opacity-85" aria-hidden />
      <span>{children}</span>
    </li>
  );
}
