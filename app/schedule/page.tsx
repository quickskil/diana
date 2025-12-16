import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const bookingUrl = process.env.NEXT_PUBLIC_KOALENDAR_URL;

const highlights = [
  {
    title: 'Personalized intake',
    copy: 'Tell Diana about your goals—Olympiad prep, midterms, or rebuilding confidence—so she can prep targeted problems.',
    icon: '📝'
  },
  {
    title: 'Stripe-secured checkout',
    copy: 'Pay safely inside Koalendar. You will receive instant confirmation plus a calendar invite that respects your timezone.',
    icon: '🔒'
  },
  {
    title: 'Prep you can see',
    copy: 'Before your session, expect a short roadmap and any reference sheets so you arrive ready to learn.',
    icon: '📌'
  }
];

const scheduleImages = [
  { src: '/diana-3.jpeg', alt: 'Student solving problems with Diana', caption: 'Warm, focused work time' },
  { src: '/diana-2.jpeg', alt: 'Tutoring notebook and geometry', caption: 'Color-coded notes you keep' },
  { src: '/diana-4.jpeg', alt: 'Colorful math notes', caption: 'Visuals for tricky concepts' }
];

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
    <section className="section bg-gradient-to-b from-[#fff4fa] via-white to-[#f8f3ff]">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="card-surface space-y-5 bg-white/95 shadow-2xl shadow-[#f7c5de]/70">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-white shadow-inner shadow-[#f6c9e0]/60">
                <Image src="/logo.png" alt="Diana Tolu Tutoring illustrated logo" fill sizes="120px" className="object-contain p-2" />
              </div>
              <div>
                <p className="label">Schedule</p>
                <h1 className="text-4xl font-bold leading-tight text-[#1f274b] sm:text-5xl">Book a session with Diana</h1>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#e1498d]">Warm coaching • Contest-grade rigor</p>
              </div>
            </div>
            <p className="text-base text-[#3a4162]">
              Browse real-time availability, reserve a slot, and pay securely via Stripe during checkout on Koalendar. Every booking
              includes a thoughtful intake so Diana can tailor your first lesson to your pace, confidence level, and upcoming deadlines.
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm text-[#1f274b] sm:grid-cols-2">
              {[
                'Pick a time that fits your schedule—no email ping-pong',
                'Stripe-secured payments with instant confirmation',
                'Google Calendar sync to prevent double-bookings',
                'Follow-up notes and a practice plan within 24 hours'
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#f3bfd8] bg-gradient-to-r from-white to-[#fff6fb] p-3 shadow-sm shadow-[#f7d7e8]/70"
                >
                  <span className="mt-1 text-base text-[#e1498d]">✨</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={bookingUrl || '/schedule'} className="button-primary" target={bookingUrl ? '_blank' : undefined}>
                Choose a time now
              </Link>
              <Link href="mailto:hello@dianatolu.com" className="button-secondary">
                Ask a scheduling question
              </Link>
              <Link href="/" className="button-secondary">
                Explore tutoring details
              </Link>
            </div>
            <p className="text-xs text-[#4b5070]">
              Need help? <Link href="mailto:hello@dianatolu.com">Email Diana</Link> and she will confirm a time with you directly.
            </p>
          </div>

          <div className="card-surface space-y-5 bg-gradient-to-br from-white via-[#fff4fa] to-[#f4ecff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#e1498d]">How booking works</p>
                <p className="text-xs uppercase tracking-wide text-[#5b6185]">Clear, predictable steps</p>
              </div>
              <span className="rounded-full bg-[#ffe1f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#e1498d]">
                Koalendar + Stripe
              </span>
            </div>
            <ol className="space-y-3 text-sm text-[#1f274b]">
              {[
                'Select a slot in Koalendar that matches your timezone.',
                'Share your goals—competition, coursework, or confidence-building.',
                'Complete secure Stripe checkout to lock in your time.',
                'Receive a calendar invite plus a mini-prep plan before we meet.'
              ].map((item, index) => (
                <li key={item} className="flex gap-3 rounded-2xl border border-[#f3bfd8] bg-white/90 p-3 shadow-sm shadow-[#f7d7e8]/60">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f274b] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <div className="grid gap-3 md:grid-cols-3">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="rounded-2xl border border-[#f3bfd8] bg-white/95 p-3 text-sm text-[#1f274b] shadow-sm shadow-[#f7d7e8]/60">
                  <p className="text-base font-semibold text-[#e1498d]">{highlight.icon} {highlight.title}</p>
                  <p className="mt-1 text-[#3a4162]">{highlight.copy}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-[#e1498d]/20 bg-gradient-to-r from-[#fff0f6] to-[#f5edff] p-4 text-sm text-[#1f274b]">
              <p className="font-semibold text-[#e1498d]">Prefer a call first?</p>
              <p>
                Reach out to <Link href="mailto:hello@dianatolu.com">hello@dianatolu.com</Link> and Diana will share two quick intro
                times. You can still use Koalendar once you pick your favorite.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="card-surface space-y-4 bg-white/95">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#1f274b]">See how your session looks</h2>
              <span className="pill">Camera-on optional</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {scheduleImages.map((image) => (
                <div key={image.src} className="space-y-2 rounded-2xl border border-[#f3bfd8] bg-white/90 p-3 shadow-sm shadow-[#f7d7e8]/60">
                  <div className="relative h-32 overflow-hidden rounded-xl">
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 240px, 100vw" className="object-cover" />
                  </div>
                  <p className="text-sm font-semibold text-[#1f274b]">{image.caption}</p>
                  <p className="text-xs text-[#5b6185]">{image.alt}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-[#f3bfd8] bg-gradient-to-r from-[#fff7fc] to-[#f0f4ff] p-4 text-sm text-[#1f274b]">
              <p className="font-semibold text-[#e1498d]">After we meet</p>
              <p className="mt-1 text-[#3a4162]">
                Expect a recap video, annotated solutions, and a practice plan that fits your week. You will always know what to do next.
              </p>
            </div>
          </div>

          {bookingUrl ? (
            <div className="card-surface h-full overflow-hidden border border-[#e1498d]/20 bg-white/95 p-0 shadow-2xl shadow-[#f7c5de]/70">
              <iframe
                src={bookingUrl}
                title="Schedule with Diana Tolu"
                className="h-full min-h-[720px] w-full border-0"
                allow="payment"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="card-surface space-y-3 bg-white/95">
              <p className="text-lg font-semibold text-[#1f274b]">Add your Koalendar link</p>
              <p className="text-sm text-[#3a4162]">
                Set the <code className="rounded bg-[#fff0f6] px-2 py-1 text-[#e1498d]">NEXT_PUBLIC_KOALENDAR_URL</code> environment variable to your
                Koalendar booking page (for example, <span className="font-semibold text-[#e1498d]">https://koalendar.com/e/your-link</span>), then
                restart the dev server.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-3xl border border-[#f3bfd8] bg-white/95 p-6 shadow-xl shadow-[#f8ddeb]/70">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label">Happy scheduling stories</p>
              <h2 className="text-3xl font-bold text-[#1f274b]">Why families and students love booking with Diana</h2>
              <p className="text-sm text-[#3a4162]">Transparent steps, secure checkout, and a tutor who prepares before you arrive.</p>
            </div>
            <Link href={bookingUrl || '/schedule'} className="button-primary" target={bookingUrl ? '_blank' : undefined}>
              Reserve your spot
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {scheduleTestimonials.map((testimonial) => (
              <div key={testimonial.name} className="card-surface space-y-3 bg-white/95 shadow-md shadow-[#f7d7e8]/70">
                <p className="text-sm text-[#1f274b]">“{testimonial.quote}”</p>
                <p className="text-sm font-semibold text-[#e1498d]">{testimonial.name}</p>
                <p className="text-xs text-[#5b6185]">{testimonial.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface flex flex-col gap-4 bg-gradient-to-r from-[#1f274b] via-[#27315f] to-[#e1498d] text-white md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-white/80">Ready when you are</p>
            <h3 className="text-2xl font-bold">Let’s pick your time together</h3>
            <p className="text-sm text-white/90">Email Diana with two time windows and she will reserve them for you in Koalendar.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="mailto:hello@dianatolu.com" className="button-secondary bg-white text-[#e1498d]">
              Email Diana directly
            </Link>
            <Link href={bookingUrl || '/schedule'} className="button-primary bg-white/90 text-[#1f274b]" target={bookingUrl ? '_blank' : undefined}>
              Open booking page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
