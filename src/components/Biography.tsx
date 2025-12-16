export const Biography = () => (
  <section id="biography" className="section bg-white/70">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-start">
      <div className="space-y-5">
        <p className="label">Biography</p>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Mentorship shaped by medals and heart</h2>
        <p className="text-base text-slate-700">
          Diana Tolu is a Romanian mathematician studying Mathematics at UCLA. She represented Romania on the world stage, earning
          a Silver Medal at the International Mathematical Olympiad (IMO) and multiple medals— including Gold—at the European
          Girls’ Mathematical Olympiad (EGMO).
        </p>
        <p className="text-base text-slate-700">
          At UCLA she balances rigorous coursework with mentoring peers, earning a Top 200 finish in the William Lowell Putnam
          Mathematical Competition. Students love how she translates contest intuition into step-by-step explanations that click
          for coursework in proofs, analysis, linear algebra, combinatorics, and geometry.
        </p>
        <p className="text-base text-slate-700">
          Sessions feel like collaborative workshops: brainstorming first, then polished write-ups, then reflection on how to grow
          ten times faster next week. Expect positivity, accountability, and study plans tailored to your next big milestone.
        </p>
      </div>
      <div className="card-surface space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Location</span>
          <span className="text-sm font-semibold text-slate-900">Los Angeles • Remote worldwide</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Focus areas</span>
          <span className="text-sm font-semibold text-slate-900">Olympiad prep, proof-writing, linear algebra, analysis</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Session length</span>
          <span className="text-sm font-semibold text-slate-900">60 or 90 minutes</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Languages</span>
          <span className="text-sm font-semibold text-slate-900">English, Romanian</span>
        </div>
        <div className="grid gap-2 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-700">
          <p className="font-semibold text-rose-700">Teaching pillars</p>
          <ul className="space-y-1">
            {[
              'Curiosity-first warmups to lower stress',
              'Proof critiques that read like coaching letters',
              'Colorful diagrams and analogies for sticky ideas',
              'Clear next steps at the end of every lesson'
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-slate-700">
          Ready to start? Book a session to co-design a plan that fits your classes, competitions, and preferred pace.
        </p>
      </div>
    </div>
  </section>
);
