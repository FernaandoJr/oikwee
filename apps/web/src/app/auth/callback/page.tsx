'use client';

import { setAccessToken } from '@/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? (() => {
            const hash = window.location.hash?.slice(1) || '';
            const params = new URLSearchParams(hash);
            return params.get('token') ?? null;
          })()
        : null;

    if (!token) {
      setStatus('error');
      return;
    }

    setAccessToken(token);
    setStatus('done');
    router.replace('/dashboard');
  }, [router]);

  if (status === 'error') {
    router.replace('/auth?error=callback');
    return null;
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
