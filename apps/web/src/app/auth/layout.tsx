'use client';

import { Header } from '@/components/header';
import { useUser } from '@/auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div>Redirecting to dashboard...</div>;
  }
  return (
    <div className="">
      <Header disableSticky hideAuthButtons />
      {children}
    </div>
  );
}
