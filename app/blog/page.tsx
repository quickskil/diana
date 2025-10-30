
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Blog', description: 'Playbooks and case studies.' };

export default function Page() {
  return (
    <main className="section">
      <div className="container space-y-6">
        <h1>Blog</h1>
        <p className="text-white/70">Coming soon: deep dives on funnels, ad creative, and AI voice agents.</p>
      </div>
    </main>
  );
}
