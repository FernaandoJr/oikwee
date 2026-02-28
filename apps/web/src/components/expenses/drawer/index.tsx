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
import { Plus } from 'lucide-react';
import * as React from 'react';
import { NewExpenseForm } from './new-expense-form';

const NEW_EXPENSE_FORM_ID = '';

export function ExpensesDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nova despesa
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nova despesa</DrawerTitle>
        </DrawerHeader>
        <NewExpenseForm
          formId="new-expense-form"
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
        <DrawerFooter>
          <Button type="submit" form="new-expense-form">
            Adicionar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
