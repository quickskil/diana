'use client';

import { format, parseISO } from '@/lib/date-utils';
import { Slot } from '@/types';

type Props = {
  slots: Slot[];
  selectedSlotId?: string;
  onSelect: (slot: Slot) => void;
};

export const AvailabilityCalendar = ({ slots, selectedSlotId, onSelect }: Props) => {
  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const dayKey = format(parseISO(slot.start), 'yyyy-MM-dd');
    acc[dayKey] = acc[dayKey] ? [...acc[dayKey], slot] : [slot];
    return acc;
  }, {});

  const dayEntries = Object.entries(grouped).sort(([a], [b]) => (a > b ? 1 : -1));

  return (
    <div className="space-y-4">
      {dayEntries.length === 0 && <p className="text-sm text-slate-300">No available slots yet. Check back soon.</p>}
      {dayEntries.map(([day, daySlots]) => (
        <div key={day} className="card-surface space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">{format(new Date(day), 'EEEE, MMMM d')}</p>
            <p className="text-xs text-slate-400">{daySlots.length} open {daySlots.length === 1 ? 'time' : 'times'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {daySlots
              .sort((a, b) => (parseISO(a.start).getTime() > parseISO(b.start).getTime() ? 1 : -1))
              .map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500/20 text-white'
                        : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-indigo-400'
                    }`}
                    onClick={() => onSelect(slot)}
                  >
                    {format(parseISO(slot.start), 'h:mm a')} — {format(parseISO(slot.end), 'h:mm a')}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
