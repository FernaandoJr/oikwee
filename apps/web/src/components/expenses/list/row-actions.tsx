'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFormContext } from '@/contexts/form-context';
import { expensesService } from '@/services/expenses';
import { Expense } from '@/services/expenses/types';
import { toast } from 'sonner';
import { expensesQueryKeys } from '../constants/query-keys';

export function ExpenseRowActions({ expense }: { expense: Expense }) {
  const queryClient = useQueryClient();
  const { openForm } = useFormContext();
  const mutation = useMutation({
    mutationFn: () => expensesService.delete(expense.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKeys.list() });
      toast.success('Despesa excluída com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir despesa');
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => openForm('expense', 'edit', expense)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={handleDelete}
          disabled={mutation.isPending}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
