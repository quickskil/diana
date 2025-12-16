import Link from 'next/link';

export const Hero = () => (
  <section className="section grid-accent" id="book">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <p className="label">Personal mathematics tutor</p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Diana Tolu — UCLA Mathematics • IMO & EGMO Medalist
        </h1>
        <p className="text-lg text-slate-200">
          Sharpen your proof skills, competition strategy, and university coursework with individualized guidance from a
          decorated international competitor and UCLA mathematics student.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/schedule" className="button-primary">
            View schedule &amp; book
          </Link>
          <a href="#biography" className="button-secondary">
            Read biography
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'IMO Silver Medalist', value: 'International Mathematical Olympiad' },
            { label: 'EGMO Multi-medalist', value: 'Including Gold Medal' },
            { label: 'Putnam Top 200', value: 'UCLA departmental awardee' }
          ].map((stat) => (
            <div key={stat.label} className="card-surface">
              <p className="text-sm text-indigo-200">{stat.label}</p>
              <p className="mt-1 text-sm text-slate-200">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="card-surface h-full space-y-4">
          <div className="h-52 rounded-xl bg-gradient-to-br from-indigo-600/50 via-slate-800 to-emerald-500/40" />
          <p className="text-sm text-slate-300">
            “Every student can learn to think like a mathematician. I focus on the rigor, curiosity, and pattern-finding that
            earn points in competition and clarity in coursework.”
          </p>
          <p className="text-sm font-semibold text-white">— Diana Tolu</p>
        </div>
      </div>
    </div>
  </section>
);
