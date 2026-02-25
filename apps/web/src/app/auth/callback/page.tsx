'use client';

import { setAccessToken } from '@/auth';
import Loader from '@/components/loader';
import { useTranslation } from '@repo/i18n';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthCallbackPage() {
  const { t } = useTranslation();
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader size="xs" />
      <p className="text-muted-foreground">{t('signingIn')}</p>
    </div>
  );
}
