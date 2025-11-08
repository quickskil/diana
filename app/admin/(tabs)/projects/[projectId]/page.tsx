import type { Metadata } from 'next';
import ProjectDetail from './project-detail';

export const metadata: Metadata = {
  title: 'Admin — Project detail'
};

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  return <ProjectDetail projectId={params.projectId} />;
}
