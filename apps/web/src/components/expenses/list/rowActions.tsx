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
import type { IExpenseComplete } from '../types';

interface ExpenseRowActionsProps {
  expense: IExpenseComplete;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onAdvance: (expense: IExpenseComplete) => void;
}

export function ExpenseRowActions({
  expense,
  onDelete,
  isDeleting,
  onAdvance,
}: ExpenseRowActionsProps) {
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
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/expenses/edit/${expense.id}`)}
        >
          {t('edit')}
        </DropdownMenuItem>
        {expense.type === 'installment' && expense.status !== 'completed' && (
          <DropdownMenuItem onClick={() => onAdvance(expense)}>
            {t('advanceInstallment')}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => expense.id && onDelete(expense.id)}
          disabled={isDeleting}
        >
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
