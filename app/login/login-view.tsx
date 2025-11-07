'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginView() {
  const router = useRouter();
  const { login, hydrated, currentUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated || !currentUser) return;
    router.replace(currentUser.role === 'admin' ? '/admin' : '/dashboard');
  }, [currentUser, hydrated, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await login(form);
    if (!result.ok) {
      setError(result.message ?? 'Unable to sign in with those credentials.');
      setSubmitting(false);
      return;
    }
    router.replace('/dashboard');
  };

  return (
    <main
      id="main"
      className="relative isolate overflow-hidden px-4 py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.25),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-slate-950 via-slate-900/80 to-black" />
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-40px_rgba(56,189,248,0.5)] backdrop-blur">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-white/70">Sign in to review onboarding progress, manage plan details, and monitor bookings.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
            <label htmlFor="password" className="block text-sm font-medium text-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-brand focus:outline-none"
              placeholder="Your password"
            />
          </div>

          {error && <p className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:shadow-fuchsia-500/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing you in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/70">
          Need an account?{' '}
          <a href="/register" className="text-sky-300 underline-offset-4 hover:underline">
            Create one now
          </a>
        </p>
        <p className="mt-2 text-xs text-white/60">
          Admin demo login: <code className="rounded bg-white/10 px-2 py-1">admin@businessbooster.ai / admin123</code>
        </p>
      </div>
    </main>
  );
}
