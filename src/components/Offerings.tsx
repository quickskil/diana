const offerings = [
  {
    title: 'Competition coaching',
    items: [
      'Full strategy for IMO/EGMO/Putnam preparation with weekly checkpoints',
      'Timed mock exams with point-by-point feedback and rubric practice',
      'Pattern spotting, invariants, constructive solutions, and graceful write-ups',
      'Calm mindset coaching for test day and debriefs that turn mistakes into wins'
    ]
  },
  {
    title: 'University support',
    items: [
      'Real analysis, linear algebra, combinatorics, probability, and discrete math',
      'Problem sets reviewed with annotated proof critiques you can reference later',
      'Office-hours style Q&A plus targeted drills for exams and quizzes',
      'Study playbooks for collaborating with professors and TAs'
    ]
  },
  {
    title: 'Foundation building',
    items: [
      'Algebra and geometry fundamentals with visuals and manipulatives',
      'Mathematical writing, LaTeX tips, and “explain your thinking” prompts',
      'Weekly confidence boosters: quick wins, flashcards, and mini reflections',
      'Custom pacing for busy schedules, athletes, and multi-topic learners'
    ]
  }
];

export const Offerings = () => (
  <section className="section bg-slate-950/80">
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label">Sessions</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">What to expect in your time with Diana</h2>
        </div>
        <span className="pill">More clarity. More calm. More math wins.</span>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {offerings.map((offering) => (
          <div key={offering.title} className="card-surface space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{offering.title}</h3>
              <span className="rounded-full bg-sky-300/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-100">
                Tutoring ready
              </span>
            </div>
            <ul className="space-y-2 text-sm text-slate-200">
              {offering.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-sky-300 to-fuchsia-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-300">
              Each package starts with a short calibration chat so you know exactly how the next sessions will flow.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
