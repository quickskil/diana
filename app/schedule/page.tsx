import type { Metadata } from 'next';
import Link from 'next/link';

const bookingUrl = process.env.NEXT_PUBLIC_KOALENDAR_URL;

const scheduleTestimonials = [
  {
    name: 'Lena',
    quote: 'Booking was simple and the Stripe checkout felt safe. The confirmation email even included her prep plan for me.',
    detail: 'Parent of geometry student'
  },
  {
    name: 'Jordan',
    quote: 'Diana offered two time options within minutes. We found a weekly slot that works around sports.',
    detail: 'High school athlete'
  },
  {
    name: 'Nora',
    quote: 'After our first session she sent a recap video. I knew exactly what to practice before the next lesson.',
    detail: 'Putnam trainee'
  }
];

export const metadata: Metadata = {
  title: 'Schedule a session — Diana Tolu Tutoring',
  description:
    'Choose a time with Diana Tolu using Koalendar. Pick an available slot, design your goals, and pay securely with Stripe during checkout.',
  openGraph: {
    title: 'Schedule a session — Diana Tolu Tutoring',
    description:
      'Reserve time with Diana through Koalendar. Calendar sync prevents double-bookings and Stripe payments keep checkout secure.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dianatolu.com'}/schedule`
  }
};

export default function SchedulePage() {
  return (
    <section className="section">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="card-surface space-y-4 bg-gradient-to-br from-slate-900/90 via-indigo-900/70 to-fuchsia-900/60">
            <p className="label">Schedule</p>
            <h1 className="text-4xl font-bold text-white">Book a tutoring session with Diana</h1>
            <p className="text-base text-slate-100">
              Browse real-time availability, reserve a slot, and pay securely via Stripe during checkout on Koalendar. Every booking
              includes a short intake so Diana can tailor your first lesson to your pace and goals.
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm text-slate-100 sm:grid-cols-2">
              {[
                'Pick a time that fits your schedule—no email ping-pong',
                'Stripe-secured payments with instant confirmation',
                'Google Calendar sync to prevent double-bookings',
                'Follow-up notes and practice plan within 24 hours'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-sky-200/15 bg-slate-900/60 p-3">
                  <span className="mt-1 text-base">📘</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/schedule" className="button-primary">
                Choose a time now
              </Link>
              <Link href="mailto:hello@dianatolu.com" className="button-secondary">
                Ask a scheduling question
              </Link>
              <Link href="/" className="button-secondary">
                Explore tutoring details
              </Link>
            </div>
            <p className="text-xs text-slate-300">
              Need help? <Link href="mailto:hello@dianatolu.com">Email Diana</Link> and she will confirm a time with you directly.
            </p>
          </div>
          <div className="card-surface space-y-4 bg-slate-900/80">
            <p className="text-sm font-semibold text-white">How booking works</p>
            <ol className="space-y-2 text-sm text-slate-200">
              {[
                'Select a slot in Koalendar that fits your timezone.',
                'Share your goals—competition, coursework, or confidence-building.',
                'Complete secure Stripe checkout to lock in your time.',
                'Receive a calendar invite plus a mini-prep plan before we meet.'
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-400/30 text-sm font-bold text-sky-100">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl border border-sky-200/20 bg-slate-800/70 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">Prefer a call first?</p>
              <p>
                Reach out to <Link href="mailto:hello@dianatolu.com">hello@dianatolu.com</Link> and Diana will share two quick intro
                times. You can still use Koalendar once you pick your favorite.
              </p>
            </div>
          </div>
        </div>

        {bookingUrl ? (
          <div className="card-surface overflow-hidden border border-sky-200/20 bg-slate-950/70 p-0">
            <iframe
              src={bookingUrl}
              title="Schedule with Diana Tolu"
              className="h-[80vh] min-h-[680px] w-full border-0"
              allow="payment"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="card-surface space-y-3">
            <p className="text-lg font-semibold text-white">Add your Koalendar link</p>
            <p className="text-sm text-slate-200">
              Set the <code className="rounded bg-slate-800 px-2 py-1">NEXT_PUBLIC_KOALENDAR_URL</code> environment variable to your
              Koalendar booking page (for example, <span className="text-indigo-200">https://koalendar.com/e/your-link</span>), then
              restart the dev server.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label">Happy scheduling stories</p>
              <h2 className="text-3xl font-bold text-white">Why families and students love booking with Diana</h2>
            </div>
            <Link href="/schedule" className="button-primary">
              Reserve your spot
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {scheduleTestimonials.map((testimonial) => (
              <div key={testimonial.name} className="card-surface space-y-3 bg-slate-900/80">
                <p className="text-sm text-slate-200">“{testimonial.quote}”</p>
                <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                <p className="text-xs text-slate-400">{testimonial.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
