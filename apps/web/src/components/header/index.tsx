'use client';
import { MenuToggleIcon } from '@/components/menu-toggle-icon';
import { useScroll } from '@/components/sidebar/use-scroll';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@repo/i18n';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const { t } = useTranslation();

  const links = [
    {
      label: t('features'),
      href: '#',
    },
    {
      label: t('pricing'),
      href: '#',
    },
    {
      label: t('about'),
      href: '#',
    },
  ];

  React.useEffect(() => {
    if (open) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll
      document.body.style.overflow = '';
    }

    // Cleanup when component unmounts (important for Next.js)
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:transition-all md:ease-out',
        {
          'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border rounded-b-md backdrop-blur-lg md:max-w-4xl md:shadow':
            scrolled && !open,
          'bg-background/90': open,
        },
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          },
        )}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={24}
          height={24 * 1.1298535964}
          style={{ height: '100%', objectFit: 'contain', aspectRatio: '1/1' }}
          className="pointer-events-none select-none dark:invert"
        />
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link, i) => (
            <a key={i} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
              {link.label}
            </a>
          ))}
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)} className="md:hidden">
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div
        className={cn(
          'bg-background/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-4',
          )}
        >
          <div className="grid gap-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start')}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              {t('signIn')}
            </Button>
            <Button className="w-full">{t('getStarted')}</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
