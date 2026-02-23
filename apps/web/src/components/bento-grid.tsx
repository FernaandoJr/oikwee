'use client';

import { featuresItems, type BentoFeature } from '@/constants/features';
import { cn } from '@/lib/utils';
import { useTranslation } from '@repo/i18n';

export type BentoItem = BentoFeature;

interface BentoGridProps {
  items?: BentoItem[];
}

function BentoGrid({ items = featuresItems }: BentoGridProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'group relative overflow-hidden rounded-xl p-4 transition-all duration-300',
            'border-border bg-card border',
            'will-change-transform hover:-translate-y-0.5 hover:shadow-sm',
            item.colSpan || 'col-span-1',
            item.colSpan === 2 ? 'md:col-span-2' : '',
            {
              '-translate-y-0.5 shadow-sm': item.hasPersistentHover,
            },
          )}
        >
          <div
            className={`absolute inset-0 ${
              item.hasPersistentHover
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            } transition-opacity duration-300`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--color-foreground)_2%,transparent)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300">
                {item.icon}
              </div>
              <span
                className={cn(
                  'rounded-lg px-2 py-1 text-xs font-medium backdrop-blur-sm',
                  'bg-muted text-muted-foreground',
                  'group-hover:bg-accent transition-colors duration-300',
                )}
              >
                {item.status ? t(item.status) : t('active')}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-foreground text-[15px] font-medium tracking-tight">
                {t(item.title)}
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  {item.meta ? t(item.meta) : ''}
                </span>
              </h3>
              <p className="text-muted-foreground text-sm leading-snug font-[425]">
                {t(item.description)}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                {item.tags?.map((tagKey, i) => (
                  <span
                    key={i}
                    className="bg-muted hover:bg-accent rounded-md px-2 py-1 backdrop-blur-sm transition-all duration-200"
                  >
                    #{t(tagKey)}
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
                {item.cta ? t(item.cta) : ''}
              </span>
            </div>
          </div>

          <div
            className={`via-border absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent to-transparent p-px ${
              item.hasPersistentHover
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            } transition-opacity duration-300`}
          />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
