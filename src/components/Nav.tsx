'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' }
];

export const Nav = () => {
  const pathname = usePathname();
  const active = useMemo(() => pathname || '/', [pathname]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-indigo-500/20 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg shadow-sky-900/40" />
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-white">
              Diana Tolu Tutoring
            </Link>
            <p className="text-xs text-slate-300">Competition-tested math guidance with tutor energy</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-white ${active === link.href ? 'text-sky-200' : 'text-slate-300'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link className="button-secondary" href="/schedule">
            See availability
          </Link>
          <Link className="button-primary" href="/schedule">
            Book a session
          </Link>
        </div>
      </div>
    </header>
  );
};
