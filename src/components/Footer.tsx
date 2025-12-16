import Link from 'next/link';

export const Footer = () => (
  <footer className="border-t border-rose-100 bg-white/80">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold text-rose-700">Diana Tolu — Mathematics Tutor</p>
        <p className="text-slate-600">UCLA Mathematics • IMO Silver • EGMO Medalist • Putnam Top 200</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/schedule" className="button-secondary">
          Schedule now
        </Link>
        <Link href="mailto:hello@dianatolu.com" className="button-primary">
          Email Diana
        </Link>
      </div>
    </div>
  </footer>
);
