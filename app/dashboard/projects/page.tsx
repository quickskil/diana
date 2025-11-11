import type { Metadata } from 'next';

import ProjectEditorView from './project-editor-view';

export const metadata: Metadata = {
  title: 'Project workspace',
  description: 'Manage onboarding details for your launch projects.'
};

export default function ProjectWorkspaceIndexPage() {
  return <ProjectEditorView />;
}
