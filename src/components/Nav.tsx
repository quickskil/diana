'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' }
];

export const Nav = () => {
  const pathname = usePathname();
  const active = useMemo(() => pathname || '/', [pathname]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#f3bfd8]/70 bg-white/90 shadow-[0_12px_35px_rgba(225,73,141,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:flex-nowrap md:px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-md shadow-[#f6c9e0]/60">
            <Image src="/logo.png" alt="Diana Tolu Tutoring logo" fill sizes="40px" className="object-contain p-1.5" />
          </div>
          <div>
            <Link href="/" className="text-base font-semibold tracking-tight text-[#1f274b] md:text-lg">
              Diana Tolu Tutoring
            </Link>
            <p className="text-[11px] text-[#5b6185] md:text-xs">Warm, competition-tested math guidance</p>
          </div>
        </div>
        <nav className="hidden items-center gap-1 rounded-full border border-[#f3bfd8]/80 bg-white/70 px-2 py-1 text-sm font-medium text-slate-700 shadow-sm shadow-[#f7d7e8]/70 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 transition ${
                active === link.href
                  ? 'bg-gradient-to-r from-[#e1498d] via-[#f25fa4] to-[#f7a6d1] text-white shadow-sm shadow-[#f7c5de]'
                  : 'text-slate-500 hover:bg-[#fff3f8] hover:text-[#e1498d]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link className="button-secondary px-4 py-2 text-sm" href="/schedule">
            See availability
          </Link>
          <Link className="button-primary px-5 py-2.5 text-sm" href="/schedule">
            Book a session
          </Link>
        </div>
      </div>
    </header>
  );
};
