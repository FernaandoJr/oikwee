import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarIcon, DollarSign, Tag, Text } from 'lucide-react';
import { ExpenseRowActions } from '../list/rowActions';
import type { Expense } from '../types';
import {
  CATEGORIES,
  EXPENSE_TYPE_LABELS,
  PAYMENT_METHODS,
  RECURRENCE_INTERVAL_LABELS,
} from './enums';

interface ColumnOptions {
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function expenseColumns({
  onDelete,
  isDeleting,
}: ColumnOptions): ColumnDef<Expense>[] {
  return [
    {
      id: 'isPaid',
      accessorKey: 'isPaid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Pago" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getValue('isPaid')}
            disabled
            aria-label={row.getValue('isPaid') ? 'Pago' : 'Não pago'}
          />
        </div>
      ),
      meta: {
        label: 'Pago',
        variant: 'boolean',
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Categoria" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.getValue('category')}
        </Badge>
      ),
      meta: {
        label: 'Categoria',
        variant: 'multiSelect',
        icon: Tag,
        options: CATEGORIES.map((c) => ({ label: c, value: c })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Descrição" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.getValue('description') ?? '—'}
        </div>
      ),
      meta: {
        label: 'Descrição',
        placeholder: 'Buscar descrição...',
        variant: 'text',
        icon: Text,
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'date',
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Data" />
      ),
      cell: ({ row }) => {
        const date = row.getValue<string>('date');
        return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '—'}</div>;
      },
      meta: {
        label: 'Data',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Valor" />
      ),
      cell: ({ row }) => {
        const amount = Number(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount);
        return (
          <div className="flex items-center justify-end gap-1 font-medium">
            <DollarSign className="text-muted-foreground size-3.5" />
            {formatted}
          </div>
        );
      },
      meta: {
        label: 'Valor',
        variant: 'range',
      },
      enableSorting: true,
    },
    {
      id: 'expenseType',
      accessorKey: 'expenseType',
      header: 'Tipo',
      cell: ({ row }) => {
        const expenseType = row.getValue<number>('expenseType');
        const interval = row.original.recurrenceInterval;
        const installments = row.original.installments;
        const typeLabel = EXPENSE_TYPE_LABELS[expenseType] ?? '—';
        const label =
          expenseType === 3 && interval != null
            ? `${typeLabel} (${RECURRENCE_INTERVAL_LABELS[interval] ?? ''})`
            : expenseType === 2 && installments != null
              ? `${typeLabel} (${installments}x)`
              : typeLabel;
        return (
          <Badge variant="outline" className="capitalize">
            {label}
          </Badge>
        );
      },
      enableSorting: false,
    },
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Pagamento" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[100px] truncate capitalize">
          {row.getValue('paymentMethod') ?? '—'}
        </div>
      ),
      meta: {
        label: 'Pagamento',
        variant: 'multiSelect',
        options: PAYMENT_METHODS.map((m) => ({ label: m, value: m })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: 'actions',
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <ExpenseRowActions
          expense={row.original}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ),
    },
  ];
}
