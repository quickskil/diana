import type { Metadata } from 'next';
import RegisterView from './register-view';

export const metadata: Metadata = {
  title: 'Create your Business Booster account',
  description: 'Set up access to the client portal and onboarding workspace.'
};

export default function RegisterPage() {
  return <RegisterView />;
}
