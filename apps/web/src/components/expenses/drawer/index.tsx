'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type { Expense } from '@/services/expenses/types';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { ExpenseFormHandler } from './handler';

const NEW_EXPENSE_FORM_ID = 'new-expense-form';

interface ExpensesDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEdit?: boolean;
  expense?: Expense | null;
  trigger?: React.ReactNode;
}

export function ExpensesDrawer({
  open: controlledOpen,
  onOpenChange,
  isEdit = false,
  expense = null,
  trigger,
}: ExpensesDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      {!isControlled &&
        (trigger ? (
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        ) : (
          <DrawerTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Nova despesa
            </Button>
          </DrawerTrigger>
        ))}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEdit ? 'Editar despesa' : 'Nova despesa'}</DrawerTitle>
        </DrawerHeader>
        <ExpenseFormHandler
          formId={NEW_EXPENSE_FORM_ID}
          isEdit={isEdit}
          expense={expense}
          onSuccess={handleClose}
        />
        <DrawerFooter>
          <Button type="submit" form={NEW_EXPENSE_FORM_ID}>
            {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
