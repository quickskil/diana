import type { Metadata } from 'next';

import ProjectEditorView from '../project-editor-view';

interface ProjectWorkspacePageProps {
  params: Promise<{ projectId: string }>;
}

export const metadata: Metadata = {
  title: 'Project workspace',
  description: 'Edit onboarding details for a specific launch project.'
};

export default async function ProjectWorkspacePage({ params }: ProjectWorkspacePageProps) {
  const { projectId: rawProjectId } = await params;
  const projectId = rawProjectId === 'new' ? null : rawProjectId;
  return <ProjectEditorView projectId={projectId} />;
}
