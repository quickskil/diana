const offerings = [
  {
    title: 'Competition coaching',
    items: ['Full strategy for IMO/EGMO/Putnam preparation', 'Timed mock exams with point-by-point feedback', 'Pattern spotting, invariants, and constructive solution paths']
  },
  {
    title: 'University support',
    items: ['Real analysis, linear algebra, combinatorics, probability', 'Problem sets reviewed with proof critiques', 'Office-hours style Q&A and exam readiness drills']
  },
  {
    title: 'Foundation building',
    items: ['Algebra and geometry fundamentals for high school', 'Mathematical writing and latex tips', 'Study plans tailored to your next milestone']
  }
];

export const Offerings = () => (
  <section className="section bg-slate-950/80">
    <div className="mx-auto max-w-6xl px-4">
      <p className="label">Sessions</p>
      <h2 className="text-3xl font-bold text-white md:text-4xl">What to expect in your time with Diana</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {offerings.map((offering) => (
          <div key={offering.title} className="card-surface space-y-3">
            <h3 className="text-xl font-semibold text-white">{offering.title}</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              {offering.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);
