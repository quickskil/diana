import type { Metadata } from 'next';
import Link from 'next/link';

const bookingUrl = process.env.NEXT_PUBLIC_KOALENDAR_URL;

export const metadata: Metadata = {
  title: 'Schedule a session — Diana Tolu Tutoring',
  description:
    'Choose a time with Diana Tolu using Koalendar. Pick an available slot and pay securely with Stripe during checkout.',
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
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="space-y-3">
          <p className="label">Schedule</p>
          <h1 className="text-4xl font-bold text-white">Book a tutoring session with Diana</h1>
          <p className="text-base text-slate-200">
            You can browse real-time availability, reserve a slot, and pay securely via Stripe during checkout on Koalendar. Once
            booked, the event syncs to Diana&apos;s Google calendar so there are no double bookings.
          </p>
          <p className="text-sm text-slate-400">
            Need help? <Link href="mailto:hello@dianatolu.com">Email Diana</Link> and she will confirm a time with you directly.
          </p>
        </div>

        {bookingUrl ? (
          <div className="card-surface overflow-hidden p-0">
            <iframe
              src={bookingUrl}
              title="Schedule with Diana Tolu"
              className="h-[80vh] min-h-[620px] w-full border-0"
              allow="payment"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="card-surface space-y-3">
            <p className="text-lg font-semibold text-white">Add your Koalendar link</p>
            <p className="text-sm text-slate-200">
              Set the <code className="rounded bg-slate-800 px-2 py-1">NEXT_PUBLIC_KOALENDAR_URL</code> environment variable to your
              Koalendar booking page (for example, <span className="text-indigo-200">https://koalendar.com/e/your-link</span>),
              then restart the dev server.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
