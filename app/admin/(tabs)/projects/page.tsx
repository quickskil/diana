import type { Metadata } from 'next';
import ProjectsDashboard from './projects-dashboard';

export const metadata: Metadata = {
  title: 'Admin — Projects',
  description: 'Visualise onboarding progress and delivery pipelines across every client.'
};

export default function ProjectsPage() {
  return <ProjectsDashboard />;
}

