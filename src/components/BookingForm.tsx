'use client';

import { useState } from 'react';
import { BookingPayload, Slot } from '@/types';

interface Props {
  selectedSlot?: Slot;
}

export const BookingForm = ({ selectedSlot }: Props) => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [goal, setGoal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select a time slot.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload: BookingPayload = {
      slotId: selectedSlot.id,
      studentName,
      studentEmail,
      goal
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Unable to start checkout.');
      }

      const data = await response.json();
      const checkoutUrl = data.checkoutUrl as string;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4">
      <div>
        <p className="label">Booking details</p>
        <h3 className="text-xl font-semibold text-white">Reserve your session</h3>
        <p className="text-sm text-slate-300">
          A secure Stripe Checkout link will appear after you submit. Availability is confirmed after payment.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-200" htmlFor="name">
          Name
        </label>
        <input
          required
          id="name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="input"
          placeholder="Your full name"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200" htmlFor="email">
          Email
        </label>
        <input
          required
          id="email"
          type="email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className="input"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-200" htmlFor="goal">
          Goals or topics
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="input min-h-[120px]"
          placeholder="Competition prep focus, course name, or problem themes"
        />
      </div>
      {selectedSlot ? (
        <div className="rounded-lg border border-indigo-400/60 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
          Selected: {new Date(selectedSlot.start).toLocaleString()} ({new Date(selectedSlot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
        </div>
      ) : (
        <p className="text-sm text-amber-200">Please pick a time from the calendar to continue.</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" className="button-primary w-full" disabled={submitting}>
        {submitting ? 'Redirecting to payment…' : 'Continue to payment'}
      </button>
    </form>
  );
};
