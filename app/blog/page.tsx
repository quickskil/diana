import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides and updates on building automated funnels that keep your calendar full.",
};

const upcoming = [
  {
    title: "The conversion-first homepage template",
    summary: "How we structure the hero, proof, and CTA so visitors book without hunting for details.",
  },
  {
    title: "Playbook: turning ad clicks into calls",
    summary: "Message match, spend allocation, and the three weekly trims that compound results.",
  },
  {
    title: "Voice agent scripts that feel human",
    summary: "What the receptionist says on first contact, how we qualify, and when we warm-transfer.",
  },
];

export default function Page() {
  return (
    <main className="section relative overflow-hidden" aria-labelledby="resources-title">
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

      <div className="container space-y-8">
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 id="resources-title">Guides coming soon</h1>
          <p className="text-white/70">
            We’re packaging the exact frameworks we use to design, drive, and automate funnels. Add your email below to be first
            to read them.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          {upcoming.map((item) => (
            <div key={item.title} className="radiant-card">
              <div className="card h-full p-5 space-y-2">
                <h2 className="text-lg font-semibold text-white/95">{item.title}</h2>
                <p className="text-sm text-white/70">{item.summary}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-3 text-center">
            <h2 className="text-xl font-semibold text-white/95">Want the playbook now?</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              Book a quick call and we’ll walk through the automated funnel, share examples, and outline next steps tailored to
              your pipeline.
            </p>
            <Link href="/contact" className="btn inline-flex items-center gap-2 justify-center">
              Talk with us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
