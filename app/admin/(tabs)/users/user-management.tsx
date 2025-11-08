'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { SafeUser } from '@/lib/types/user';
import { formatDateTime, useAdmin } from '../../admin-context';

const roleLabels: Record<SafeUser['role'], string> = {
  admin: 'Admin',
  client: 'Client'
};

type PanelMode = 'create' | 'edit' | 'email' | null;

type FeedbackState = 'neutral' | 'success' | 'error';

const emptyForm = {
  name: '',
  email: '',
  company: '',
  role: 'client' as SafeUser['role'],
  password: ''
};

const emptyEmailForm = {
  subject: 'A quick update from Business Booster',
  message: 'Hi there,\n\nJust a quick update regarding your onboarding progress. Let me know if you have any questions.'
};

export default function UserManagement() {
  const {
    users,
    clients,
    createUser,
    updateUser,
    deleteUser,
    sendUserEmail
  } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | SafeUser['role']>('all');
  const [panel, setPanel] = useState<PanelMode>(null);
  const [activeUser, setActiveUser] = useState<SafeUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [emailForm, setEmailForm] = useState(emptyEmailForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('neutral');

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

  const openPanel = (mode: PanelMode, user?: SafeUser | null) => {
    setPanel(mode);
    setActiveUser(user ?? null);
    setFeedback(null);
    setFeedbackState('neutral');
    setSubmitting(false);
    if (mode === 'create') {
      setForm({ ...emptyForm });
    } else if (mode === 'edit' && user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        company: user.company ?? '',
        role: user.role,
        password: ''
      });
    } else if (mode === 'email' && user) {
      setEmailForm({
        subject: `Update for ${user.name || user.email}`,
        message: `Hi ${user.name || user.email},\n\nJust checking in on your onboarding progress. Let me know if there's anything you need.`
      });
    }
  };

  const closePanel = () => {
    setPanel(null);
    setActiveUser(null);
    setForm({ ...emptyForm });
    setEmailForm({ ...emptyEmailForm });
    setFeedback(null);
    setFeedbackState('neutral');
    setSubmitting(false);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    setFeedbackState('neutral');
    const result = await createUser({
      name: form.name,
      email: form.email,
      password: form.password,
      company: form.company || undefined,
      role: form.role
    });
    if (result.ok) {
      setFeedback(result.message ?? 'User created.');
      setFeedbackState('success');
      closePanel();
    } else {
      setFeedback(result.message ?? 'Unable to create user.');
      setFeedbackState('error');
    }
    setSubmitting(false);
  };

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeUser) return;
    setSubmitting(true);
    setFeedback(null);
    setFeedbackState('neutral');
    const result = await updateUser(activeUser.id, {
      name: form.name,
      email: form.email,
      company: form.company,
      role: form.role
    });
    if (result.ok) {
      setFeedback(result.message ?? 'User updated.');
      setFeedbackState('success');
      closePanel();
    } else {
      setFeedback(result.message ?? 'Unable to update user.');
      setFeedbackState('error');
    }
    setSubmitting(false);
  };

  const handleSendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeUser) return;
    setSubmitting(true);
    setFeedback(null);
    setFeedbackState('neutral');
    const result = await sendUserEmail(activeUser.id, emailForm);
    if (result.ok) {
      const suffix = result.sample ? ' (email service not configured)' : '';
      setFeedback((result.message ?? 'Email sent.') + suffix);
      setFeedbackState(result.sample ? 'neutral' : 'success');
      closePanel();
    } else {
      setFeedback(result.message ?? 'Unable to send email.');
      setFeedbackState('error');
    }
    setSubmitting(false);
  };

  const handleDelete = async (user: SafeUser) => {
    const confirmation = window.confirm(
      `Delete ${user.name || user.email}? This will remove all onboarding data for this user.`
    );
    if (!confirmation) return;
    const result = await deleteUser(user.id);
    if (result.ok) {
      setFeedback(result.message ?? 'User deleted.');
      setFeedbackState('success');
    } else {
      setFeedback(result.message ?? 'Unable to delete user.');
      setFeedbackState('error');
    }
  };

  const renderPanel = () => {
    if (!panel) return null;
    if (panel === 'create' || panel === 'edit') {
      const title = panel === 'create' ? 'Create user' : `Edit ${activeUser?.name || activeUser?.email}`;
      const onSubmit = panel === 'create' ? handleCreate : handleEdit;
      return (
        <section className="rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/70">
                Manage account details, company metadata, and administrative access.
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 hover:border-white/40 hover:text-white"
            >
              Close
            </button>
          </div>
          <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={event => void onSubmit(event)}>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="user-name">
                Name
              </label>
              <input
                id="user-name"
                type="text"
                value={form.name}
                onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="user-email">
                Email
              </label>
              <input
                id="user-email"
                type="email"
                value={form.email}
                onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="user-company">
                Company
              </label>
              <input
                id="user-company"
                type="text"
                value={form.company}
                onChange={event => setForm(prev => ({ ...prev, company: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="user-role">
                Role
              </label>
              <select
                id="user-role"
                value={form.role}
                onChange={event =>
                  setForm(prev => ({ ...prev, role: event.target.value as SafeUser['role'] }))
                }
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {panel === 'create' && (
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="user-password">
                  Temporary password
                </label>
                <input
                  id="user-password"
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={event => setForm(prev => ({ ...prev, password: event.target.value }))}
                  required
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
                />
                <p className="mt-1 text-xs text-white/50">Share this password with the customer so they can sign in.</p>
              </div>
            )}
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Saving…' : panel === 'create' ? 'Create user' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      );
    }
    if (panel === 'email' && activeUser) {
      return (
        <section className="rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">Email {activeUser.name || activeUser.email}</h3>
              <p className="mt-1 text-sm text-white/70">Send a personalised update directly from the portal.</p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 hover:border-white/40 hover:text-white"
            >
              Close
            </button>
          </div>
          <form className="mt-6 space-y-4" onSubmit={event => void handleSendEmail(event)}>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="email-subject">
                Subject
              </label>
              <input
                id="email-subject"
                type="text"
                value={emailForm.subject}
                onChange={event => setEmailForm(prev => ({ ...prev, subject: event.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50" htmlFor="email-message">
                Message
              </label>
              <textarea
                id="email-message"
                rows={6}
                value={emailForm.message}
                onChange={event => setEmailForm(prev => ({ ...prev, message: event.target.value }))}
                required
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send email'}
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      );
    }
    return null;
  };

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
            <div className="flex items-center gap-2">
              <input
                id="user-search"
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search name, email, company"
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-sky-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => openPanel('create')}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
              >
                Invite new user
              </button>
            </div>
          </div>
        </div>

        {feedback && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              feedbackState === 'success'
                ? 'border border-emerald-400/50 bg-emerald-500/10 text-emerald-100'
                : feedbackState === 'error'
                  ? 'border border-red-400/50 bg-red-500/10 text-red-100'
                  : 'border border-white/15 bg-black/40 text-white/70'
            }`}
          >
            {feedback}
          </p>
        )}

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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-white/60">
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
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openPanel('edit', user)}
                          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openPanel('email', user)}
                          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70 hover:border-white/40 hover:text-white"
                        >
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(user)}
                          className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200 hover:border-red-400 hover:text-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {renderPanel()}
    </div>
  );
}
