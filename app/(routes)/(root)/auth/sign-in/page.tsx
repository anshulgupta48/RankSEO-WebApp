import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/authCard';
import { SignInForm } from '@/components/auth/signInForm';

export const metadata: Metadata = {
  title: 'Sign in | RankSEO',
};

export default function SignInPage() {
  return (
    <AuthCard
      title='Welcome back'
      description='Sign in to continue to your SEO workspace.'
    >
      <SignInForm />
    </AuthCard>
  );
}
