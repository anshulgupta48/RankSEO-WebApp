import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/authCard';
import { SignUpForm } from '@/components/auth/signUpForm';

export const metadata: Metadata = {
  title: 'Create your account | RankSEO',
};

export default function SignUpPage() {
  return (
    <AuthCard
      title='Create your RankSEO account'
      description='Start researching keywords and AI brand visibility.'
    >
      <SignUpForm />
    </AuthCard>
  );
}
