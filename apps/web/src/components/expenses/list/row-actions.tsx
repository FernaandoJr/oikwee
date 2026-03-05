'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import type { Expense } from '../types';

interface ExpenseRowActionsProps {
  expense: Expense;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ExpenseRowActions({
  expense,
  onDelete,
  isDeleting,
}: ExpenseRowActionsProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/expenses/edit/${expense.id}`)
          }
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => expense.id && onDelete(expense.id)}
          disabled={isDeleting}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
