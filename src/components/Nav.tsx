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
    <header className="sticky top-0 z-30 w-full border-b border-[#f3bfd8] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-md shadow-[#f6c9e0]/60">
            <Image src="/logo.png" alt="Diana Tolu Tutoring logo" fill sizes="48px" className="object-contain p-1.5" />
          </div>
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight text-[#1f274b]">
              Diana Tolu Tutoring
            </Link>
            <p className="text-xs text-[#5b6185]">Warm, competition-tested math guidance</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-[#e1498d] ${active === link.href ? 'text-[#e1498d]' : 'text-slate-500'}`}
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
