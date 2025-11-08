'use client';

import { useMemo } from 'react';
import { PLAN_CATALOG, type PlanKey } from '@/lib/plans';
import type { OnboardingProject } from '@/lib/types/user';
import type { PaymentRecord } from '@/lib/types/payments';
import { formatDateTime, useAdmin } from '../../admin-context';

const statusPalette: Record<string, string> = {
  'not-started': 'bg-white/10 text-white/70',
  'submitted': 'bg-sky-500/15 text-sky-100',
  'in-progress': 'bg-amber-500/15 text-amber-100',
  'launch-ready': 'bg-emerald-500/15 text-emerald-100'
};

const statusLabelMap: Record<string, string> = {
  'not-started': 'Not started',
  'submitted': 'Submitted for review',
  'in-progress': 'In progress',
  'launch-ready': 'Launch-ready'
};

const paymentStatusClass = (status: string) => {
  switch (status) {
    case 'succeeded':
      return 'bg-emerald-500/15 text-emerald-200';
    case 'processing':
      return 'bg-amber-500/15 text-amber-200';
    case 'requires_action':
    case 'requires_payment_method':
      return 'bg-orange-500/15 text-orange-100';
    default:
      return 'bg-white/10 text-white/70';
  }
};

const paymentStatusLabel = (status: string) => status.replace(/_/g, ' ');

const currencyFormatter = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount);
  } catch {
    return `${(currency || 'USD').toUpperCase()} ${amount.toFixed(2)}`;
  }
};

function aggregateRevenue(payments: PaymentRecord[]) {
  return payments.reduce(
    (acc, payment) => {
      if (payment.status === 'succeeded') {
        acc.total += payment.amount / 100;
        if (payment.type === 'kickoff-deposit') acc.deposits += payment.amount / 100;
        if (payment.type === 'final-balance') acc.finalBalances += payment.amount / 100;
      }
      return acc;
    },
    { total: 0, deposits: 0, finalBalances: 0 }
  );
}

function getLatestProjects(projects: OnboardingProject[] = []) {
  return [...projects]
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0))
    .slice(0, 3);
}

