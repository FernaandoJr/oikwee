'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { createActionsColumn, createColumn } from '@/lib/tableColumns';
import type { ColumnDef } from '@tanstack/react-table';
import { Tag } from 'lucide-react';
import { ExpenseRowActions } from './list/rowActions';
import type { IExpenseComplete } from './types';
import {
  CATEGORIES,
  EXPENSE_STATUS_LABELS,
  RECURRENCE_INTERVAL_LABELS,
} from './types';

interface ColumnOptions {
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onTogglePaid: (id: string, isPaid: boolean) => void;
  onAdvance: (expense: IExpenseComplete) => void;
}

export function expenseColumns(
  { onDelete, isDeleting, onTogglePaid, onAdvance }: ColumnOptions,
  t: (key: string) => string,
): ColumnDef<IExpenseComplete>[] {
  return [
    createActionsColumn((expense) => (
      <ExpenseRowActions
        expense={expense}
        onDelete={onDelete}
        isDeleting={isDeleting}
        onAdvance={onAdvance}
      />
    )),
    {
      id: 'isPaid',
      accessorKey: 'isPaid',
      size: 0,
      header: ({ column }) => (
        <div className="flex justify-center">
          <DataTableColumnHeader column={column} label={t('paid')} />
        </div>
      ),
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <div
            className="flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={row.getValue('isPaid')}
              onCheckedChange={(checked) =>
                expense.id && onTogglePaid(expense.id, !!checked)
              }
              aria-label={row.getValue('isPaid') ? t('paid') : t('markAsUnpaid')}
            />
          </div>
        );
      },
      meta: { label: t('paid'), variant: 'boolean' },
      enableColumnFilter: true,
      enableSorting: true,
    },
    createColumn<IExpenseComplete>({
      id: 'name',
      accessorKey: 'name',
      label: t('name'),
      cell: (e) => <span className="font-medium">{e.name}</span>,
      meta: { variant: 'text' },
      enableColumnFilter: true,
      enableSorting: true,
    }),
    createColumn<IExpenseComplete>({
      id: 'amount',
      accessorKey: 'amount',
      label: t('amountLabel'),
      cell: (e) => (
        <span className="font-medium">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(e.amount)}
        </span>
      ),
      meta: { variant: 'range' },
      enableSorting: true,
    }),
    createColumn<IExpenseComplete>({
      id: 'category',
      accessorKey: 'category',
      label: t('category'),
      cell: (e) => <Badge variant="outline" className="capitalize">{e.category}</Badge>,
      meta: {
        variant: 'multiSelect',
        icon: Tag,
        options: CATEGORIES.map((c) => ({ label: c, value: c })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    }),
    createColumn<IExpenseComplete>({
      id: 'progress',
      label: t('recurrenceInterval'),
      cell: (e) => {
        if (e.type === 'installment') {
          const paid = e.installmentsPaid ?? 0;
          const total = e.installmentsTotal ?? 0;
          return (
            <div className="flex min-w-[80px] flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs">{paid}/{total}</span>
              <Progress value={total > 0 ? (paid / total) * 100 : 0} className="h-1.5" />
            </div>
          );
        }
        return (
          <Badge variant="outline" className="capitalize">
            {RECURRENCE_INTERVAL_LABELS[e.recurrenceInterval ?? ''] ?? '—'}
          </Badge>
        );
      },
      enableSorting: false,
    }),
    createColumn<IExpenseComplete>({
      id: 'dueDay',
      accessorKey: 'dueDay',
      label: t('day'),
      cell: (e) => (
        <span className="text-muted-foreground text-sm">
          {e.dueDay ? `${t('day')} ${e.dueDay}` : '—'}
        </span>
      ),
      enableSorting: true,
    }),
    createColumn<IExpenseComplete>({
      id: 'status',
      accessorKey: 'status',
      label: t('status'),
      cell: (e) => {
        const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
          active: 'default',
          paused: 'secondary',
          cancelled: 'destructive',
          completed: 'outline',
        };
        return (
          <Badge variant={variantMap[e.status] ?? 'secondary'}>
            {EXPENSE_STATUS_LABELS[e.status] ?? e.status}
          </Badge>
        );
      },
      meta: {
        variant: 'multiSelect',
        options: Object.entries(EXPENSE_STATUS_LABELS).map(([v, l]) => ({ label: l, value: v })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    }),
  ];
}
