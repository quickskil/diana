import type { Metadata } from 'next';
import ProjectDetail from './project-detail';

export const metadata: Metadata = {
  title: 'Admin — Project detail'
};

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectDetail projectId={projectId} />;
}
