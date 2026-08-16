import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboardNavbar';
import { auth } from '@/lib/auth';

async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <div className='flex min-h-svh flex-col bg-background'>
      <DashboardNavbar user={session.user} />
      <main className='flex-1'>{children}</main>
    </div>
  );
}

export default Layout;
