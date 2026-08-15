import React from 'react';

function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className='min-h-screen bg-background'>{children}</div>;
}

export default DashboardLayout;
