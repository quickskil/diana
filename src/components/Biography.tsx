import Image from 'next/image';

export const Biography = () => (
  <section id="biography" className="section bg-white/60">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-5">
        <p className="label">Biography</p>
        <h2 className="text-3xl font-bold text-[#1f274b] md:text-4xl">Mentorship shaped by medals and heart</h2>
        <p className="text-base text-[#4b5070]">
          Diana Tolu is a Romanian mathematician studying Mathematics at UCLA. She represented Romania on the world stage, earning a Silver Medal at the International Mathematical Olympiad (IMO) and multiple medals— including Gold—at the European Girls’ Mathematical Olympiad (EGMO).
        </p>
        <p className="text-base text-[#4b5070]">
          At UCLA she balances rigorous coursework with mentoring peers, earning a Top 200 finish in the William Lowell Putnam Mathematical Competition. Students love how she translates contest intuition into step-by-step explanations that click for coursework in proofs, analysis, linear algebra, combinatorics, and geometry.
        </p>
        <p className="text-base text-[#4b5070]">
          Sessions feel like collaborative workshops: brainstorming first, then polished write-ups, then reflection on how to grow ten times faster next week. Expect positivity, accountability, and study plans tailored to your next big milestone.
        </p>
        <div className="grid gap-2 rounded-3xl border border-[#f3bfd8] bg-[#fff4fa]/70 p-5 text-sm text-[#4b5070] shadow-sm shadow-[#f7d7e8]/70">
          <p className="font-semibold text-[#e1498d]">Teaching pillars</p>
          <ul className="space-y-1">
            {[
              'Curiosity-first warmups to lower stress',
              'Proof critiques that read like coaching letters',
              'Colorful diagrams and analogies for sticky ideas',
              'Clear next steps at the end of every lesson'
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-[#e1498d] to-[#f7a6d1]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-[#5b6185]">
          Ready to start? Book a session to co-design a plan that fits your classes, competitions, and preferred pace.
        </p>
      </div>
      <div className="card-surface space-y-4 bg-white/90">
        <div className="relative h-64 overflow-hidden rounded-3xl shadow-lg shadow-[#f6c9e0]/70">
          <Image src="/diana-5.jpeg" alt="Diana smiling with a math book" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-2xl border border-[#f3bfd8] bg-[#fff6fb] px-4 py-3">
            <span className="text-sm text-[#5b6185]">Location</span>
            <span className="text-sm font-semibold text-[#1f274b]">Los Angeles • Remote worldwide</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#f3bfd8] bg-[#fff6fb] px-4 py-3">
            <span className="text-sm text-[#5b6185]">Focus areas</span>
            <span className="text-sm font-semibold text-[#1f274b]">Olympiad prep, proof-writing, linear algebra, analysis</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#f3bfd8] bg-[#fff6fb] px-4 py-3">
            <span className="text-sm text-[#5b6185]">Session length</span>
            <span className="text-sm font-semibold text-[#1f274b]">60 or 90 minutes</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#f3bfd8] bg-[#fff6fb] px-4 py-3">
            <span className="text-sm text-[#5b6185]">Languages</span>
            <span className="text-sm font-semibold text-[#1f274b]">English, Romanian</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="pill">Gentle accountability</span>
          <span className="pill">Olympiad intuition</span>
          <span className="pill">Celebratory check-ins</span>
        </div>
      </div>
    </div>
  </section>
);
