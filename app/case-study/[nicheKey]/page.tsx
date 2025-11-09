import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { caseStudies } from '@/data/caseStudies';

const researchHighlights = [
  {
    title: 'Missed calls = missed revenue',
    copy:
      'Local operators can miss up to 40% of inbound calls during peak windows. Our AI receptionist plugs that leak so every opportunity is captured.',
  },
  {
    title: 'Answer instantly, save costs',
    copy:
      'Voice agents stay on 24/7, routinely cutting handling costs by 40-65% while keeping wait times near zero.',
  },
  {
    title: 'Speed-to-lead wins deals',
    copy:
      'Responding inside the first hour makes you ~7× more likely to qualify the lead versus slower competitors.',
  },
];

type Params = {
  nicheKey: string;
};

type CaseStudyPageProps = {
  params: Promise<Params>;
};

export function generateStaticParams() {
  return caseStudies.map(({ nicheKey }) => ({ nicheKey }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { nicheKey } = await params;
  const study = caseStudies.find((entry) => entry.nicheKey === nicheKey);

  if (!study) {
    return {
      title: 'Case Study',
    };
  }

  return {
    title: study.title,
    description: study.metaDescription,
  };
}

export default async function CaseStudyDetail({ params }: CaseStudyPageProps) {
  const { nicheKey } = await params;
  const study = caseStudies.find((entry) => entry.nicheKey === nicheKey);

  if (!study) {
    notFound();
  }

  const otherStudies = caseStudies.filter((entry) => entry.nicheKey !== study.nicheKey).slice(0, 3);

  return (
    <main className="section relative overflow-hidden" aria-labelledby="cs-hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1200px 600px at 0% 0%, rgba(139,92,246,.18), transparent 60%),' +
            'radial-gradient(1000px 500px at 100% 10%, rgba(14,165,233,.16), transparent 60%),' +
            'radial-gradient(800px 400px at 20% 95%, rgba(52,211,153,.12), transparent 60%)',
          WebkitMaskImage: 'radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)',
          maskImage: 'radial-gradient(140% 100% at 50% 0%, #000 40%, transparent 85%)',
        }}
      />

      <div className="container space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
          <Link href="/case-studies" className="inline-flex items-center gap-2 hover:text-white">
            <span aria-hidden>←</span>
            Back to all case studies
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
            Start today with a $99 deposit
          </span>
        </div>

        <header className="max-w-4xl space-y-4">
          <h1 id="cs-hero-title" className="text-3xl font-semibold tracking-tight text-white">
            {study.title}
          </h1>
          <p className="text-lg text-white/75">{study.overview}</p>
          <p className="text-white/70">{study.whyThisNiche}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Why speed matters">
          {researchHighlights.map((item) => (
            <div key={item.title} className="radiant-card">
              <div className="card h-full space-y-2 p-5">
                <h2 className="text-lg font-semibold text-white/90">{item.title}</h2>
                <p className="text-sm leading-relaxed text-white/70">{item.copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="radiant-card">
          <div className="card grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white/90">The system we deploy</h2>
              <p className="text-sm text-white/70">
                Website, ads, and AI voice follow-up are orchestrated together so every caller has a clear next step — whether
                that is a booking, a warm transfer, or an after-hours summary waiting in your inbox the next morning.
              </p>
              <ul className="space-y-3 text-sm text-white/80">
                {study.ourSolution.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2.5 rounded-full bg-sky-400" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-semibold text-white/90">Projected impact</h3>
              <p className="text-sm text-white/70">
                This snapshot combines live call handling, ad-driven demand, and a conversion-first site for {study.title.toLowerCase()}.
              </p>
              <ul className="space-y-3 text-sm text-white/80">
                {study.proofIdeas.map((proof) => (
                  <li key={proof} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-2.5 rounded-full bg-emerald-400" aria-hidden />
                    <span>{proof}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="radiant-card">
          <div className="card grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white/90">Turn every call into a booked next step</h2>
              <p className="text-sm text-white/70">
                Your AI voice agent greets callers in your brand voice, qualifies intent, routes urgent cases to the right human,
                and schedules directly into your calendar. Every interaction is summarized so your team can follow through without
                digging through voicemails.
              </p>
              <p className="text-sm text-white/65">
                Pair that with a high-velocity website and ad funnel, and you have a repeatable acquisition engine that keeps the
                phones ringing and the schedule full.
              </p>
            </div>
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">Let’s map it to you</p>
              <p className="text-lg font-semibold text-white/90">{study.interactivePrompt}</p>
              <p className="text-sm text-white/70">
                We’ll review your current funnel, quantify the cost of missed calls, and build the rollout plan together. The $99
                kickoff locks in your strategy session and build slot — the remaining investment isn’t due until you approve the
                launch plan.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={study.ctaLink}
                  className="btn"
                >
                  {study.ctaText}
                </Link>
                <Link href="/contact" className="btn-ghost">
                  Talk with a strategist
                </Link>
              </div>
            </div>
          </div>
        </section>

        {otherStudies.length > 0 && (
          <section className="space-y-4" aria-label="More case studies">
            <h2 className="text-lg font-semibold text-white/85">Explore more local success stories</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {otherStudies.map((entry) => (
                <Link
                  key={entry.nicheKey}
                  href={entry.slug}
                  className="radiant-card transition hover:-translate-y-1"
                >
                  <div className="card h-full space-y-3 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Case Study</p>
                    <p className="text-base font-semibold text-white/90">{entry.title}</p>
                    <p className="text-sm text-white/65">{entry.whyThisNiche}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200">
                      View playbook
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
