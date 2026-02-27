'use client';

import { heroImageSrc } from '@/auth';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Header } from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageDithering } from '@paper-design/shaders-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'callback') {
      toast.error('Falha no retorno do login. Tente novamente.');
      router.replace('/auth/sign-in');
    }
  }, [searchParams, router]);

  return (
    <Fragment>
      <Header disableSticky hideAuthButtons />
      <div className="font-geist flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden md:flex-row">
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex min-h-full w-full flex-col items-center justify-center md:flex-row">
            <section className="flex flex-1 items-center justify-center p-8">
              <div className="w-full max-w-md">
                <SignInForm />
              </div>
            </section>

            {heroImageSrc && (
              <section className="relative hidden flex-1 p-4 md:block lg:p-8">
                <ImageDithering
                  image={heroImageSrc}
                  className="animate-slide-right animate-delay-300 h-[calc(100dvh-12rem)] rounded-lg"
                  fit="cover"
                  originalColors
                  type="8x8"
                  size={2}
                  colorSteps={7}
                />
              </section>
            )}
          </div>
        </ScrollArea>
      </div>
    </Fragment>
  );
}
