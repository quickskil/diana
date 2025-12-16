'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { format } from '@/lib/date-utils';

type Booking = {
  id: string;
  studentName: string;
  studentEmail: string;
  goal: string;
  status: string;
  start: string;
  end: string;
};

const fetcher = (url: string, adminKey: string) =>
  fetch(url, { headers: { 'x-admin-key': adminKey } }).then((res) => {
    if (!res.ok) throw new Error('Unable to load bookings');
    return res.json();
  });

export const AdminTable = () => {
  const [adminKey, setAdminKey] = useState('');
  const { data, error, isLoading, mutate } = useSWR(adminKey ? ['/api/admin/bookings', adminKey] : null, ([url, key]) =>
    fetcher(url, key)
  );

  return (
    <div className="space-y-4">
      <div className="card-surface space-y-3">
        <h2 className="text-xl font-semibold text-white">Admin view</h2>
        <p className="text-sm text-slate-300">Use the admin key from your environment to load confirmed and pending sessions.</p>
        <div className="flex gap-3">
          <input
            type="password"
            className="input"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
          />
          <button className="button-secondary" onClick={() => mutate()} disabled={!adminKey}>
            Refresh
          </button>
        </div>
      </div>
      {isLoading && <p className="text-sm text-slate-300">Loading bookings…</p>}
      {error && <p className="text-sm text-red-400">{String(error)}</p>}
      {data && (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Slot</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-200">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.bookings.map((booking: Booking) => (
                <tr key={booking.id} className="bg-slate-900/70">
                  <td className="px-4 py-3 text-white">
                    <div className="font-semibold">{booking.studentName}</div>
                    <div className="text-xs text-slate-400">{booking.studentEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {format(new Date(booking.start), 'PPpp')} — {format(new Date(booking.end), 'p')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : booking.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-200'
                            : 'bg-slate-700/70 text-slate-100'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{booking.goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
