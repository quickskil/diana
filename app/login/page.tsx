import type { Metadata } from 'next';
import LoginView from './login-view';

export const metadata: Metadata = {
  title: 'Sign in to Business Booster',
  description: 'Access your dashboard, onboarding status, and booked Cal.com events.'
};

export default function LoginPage() {
  return <LoginView />;
}
