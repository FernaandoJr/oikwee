'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const sizeClasses = {
  xs: { bar: 'h-3 w-0.5', gap: 'space-x-0.5' },
  sm: { bar: 'h-4 w-1', gap: 'space-x-0.5' },
  md: { bar: 'h-8 w-2', gap: 'space-x-1' },
  lg: { bar: 'h-12 w-3', gap: 'space-x-1.5' },
} as const;

export interface LoaderProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  containerClassName?: string;
}

export default function Loader({
  size = 'md',
  className = 'bg-primary',
  containerClassName,
}: LoaderProps) {
  const { bar, gap } = sizeClasses[size];
  return (
    <div
      className={cn(
        'user-select-none flex items-center justify-center select-none',
        gap,
        containerClassName,
      )}
    >
      {[...Array(7)].map((_, index) => (
        <motion.div
          key={index}
          className={cn('rounded-full', bar, className)}
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            scaleX: [1, 0.8, 1],
            translateY: ['0%', '-15%', '0%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}
