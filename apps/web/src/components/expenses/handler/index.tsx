'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useRouter } from 'next/navigation';
import type { Expense } from '../types';
import { ExpenseForm } from './expense-form';
import { useExpenseHandler } from './use-expense-handler';

const EXPENSE_FORM_ID = 'expense-form';

interface ExpenseHandlerProps {
  isEdit: boolean;
  defaultValues?: Expense;
}

export function ExpenseHandler({ isEdit, defaultValues }: ExpenseHandlerProps) {
  const router = useRouter();
  const { form, onSubmit, isPending } = useExpenseHandler({
    isEdit,
    expense: defaultValues,
  });

  return (
    <Drawer open onOpenChange={() => router.back()} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? 'Editar despesa' : 'Nova despesa'}
          </DrawerTitle>
        </DrawerHeader>
        <ExpenseForm form={form} formId={EXPENSE_FORM_ID} onSubmit={onSubmit} />
        <DrawerFooter>
          <Button type="submit" form={EXPENSE_FORM_ID} disabled={isPending}>
            {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
