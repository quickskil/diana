'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterView() {
  const router = useRouter();
  const { register, hydrated, currentUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !currentUser) return;
    router.replace(currentUser.role === 'admin' ? '/admin' : '/dashboard');
  }, [currentUser, hydrated, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    const result = await register(form);
    if (!result.ok) {
      setError(result.message ?? 'We could not complete your registration.');
      setSubmitting(false);
      return;
    }
    setMessage('Account created! Redirecting to your portal...');
    setTimeout(() => {
      router.replace('/dashboard');
    }, 600);
  };

  return (
    <main
      id="main"
      className="relative isolate overflow-hidden px-4 py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.28),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-gradient-to-b from-slate-950 via-slate-900/85 to-black" />
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_160px_-45px_rgba(14,165,233,0.55)] backdrop-blur">
        <h1 className="text-3xl font-semibold text-white">Create your Business Booster login</h1>
        <p className="mt-2 text-white/70">
          Access the onboarding workspace, share your launch details, and monitor booked Cal.com events from your portal.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-brand focus:outline-none"
              placeholder="Alex Rivers"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-brand focus:outline-none"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-white/80">
              Company name (optional)
            </label>
            <input
              id="company"
              type="text"
              value={form.company}
              onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-brand focus:outline-none"
              placeholder="Business Booster AI"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-brand focus:outline-none"
              placeholder="Create a secure password"
            />
            <p className="mt-1 text-xs text-white/60">Minimum 6 characters.</p>
          </div>

          {error && <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating your account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/70">
          Already have access?{' '}
          <a href="/login" className="text-sky-300 underline-offset-4 hover:underline">
            Sign in instead
          </a>
        </p>
      </div>
    </main>
  );
}
