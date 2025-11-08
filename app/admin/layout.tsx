'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AdminProvider } from './admin-context';

const navItems = [
  {
    href: '/admin/overview',
    label: 'Overview',
    description: 'Command centre snapshot'
  },
  {
    href: '/admin/onboarding',
    label: 'Onboarding',
    description: 'Projects, milestones & review'
  },
  {
    href: '/admin/payments',
    label: 'Payments',
    description: 'Stripe tracking & invoicing'
  },
  {
    href: '/admin/users',
    label: 'Users',
    description: 'Account management & roles'
  },
  {
    href: '/admin/projects',
    label: 'Projects',
    description: 'Pipeline roadmap & delivery'
  }
];

const getLinkClasses = (active: boolean) =>
  `group block rounded-2xl border px-4 py-3 transition-all duration-200 ${
    active
      ? 'border-white/70 bg-white/15 text-white shadow-lg shadow-sky-500/20'
      : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white'
  }`;

const getIndicatorClasses = (active: boolean) =>
  `mt-2 inline-block h-1 w-12 rounded-full transition-colors duration-200 ${
    active ? 'bg-sky-400' : 'bg-white/20 group-hover:bg-white/40'
  }`;

function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
      {navItems.map(item => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className={getLinkClasses(active)}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide">{item.label}</span>
                <p className="mt-1 text-xs text-white/70">{item.description}</p>
              </div>
              <span
                aria-hidden
                className="ml-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[0.7rem] font-semibold text-white/80"
              >
                {item.label.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className={getIndicatorClasses(active)} aria-hidden />
          </Link>
        );
      })}
    </nav>
  );
}

function AdminLayoutInner({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="container py-12 md:py-20">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-r from-black/70 via-black/40 to-sky-900/30 p-10 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold md:text-4xl">Admin control centre</h1>
              <p className="mt-3 max-w-2xl text-white/75">
                Manage users, accelerate onboarding, track payments, and keep every project moving without leaving the portal.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <AdminNavigation />
          </div>
        </header>

        <section className="space-y-10">{children}</section>
      </div>
    </main>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}

