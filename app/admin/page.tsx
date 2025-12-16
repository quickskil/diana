import { AdminTable } from '@/components/AdminTable';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <section className="section">
      <div className="mx-auto max-w-6xl px-4">
        <p className="label">Admin</p>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Booked sessions</h1>
        <p className="mt-2 text-base text-slate-200">
          Securely review confirmed and pending bookings. Protect this page with the admin key configured in your environment
          variables.
        </p>
        <div className="mt-6">
          <AdminTable />
        </div>
      </div>
    </section>
  );
}
