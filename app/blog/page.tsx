import MiniChart from "@/components/MiniChart";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides and updates on building automated funnels that keep your calendar full.",
};

const upcoming = [
  {
    title: "Conversion homepage formula",
    summary: "We’ll walk section-by-section through the story that gets visitors to book.",
    trend: [6, 9, 14, 18, 24, 29, 34, 38],
  },
  {
    title: "Ad spend to booked calls",
    summary: "How we point every campaign at one CTA and trim weekly for cheaper leads.",
    trend: [92, 88, 83, 77, 71, 65, 59, 54],
  },
  {
    title: "Voice scripts that feel human",
    summary: "Sample intros, qualifying questions, and when to warm-transfer.",
    trend: [58, 61, 66, 72, 78, 83, 88, 93],
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
          <h1 id="resources-title">Guides and visuals dropping soon</h1>
          <p className="text-white/70">
            We’re packaging the exact frameworks we use each week. Skim the previews below and hop on the list to get the full
            breakdown first.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          {upcoming.map((item, index) => (
            <div key={item.title} className="radiant-card">
              <div className="card h-full p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Playbook {index + 1}</span>
                  <span className="badge">In production</span>
                </div>
                <h2 className="text-lg font-semibold text-white/95">{item.title}</h2>
                <p className="text-sm text-white/70">{item.summary}</p>
                <MiniChart values={item.trend} color={index === 1 ? "sky" : index === 2 ? "emerald" : "violet"} ariaLabel={`${item.title} preview chart`} />
              </div>
            </div>
          ))}
        </section>

        <section className="radiant-card">
          <div className="card p-6 space-y-4 text-center">
            <h2 className="text-xl font-semibold text-white/95">Want the playbook now?</h2>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              Book a quick call and we’ll walk through the automated funnel, share examples, and outline next steps tailored to
              your pipeline.
            </p>
            <MiniChart values={[12, 18, 24, 31, 37, 42, 49, 55]} color="violet" ariaLabel="Sample roadmap showing growth" />
            <Link href="/contact" className="btn inline-flex items-center gap-2 justify-center">
              Talk with us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
