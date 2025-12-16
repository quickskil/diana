const testimonials = [
  {
    name: 'Alex R.',
    note: 'Diana helped me push past a plateau before EGMO. Her feedback on my solutions was precise and motivating.',
    role: 'EGMO trainee'
  },
  {
    name: 'Sofia M.',
    note: 'Proof-writing finally clicked. I went from messy scratch work to clear arguments that my professor loved.',
    role: 'UCLA linear algebra student'
  },
  {
    name: 'Marcus L.',
    note: 'The mock Putnam sessions were invaluable—timed drills plus immediate debriefs that mirrored the real pressure.',
    role: 'Putnam competitor'
  }
];

export const Testimonials = () => (
  <section className="section bg-slate-950">
    <div className="mx-auto max-w-6xl px-4">
      <p className="label">Testimonials</p>
      <h2 className="text-3xl font-bold text-white md:text-4xl">Students value clarity, rigor, and calm coaching</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="card-surface space-y-3">
            <p className="text-sm text-slate-200">“{testimonial.note}”</p>
            <p className="text-sm font-semibold text-white">{testimonial.name}</p>
            <p className="text-xs text-slate-400">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
