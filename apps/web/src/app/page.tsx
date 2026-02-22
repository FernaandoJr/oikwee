'use client';
import { AboutSection } from '@/components/about-section';
import { BentoGrid } from '@/components/bento-grid';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { useTranslation } from '@repo/i18n';
import { Fragment } from 'react/jsx-runtime';

export default function Home() {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Header forceBlur />
      <HeroSection />
      <AboutSection />
      <div className="container mx-auto flex flex-col gap-4 py-10">
        <span className="text-center text-2xl font-bold">{t('features')}</span>
        <BentoGrid />
      </div>
    </Fragment>
  );
}
