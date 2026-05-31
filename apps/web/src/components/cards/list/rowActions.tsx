'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@repo/i18n';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { CreditCard } from '../types';

interface CardRowActionsProps {
  card: CreditCard;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function CardRowActions({ card, onDelete, isDeleting }: CardRowActionsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <span className="sr-only">{t('openMenu')}</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => router.push(`/dashboard/cards/edit/${card.id}`)}>
          {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => card.id && onDelete(card.id)}
          disabled={isDeleting}
        >
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
