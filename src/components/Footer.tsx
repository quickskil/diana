import Link from 'next/link';

export const Footer = () => (
  <footer className="border-t border-slate-800/70 bg-slate-950/80">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold text-slate-100">Diana Tolu — Mathematics Tutor</p>
        <p className="text-slate-400">UCLA Mathematics • IMO Silver • EGMO Gold • Putnam Top 200</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/schedule" className="hover:text-indigo-200">
          Schedule
        </Link>
        <Link href="/admin" className="hover:text-indigo-200">
          Admin
        </Link>
        <Link href="mailto:hello@dianatolu.com" className="hover:text-indigo-200">
          hello@dianatolu.com
        </Link>
      </div>
    </div>
  </footer>
);
