import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => (
  <section className="section grid-accent" id="book">
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-7">
        <p className="label">One-on-one math mentorship</p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#1f274b] sm:text-5xl md:text-6xl">
          Calm, feminine energy paired with medal-level rigor
        </h1>
        <p className="text-lg text-[#4b5070]">
          Diana meets you where you are—whether that is building foundations, polishing proof-writing, or chasing an Olympiad medal. Each session blends friendly coaching, vivid visual explanations, and a “show-your-work” approach that sticks far
          beyond homework nights.
        </p>
        <div className="grid grid-cols-1 gap-3 text-sm text-[#4b5070] sm:grid-cols-2">
          {["Weekly skill sprints with mini-goals", 'Competition tactics translated into classroom wins', 'Annotated solutions and video recaps after lessons', 'Stripe-secured booking inside Koalendar'].map(
            (point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-[#f3bfd8] bg-white/90 p-3 shadow-sm shadow-[#f7d7e8]">
                <span className="mt-1 text-base text-[#e1498d]">✨</span>
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
            <div key={stat.label} className="card-surface bg-white/95">
              <p className="text-sm font-semibold text-[#e1498d]">{stat.label}</p>
              <p className="mt-1 text-sm text-[#4b5070]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="card-surface h-full space-y-5 bg-gradient-to-br from-white via-[#fff1f7] to-[#ffe7f1]">
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
            <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg shadow-[#f6c9e0]/70">
              <Image src="/diana-1.jpeg" alt="Diana smiling while tutoring" fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" priority />
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative h-32 overflow-hidden rounded-2xl shadow-md shadow-[#f7d7e8]/70">
                <Image src="/diana-2.jpeg" alt="Tutoring notebook and geometry" fill sizes="200px" className="object-cover" />
              </div>
              <div className="relative h-24 overflow-hidden rounded-2xl bg-white/90 p-2 shadow-md shadow-[#f6c9e0]/60">
                <Image src="/logo.png" alt="Diana Tolu Tutoring illustrated logo" fill sizes="200px" className="object-contain" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-36 overflow-hidden rounded-2xl shadow-md shadow-[#f7d7e8]/70">
              <Image src="/diana-3.jpeg" alt="Student solving problems with Diana" fill sizes="260px" className="object-cover" />
            </div>
            <div className="relative h-36 overflow-hidden rounded-2xl shadow-md shadow-[#f7d7e8]/70">
              <Image src="/diana-4.jpeg" alt="Colorful math notes" fill sizes="260px" className="object-cover" />
            </div>
          </div>
          <p className="text-base text-[#4b5070]">
            “Students deserve a tutor who cares as much about confidence as scores. Sessions feel like a calm studio to solve puzzles, celebrate breakthroughs, and practice the kind of thinking professors and contest graders love.”
          </p>
          <p className="text-sm font-semibold text-[#e1498d]">— Diana Tolu</p>
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
