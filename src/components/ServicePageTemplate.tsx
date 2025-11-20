import Link from "next/link";

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
        <header className="space-y-3 text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Service</p>
          <h1 id="service-title">{title}</h1>
          <p className="lead text-white/80">{subtitle}</p>
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
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-white/75 list-disc list-inside">
            {whatYouGet.map((item) => (
              <li key={item}>{item}</li>
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

        <section aria-labelledby="ideal-for-title" className="card p-6 space-y-3">
          <h2 id="ideal-for-title" className="font-semibold text-white/95">
            Ideal For
          </h2>
          <ul className="text-sm text-white/75 list-disc list-inside space-y-1">
            {idealFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="text-center space-y-3">
          <Link href={ctaHref} className="btn inline-flex items-center justify-center px-6 h-12">
            Start Now
          </Link>
          <p className="text-xs text-white/60 max-w-2xl mx-auto">
            Create your account and self-onboard. We guide setup inside the app.
          </p>
        </section>

        <section className="card p-5 text-sm text-white/75" aria-label="Integration note">
          {integrationNote}
        </section>
      </div>
    </main>
  );
}
