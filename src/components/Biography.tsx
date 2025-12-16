export const Biography = () => (
  <section id="biography" className="section bg-slate-950">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        <p className="label">Biography</p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Mentor with international credentials</h2>
        <p className="text-base text-slate-200">
          Diana Tolu is a Romanian mathematician studying Mathematics at the University of California, Los Angeles. She
          represented Romania on the world stage, earning a Silver Medal at the International Mathematical Olympiad (IMO) and
          multiple medals—including a Gold—at the European Girls’ Mathematical Olympiad (EGMO).
        </p>
        <p className="text-base text-slate-200">
          At UCLA she balances rigorous coursework with mentoring peers, and her problem-solving depth led to a Top 200 finish in
          the William Lowell Putnam Mathematical Competition. Diana is known for translating contest intuition into clear,
          university-ready explanations that help students thrive in proofs, analysis, linear algebra, combinatorics, and geometry.
        </p>
        <p className="text-base text-slate-200">
          Sessions emphasize creative strategies, precise mathematical writing, and calm coaching. Whether you&apos;re aiming for a
          medal, strengthening fundamentals, or preparing for graduate-level study, Diana adapts the pace and structure so each
          meeting is focused, encouraging, and outcome-driven.
        </p>
      </div>
      <div className="card-surface space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Location</span>
          <span className="text-sm font-semibold text-white">Los Angeles • Remote worldwide</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Focus areas</span>
          <span className="text-sm font-semibold text-white">Olympiad prep, proof-writing, linear algebra, analysis</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Session length</span>
          <span className="text-sm font-semibold text-white">60 or 90 minutes</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Languages</span>
          <span className="text-sm font-semibold text-white">English, Romanian</span>
        </div>
      </div>
    </div>
  </section>
);
