// src/components/NewsletterForm.tsx
'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error((await r.text()) || 'Request failed');
      setMsg('Thanks! Please check your inbox to confirm.');
      setEmail('');
    } catch (err: any) {
      setMsg(err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mt-4" onSubmit={onSubmit}>
      {/* Honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label htmlFor="nl-email" className="sr-only">Email</label>
      <div className="flex items-center gap-2">
        <input
          id="nl-email"
          type="email"
          required
          placeholder="Your email"
          className="input flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="nl-help"
        />
        <button className="btn" type="submit" disabled={busy || !email}>
          {busy ? 'Submitting…' : 'Subscribe'}
        </button>
      </div>
      <p id="nl-help" className="mt-2 text-xs text-white/50">
        We’ll only send occasionally. Unsubscribe any time.
      </p>
      {msg && <div role="status" className="mt-2 text-xs text-white/70">{msg}</div>}
    </form>
  );
}
