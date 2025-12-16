import Link from 'next/link';

export const Hero = () => (
  <section className="section grid-accent" id="book">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
      <div className="space-y-7">
        <p className="label">One-on-one math mentorship</p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Calm tutoring energy with competition-level rigor
        </h1>
        <p className="text-lg text-slate-200">
          Diana meets you where you are—whether that is building foundations, polishing proof-writing, or chasing an Olympiad
          medal. Each session blends friendly coaching, vivid visual explanations, and a “show-your-work” approach that sticks far
          beyond homework nights.
        </p>
        <div className="grid grid-cols-1 gap-3 text-sm text-slate-100 sm:grid-cols-2">
          {["Weekly skill sprints with mini-goals", 'Competition tactics translated into classroom wins', 'Annotated solutions and video recaps after lessons', 'Stripe-secured booking inside Koalendar'].map(
            (point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-sky-200/10 bg-slate-900/60 p-3">
                <span className="mt-1 text-base">✨</span>
                <p>{point}</p>
              </div>
            )
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/schedule" className="button-primary">
            Start your tutoring plan
          </Link>
          <Link href="#biography" className="button-secondary">
            Meet Diana
          </Link>
          <Link href="mailto:hello@dianatolu.com" className="button-secondary">
            Ask a quick question
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'IMO Silver Medalist', value: 'International Mathematical Olympiad' },
            { label: 'EGMO Medalist', value: 'Multiple medals including Gold' },
            { label: 'Putnam Top 200', value: 'Departmental recognition at UCLA' }
          ].map((stat) => (
            <div key={stat.label} className="card-surface">
              <p className="text-sm text-sky-200">{stat.label}</p>
              <p className="mt-1 text-sm text-slate-200">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="card-surface h-full space-y-5 bg-gradient-to-br from-slate-900/90 via-indigo-900/70 to-fuchsia-900/60">
          <div className="h-56 rounded-2xl bg-gradient-to-br from-sky-400/30 via-indigo-500/10 to-fuchsia-400/20" />
          <p className="text-base text-slate-100">
            “Students deserve a tutor who cares as much about confidence as scores. My sessions feel like a calm studio to solve
            puzzles, celebrate breakthroughs, and practice the kind of thinking professors and contest graders love.”
          </p>
          <p className="text-sm font-semibold text-white">— Diana Tolu</p>
          <div className="flex flex-wrap gap-2">
            <span className="pill">Proof-first feedback</span>
            <span className="pill">Competition intuition</span>
            <span className="pill">Friendly accountability</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
