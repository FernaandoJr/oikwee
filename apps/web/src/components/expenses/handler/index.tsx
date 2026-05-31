'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@repo/i18n';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { IExpenseComplete } from '../types';
import { ExpenseForm } from './expenseForm';
import { useExpenseHandler } from './useExpenseHandler';

const EXPENSE_FORM_ID = 'expense-form';

interface ExpenseHandlerProps {
  isEdit: boolean;
  defaultValues?: IExpenseComplete;
}

export function ExpenseHandler({ isEdit, defaultValues }: ExpenseHandlerProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { form, onSubmit, isPending } = useExpenseHandler({
    isEdit,
    expense: defaultValues,
  });
  const closeHandler = useCallback(() => {
    const canGoBack =
      typeof window !== 'undefined' &&
      !!document.referrer &&
      document.referrer.startsWith(window.location.origin);

    if (canGoBack) {
      router.back();
      return;
    }

    router.push('/dashboard/expenses');
  }, [router]);

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) closeHandler();
      }}
      direction="right"
    >
      <DrawerContent>
        <DrawerHeader className="shrink-0">
          <DrawerTitle>
            {isEdit ? t('editExpense') : t('newExpense')}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex-1 min-h-0">
          <ExpenseForm form={form} formId={EXPENSE_FORM_ID} onSubmit={onSubmit} isEdit={isEdit} />
        </ScrollArea>
        <DrawerFooter className="flex-row">
          <Button type="submit" form={EXPENSE_FORM_ID} disabled={isPending}>
            {isEdit ? t('save') : t('add')}
          </Button>
          <Button type="button" variant="outline" onClick={closeHandler}>
            {t('cancel')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
