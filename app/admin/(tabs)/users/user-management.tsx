'use client';

import { useMemo, useState } from 'react';
import type { SafeUser } from '@/lib/types/user';
import { formatDateTime, useAdmin } from '../../admin-context';

const roleLabels: Record<SafeUser['role'], string> = {
  admin: 'Admin',
  client: 'Client'
};

export default function UserManagement() {
  const { users, clients } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | SafeUser['role']>('all');

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => (roleFilter === 'all' ? true : user.role === roleFilter))
      .filter(user => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return (
          user.email.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query) ||
          user.company?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0));
  }, [roleFilter, search, users]);

  const totalAdmins = useMemo(() => users.filter(user => user.role === 'admin').length, [users]);
  const onboardingCompleted = useMemo(
    () =>
      clients.filter(client =>
        client.onboardingProjects?.some(project => project.status === 'launch-ready')
      ).length,
    [clients]
  );

  return (
    <div className="space-y-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <h2 className="text-2xl font-semibold">Account analytics</h2>
        <p className="mt-2 text-sm text-white/70">Understand the composition of your customer base and internal team.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Total users</p>
            <p className="mt-2 text-3xl font-semibold">{users.length}</p>
            <p className="text-sm text-white/60">Across every role connected to Business Booster</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Admin operators</p>
            <p className="mt-2 text-3xl font-semibold">{totalAdmins}</p>
            <p className="text-sm text-white/60">Team members with full control</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Launch-ready clients</p>
            <p className="mt-2 text-3xl font-semibold">{onboardingCompleted}</p>
            <p className="text-sm text-white/60">Projects marked ready for automation handoff</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">User directory</h2>
            <p className="text-sm text-white/70">Search every account and understand their onboarding footprint.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3 py-2">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                  roleFilter === 'all' ? 'bg-sky-500/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('admin')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                  roleFilter === 'admin' ? 'bg-sky-500/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Admins
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('client')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                  roleFilter === 'client' ? 'bg-sky-500/20 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Clients
              </button>
            </div>
            <div>
              <label className="sr-only" htmlFor="user-search">
                Search users
              </label>
              <input
                id="user-search"
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search name, email, company"
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Onboarding projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">
                    No users match your filters. Try adjusting the role filter or search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-4 py-4">
                      <div className="font-medium text-white">{user.name || 'No name provided'}</div>
                    </td>
                    <td className="px-4 py-4 text-white/75">{user.email}</td>
                    <td className="px-4 py-4 text-white/75">{user.company || '—'}</td>
                    <td className="px-4 py-4 text-white/75">{roleLabels[user.role]}</td>
                    <td className="px-4 py-4 text-white/60">{formatDateTime(user.createdAt)}</td>
                    <td className="px-4 py-4 text-white/75">
                      {user.onboardingProjects?.length ? (
                        <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                          {user.onboardingProjects.length} project{user.onboardingProjects.length > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

