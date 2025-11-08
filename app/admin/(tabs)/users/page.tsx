import type { Metadata } from 'next';
import UserManagement from './user-management';

export const metadata: Metadata = {
  title: 'Admin — Users',
  description: 'Audit every account, role, and onboarding submission at a glance.'
};

export default function UsersPage() {
  return <UserManagement />;
}

