import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  PhoneCall,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

export type ServiceStat = {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
};

export type Playbook = {
  title: string;
  description: string;
  items: string[];
  icon: ElementType;
};

export type ServiceStep = {
  title: string;
  description: string;
  duration?: string;
};

export type ToolkitItem = {
  name: string;
  detail: string;
  icon: ElementType;
};

export type ServicePageContent = {
  title: string;
  subtitle: string;
  overview: string;
  whatYouGet: string[];
  whyItWorks: string;
  howItPairs: string;
  idealFor: string[];
  pricing?: string;
  ctaHref?: string;
  integrationNote: string;
  heroBadges: string[];
  stats: ServiceStat[];
  playbooks: Playbook[];
  steps: ServiceStep[];
  proofPoints: string[];
  toolkit: ToolkitItem[];
  ctaNote?: string;
};

export function ServicePageTemplate({
  content,
}: {
  content: ServicePageContent;
}) {
  const {
    title,
    subtitle,
    overview,
    whatYouGet,
    whyItWorks,
    howItPairs,
    idealFor,
    pricing,
    ctaHref = "/register",
    integrationNote,
    heroBadges,
    stats,
    playbooks,
    steps,
    proofPoints,
    toolkit,
    ctaNote,
  } = content;

  return (
    <main className="section relative overflow-hidden" aria-labelledby="service-title">
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
        <header className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs uppercase tracking-[0.2em] text-white/60">
            {heroBadges.map((badge) => (
              <span key={badge} className="pill">
                {badge}
              </span>
            ))}
          </div>
          <div className="space-y-3">
            <h1 id="service-title">{title}</h1>
            <p className="lead text-white/80">{subtitle}</p>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={ctaHref} className="btn inline-flex items-center gap-2 px-6 h-12">
              <Sparkles className="size-4" aria-hidden />
              Start onboarding now
            </Link>
            <Link
              href="/contact"
              className="btn-ghost inline-flex items-center gap-2 px-6 h-12"
            >
              <CalendarClock className="size-4" aria-hidden />
              Schedule a call
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3" aria-label="Outcome stats">
            {stats.map((stat) => {
              const Icon = stat.icon as any;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-white/75"
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-white/55">{stat.label}</div>
                      <div className="text-lg font-semibold text-white">{stat.value}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{stat.detail}</p>
                </div>
              );
            })}
          </div>
        </header>

        <section aria-labelledby="overview-title" className="card p-6 space-y-3">
          <h2 id="overview-title" className="font-semibold text-white/95">
            Overview
          </h2>
          <p className="text-white/75 text-sm leading-relaxed">{overview}</p>
        </section>

        <section aria-labelledby="what-you-get-title" className="card p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 id="what-you-get-title" className="font-semibold text-white/95">
              What You Get
            </h2>
            {pricing ? (
              <span className="badge bg-emerald-400/15 text-emerald-200 border border-emerald-300/30">
                {pricing}
              </span>
            ) : null}
          </div>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-white/75">
            {whatYouGet.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="size-4 mt-0.5 text-emerald-300" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid lg:grid-cols-2 gap-4">
          <article className="card p-6 space-y-3" aria-labelledby="why-it-works-title">
            <h2 id="why-it-works-title" className="font-semibold text-white/95">
              Why It Works
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">{whyItWorks}</p>
          </article>

          <article className="card p-6 space-y-3" aria-labelledby="pairing-title">
            <h2 id="pairing-title" className="font-semibold text-white/95">
              How It Pairs With Our Other Services
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">{howItPairs}</p>
          </article>
        </section>

        <section aria-label="Playbooks" className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {playbooks.map((playbook) => {
            const Icon = playbook.icon as any;
            return (
              <div key={playbook.title} className="card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white/90">{playbook.title}</h3>
                    <p className="text-xs text-white/60">{playbook.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/75">
                  {playbook.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ShieldCheck className="size-4 mt-0.5 text-emerald-300" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        <section aria-labelledby="steps-title" className="card p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 id="steps-title" className="font-semibold text-white/95">
              How we roll it out
            </h2>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/60">
              <Workflow className="size-4" aria-hidden />
              Proven playbooks
            </span>
          </div>
          <ol className="grid md:grid-cols-2 gap-3 text-white/80">
            {steps.map((step, idx) => (
              <li key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200 font-semibold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-semibold text-white/90">{step.title}</div>
                      {step.duration ? (
                        <div className="text-xs text-white/55">{step.duration}</div>
                      ) : null}
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-white/50" aria-hidden />
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid lg:grid-cols-2 gap-4">
          <article className="card p-6 space-y-3" aria-labelledby="ideal-for-title">
            <h2 id="ideal-for-title" className="font-semibold text-white/95">
              Ideal For
            </h2>
            <ul className="text-sm text-white/75 list-disc list-inside space-y-1">
              {idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="card p-6 space-y-3" aria-label="Quality checks">
            <h2 className="font-semibold text-white/95">Quality checks and guardrails</h2>
            <ul className="space-y-2 text-sm text-white/75">
              {proofPoints.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 mt-0.5 text-emerald-300" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section aria-label="Toolkit" className="card p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="font-semibold text-white/95">Toolkit we ship with</h2>
            <span className="badge">Implementation + handoff</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {toolkit.map((item) => {
              const Icon = item.icon as any;
              return (
                <div key={item.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-white/55">{item.detail}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={ctaHref} className="btn inline-flex items-center gap-2 px-6 h-12">
              <Rocket className="size-4" aria-hidden />
              Start onboarding now
            </Link>
            <Link href="/contact" className="btn-ghost inline-flex items-center gap-2 px-6 h-12">
              <PhoneCall className="size-4" aria-hidden />
              Talk with a strategist
            </Link>
          </div>
          <p className="text-xs text-white/60 max-w-3xl mx-auto">
            {ctaNote ?? "Create your account and self-onboard. We guide setup inside the app with checklists and live support."}
          </p>
        </section>

        <section className="card p-5 text-sm text-white/75" aria-label="Integration note">
          {integrationNote}
        </section>
      </div>
    </main>
  );
}
