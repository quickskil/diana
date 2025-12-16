'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { BookingForm } from '@/components/BookingForm';
import { Slot } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SchedulePage() {
  const { data, error, isLoading } = useSWR('/api/slots', fetcher, { refreshInterval: 30_000 });
  const slots: Slot[] = useMemo(() => data?.slots ?? [], [data]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | undefined>(undefined);

  return (
    <section className="section">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="label">Schedule</p>
          <h1 className="text-4xl font-bold text-white">Book a tutoring session with Diana</h1>
          <p className="text-base text-slate-200">
            Choose a time that works for you. Sessions are reserved after payment is completed through Stripe Checkout.
          </p>
          {isLoading && <p className="text-sm text-slate-300">Loading availability…</p>}
          {error && <p className="text-sm text-red-400">Unable to load slots.</p>}
          <AvailabilityCalendar slots={slots} selectedSlotId={selectedSlot?.id} onSelect={setSelectedSlot} />
        </div>
        <BookingForm selectedSlot={selectedSlot} />
      </div>
    </section>
  );
}