export default function OverviewPanel() {
  const { clients, events, eventsLoading, usingSampleEvents, payments, paymentsLoading, paymentsSample } = useAdmin();

  const onboardedClients = useMemo(
    () => clients.filter(client => Array.isArray(client.onboardingProjects) && client.onboardingProjects.length > 0),
    [clients]
  );

  const activeProjects = useMemo(() => {
    return onboardedClients.flatMap(client =>
      client.onboardingProjects.filter(project => project.status !== 'launch-ready').map(project => ({ client, project }))
    );
  }, [onboardedClients]);

  const latestEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      })
      .slice(0, 5);
  }, [events]);

  const latestPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0))
      .slice(0, 5);
  }, [payments]);

  const planMix = useMemo(() => {
    const totals: Partial<Record<PlanKey, number>> = {};
    onboardedClients.forEach(client => {
      client.onboardingProjects.forEach(project => {
        const key = (project.data?.plan ?? 'launch') as PlanKey;
        totals[key] = (totals[key] ?? 0) + 1;
      });
    });
    return (Object.entries(totals) as [PlanKey, number][])
      .map(([plan, count]) => ({
        plan,
        count,
        label: PLAN_CATALOG[plan]?.name ?? plan
      }))
      .sort((a, b) => b.count - a.count);
  }, [onboardedClients]);

  const revenue = useMemo(() => aggregateRevenue(payments), [payments]);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-2xl shadow-sky-900/20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-wide text-white/60">Total clients</p>
            <p className="mt-2 text-3xl font-semibold">{clients.length}</p>
            <p className="mt-1 text-sm text-white/60">Accounts launched in the Business Booster platform</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-wide text-white/60">Active onboarding</p>
            <p className="mt-2 text-3xl font-semibold">{activeProjects.length}</p>
            <p className="mt-1 text-sm text-white/60">Projects progressing towards launch readiness</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-wide text-white/60">Upcoming events</p>
            <p className="mt-2 text-3xl font-semibold">{events.length}</p>
            <p className="mt-1 text-sm text-white/60">
              {usingSampleEvents ? 'Sample schedule loaded' : 'Synced live from Cal.com'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-wide text-white/60">Revenue captured</p>
            <p className="mt-2 text-3xl font-semibold">${revenue.total.toLocaleString()}</p>
            <p className="mt-1 text-sm text-white/60">Deposits ${revenue.deposits.toLocaleString()} • Final {`$${revenue.finalBalances.toLocaleString()}`}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Active pipeline</h2>
              <p className="text-sm text-white/70">Keep tabs on onboarding progress and surface the next moves.</p>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-white/60">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Next milestone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-white/60">
                      Every onboarding is launch-ready. New submissions will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  activeProjects.map(({ client, project }) => {
                    const planName = PLAN_CATALOG[project.data.plan]?.name ?? project.data.plan;
                    return (
                      <tr key={`${client.id}-${project.id}`} className="hover:bg-white/5">
                        <td className="px-4 py-4">
                          <div className="font-medium text-white">{client.name || client.email}</div>
                          <div className="text-xs text-white/60">{client.company ?? 'Independent'}</div>
                        </td>
                        <td className="px-4 py-4 text-white/75">{planName}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusPalette[project.status] || 'bg-white/10 text-white/70'}`}>
                            {statusLabelMap[project.status] ?? project.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/60">{formatDateTime(project.statusUpdatedAt)}</td>
                        <td className="px-4 py-4 text-white/70">{project.statusNote || 'Document next step to keep the team aligned.'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-xl">
            <h3 className="text-lg font-semibold">Plan mix</h3>
            {planMix.length === 0 ? (
              <p className="mt-3 text-sm text-white/70">No onboarding submissions yet. As clients register you will see the plan distribution here.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {planMix.map(entry => (
                  <li key={entry.plan} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.label}</p>
                      <p className="text-xs text-white/60">{entry.plan}</p>
                    </div>
                    <span className="text-xl font-semibold text-white/80">{entry.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-xl">
            <h3 className="text-lg font-semibold">Recent updates</h3>
            {onboardedClients.length === 0 ? (
              <p className="mt-3 text-sm text-white/70">Waiting for the first onboarding submission.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {onboardedClients.slice(0, 3).map(client => {
                  const latest = getLatestProjects(client.onboardingProjects)[0];
                  return (
                    <li key={client.id} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                      <p className="text-white">{client.name || client.email}</p>
                      <p className="text-xs text-white/60">{latest ? `${statusLabelMap[latest.status] ?? latest.status} • ${formatDateTime(latest.updatedAt)}` : 'Awaiting kickoff'}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Upcoming schedule</h2>
              <p className="text-sm text-white/70">The next Cal.com bookings synced for any client.</p>
            </div>
            {eventsLoading && <span className="text-xs text-white/60">Refreshing…</span>}
          </div>
          <div className="mt-6 space-y-3">
            {eventsLoading ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">Loading events…</p>
            ) : latestEvents.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">No scheduled events found.</p>
            ) : (
              latestEvents.map(event => (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-lg font-semibold text-white">{event.title || 'Untitled event'}</p>
                  <p className="text-xs uppercase tracking-wide text-white/50">{formatDateTime(event.startTime)}</p>
                  <p className="mt-2 text-sm text-white/70">{event.description || 'Keep the team aligned by adding notes inside Cal.com'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                    {event.attendees?.map(att => (
                      <span key={`${event.id}-${att.email}`} className="rounded-full border border-white/10 px-3 py-1">
                        {att.name ?? att.email}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Latest payments</h2>
              <p className="text-sm text-white/70">Stripe transactions that recently hit the account.</p>
            </div>
            {paymentsLoading && <span className="text-xs text-white/60">Refreshing…</span>}
          </div>
          {paymentsSample && (
            <p className="mt-3 rounded-full border border-amber-300/40 bg-amber-500/10 px-4 py-1 text-xs text-amber-100">Demo data — add STRIPE_SECRET_KEY for live payments.</p>
          )}
          <div className="mt-6 space-y-3">
            {paymentsLoading ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">Loading payments…</p>
            ) : latestPayments.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">No Stripe activity yet.</p>
            ) : (
              latestPayments.map(payment => (
                <div key={payment.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{payment.description || 'Payment'}</p>
                      <p className="text-xs text-white/60">{payment.metadata?.clientName || payment.metadata?.clientEmail || 'Client'}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatusClass(payment.status)}`}>
                      {paymentStatusLabel(payment.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{currencyFormatter(payment.amount / 100, payment.currency)}</p>
                  <p className="text-xs text-white/50">{formatDateTime(payment.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

