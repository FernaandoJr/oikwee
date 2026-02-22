'use client';

import { Card } from '@/components/ui/card';
import { useTranslation } from '@repo/i18n';
import { CreditCard, Repeat, Wallet } from 'lucide-react';
import Image from 'next/image';

const iconSize = 'h-6 w-6';

const CARD_IMAGE_SRC = 'https://picsum.photos/400/300';

const cards = [
  {
    titleKey: 'aboutRecurringTitle',
    descriptionKey: 'aboutRecurringDescription',
    icon: <Repeat className={`${iconSize} text-foreground`} />,
  },
  {
    titleKey: 'aboutPaidTrackingTitle',
    descriptionKey: 'aboutPaidTrackingDescription',
    icon: <CreditCard className={`${iconSize} text-foreground`} />,
  },
  {
    titleKey: 'aboutControlTitle',
    descriptionKey: 'aboutControlDescription',
    icon: <Wallet className={`${iconSize} text-foreground`} />,
  },
] as const;

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-6xl space-y-4 text-center md:mb-16 lg:mb-24">
          <p className="text-primary text-sm font-medium uppercase">{t('aboutLabel')}</p>
          <h2 className="text-foreground text-2xl font-semibold md:text-3xl lg:text-4xl">
            {t('aboutTitle')}
          </h2>
          <p className="text-muted-foreground text-xl">{t('aboutSubtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-stretch lg:grid-cols-3">
          {cards.map(({ titleKey, descriptionKey, icon }) => (
            <div key={titleKey} className="h-full max-lg:last:col-span-full">
              <Card className="flex h-full flex-col gap-6 rounded-lg border py-6 shadow-none">
                <div className="flex flex-1 flex-col space-y-4 px-6">
                  <div className="relative h-50 w-full shrink-0 overflow-hidden">
                    <Image
                      src={CARD_IMAGE_SRC}
                      alt=""
                      width={400}
                      height={200}
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xl font-semibold">
                    {icon}
                    <span className="text-foreground">{t(titleKey)}</span>
                  </div>
                  <p className="text-muted-foreground mt-auto">{t(descriptionKey)}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
