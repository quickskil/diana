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
    <header className="sticky top-0 z-30 w-full border-b border-rose-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-300 to-rose-500 shadow-lg shadow-rose-200/70" />
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-rose-700">
              Diana Tolu Tutoring
            </Link>
            <p className="text-xs text-slate-600">Competition-tested math guidance with tutor energy</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-rose-700 ${active === link.href ? 'text-rose-500' : 'text-slate-500'}`}
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
