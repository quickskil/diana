import type { Metadata } from 'next';

import ProjectEditorView from '../project-editor-view';

interface ProjectWorkspacePageProps {
  params: { projectId: string };
}

export const metadata: Metadata = {
  title: 'Project workspace',
  description: 'Edit onboarding details for a specific launch project.'
};

export default function ProjectWorkspacePage({ params }: ProjectWorkspacePageProps) {
  const projectId = params.projectId === 'new' ? null : params.projectId;
  return <ProjectEditorView projectId={projectId} />;
}
