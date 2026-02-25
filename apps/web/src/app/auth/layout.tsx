'use client';

import { useUser } from '@/auth';
import Loader from '@/components/loader';
import { useTranslation } from '@repo/i18n';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Loader size="xs" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </>
    );
  }

  if (user) {
    return (
      <>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Loader size="xs" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </>
    );
  }
  return children;
}
