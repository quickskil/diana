'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { PLAN_CATALOG } from '@/lib/plans';
import type { OnboardingProject } from '@/lib/types/user';
import { formatDateTime, useAdmin } from '../../admin-context';

const statusColumns: { key: OnboardingProject['status']; title: string; subtitle: string }[] = [
  { key: 'submitted', title: 'Submitted', subtitle: 'Ready for review' },
  { key: 'in-progress', title: 'In progress', subtitle: 'Workstreams active' },
  { key: 'launch-ready', title: 'Launch-ready', subtitle: 'Awaiting automation handoff' },
  { key: 'not-started', title: 'Not started', subtitle: 'Invite clients to onboard' }
];

export default function ProjectsDashboard() {
  const { clients } = useAdmin();

  const projects = useMemo(() => {
    return clients.flatMap(client =>
      (client.onboardingProjects ?? []).map(project => ({ clientName: client.name || client.email, client, project }))
    );
  }, [clients]);

  const columns = useMemo(() => {
    return statusColumns.map(column => ({
      ...column,
      entries: projects.filter(entry => entry.project.status === column.key)
    }));
  }, [projects]);

  const timeline = useMemo(() => {
    return [...projects]
      .sort((a, b) => (a.project.statusUpdatedAt > b.project.statusUpdatedAt ? -1 : a.project.statusUpdatedAt < b.project.statusUpdatedAt ? 1 : 0))
      .slice(0, 6);
  }, [projects]);

  const totalProjects = projects.length;

  return (
    <div className="space-y-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Project kanban</h2>
            <p className="text-sm text-white/70">Visualise every onboarding initiative grouped by status.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-1 text-sm text-white/70">
            {totalProjects} active onboarding projects
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-4">
          {columns.map(column => (
            <div key={column.key} className="flex flex-col rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white">{column.title}</p>
                  <p className="text-xs text-white/60">{column.subtitle}</p>
                </div>
                <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/60">{column.entries.length}</span>
              </div>
              <div className="mt-4 space-y-3">
                {column.entries.length === 0 ? (
                  <p className="rounded-xl border border-white/10 bg-black/20 px-3 py-4 text-xs text-white/60">
                    Nothing here yet.
                  </p>
                ) : (
                  column.entries.map(entry => {
                    const plan = PLAN_CATALOG[entry.project.data.plan];
                    return (
                      <Link
                        key={entry.project.id}
                        href={`/admin/projects/${entry.project.id}`}
                        className="block rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-sky-400/60 hover:bg-black/10"
                      >
                        <p className="text-sm font-semibold text-white">{entry.clientName}</p>
                        <p className="text-xs text-white/60">{plan?.name ?? entry.project.data.plan}</p>
                        <p className="mt-2 text-xs text-white/50">Updated {formatDateTime(entry.project.statusUpdatedAt)}</p>
                        {entry.project.statusNote && (
                          <p className="mt-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/65">
                            {entry.project.statusNote}
                          </p>
                        )}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Recent delivery updates</h2>
            <p className="text-sm text-white/70">The latest six movements across any onboarding project.</p>
          </div>
        </div>

        {timeline.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-black/30 px-4 py-6 text-center text-white/60">
            No onboarding activity yet. Projects will surface here automatically as statuses change.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {timeline.map(entry => {
              const plan = PLAN_CATALOG[entry.project.data.plan];
              return (
                <li key={`${entry.project.id}-timeline`} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <Link href={`/admin/projects/${entry.project.id}`} className="block">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{entry.clientName}</p>
                        <p className="text-xs text-white/60">{plan?.name ?? entry.project.data.plan}</p>
                      </div>
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                        {entry.project.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-white/50">{formatDateTime(entry.project.statusUpdatedAt)}</p>
                    {entry.project.statusNote && (
                      <p className="mt-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/70">
                        {entry.project.statusNote}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

