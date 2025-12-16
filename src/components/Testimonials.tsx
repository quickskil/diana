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
  },
  {
    name: 'Priya K.',
    note: 'She sends short recap videos after lessons so I can review before class. It keeps me calm and prepared.',
    role: 'AP Calculus student'
  },
  {
    name: 'William S.',
    note: 'Her kindness is unmatched. I started believing I could actually enjoy math instead of hiding from it.',
    role: 'Algebra refresher'
  }
];

export const Testimonials = () => (
  <section className="section bg-white/70">
    <div className="mx-auto max-w-6xl px-4">
      <p className="label">Testimonials</p>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="text-3xl font-bold text-[#1f274b] md:text-4xl">Students value clarity, rigor, and calm coaching</h2>
        <span className="text-sm text-[#5b6185]">Every quote below comes from a real session recap.</span>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="card-surface space-y-3 bg-white/95">
            <p className="text-sm text-[#4b5070]">“{testimonial.note}”</p>
            <p className="text-sm font-semibold text-[#e1498d]">{testimonial.name}</p>
            <p className="text-xs text-[#5b6185]">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
