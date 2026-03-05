import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  RECURRENCE_INTERVAL_LABELS,
  RECURRENCE_LABELS,
} from '@/constants/expense-enums';
import { Expense } from '@/services/expenses/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { ExpenseRowActions } from '../list/row-actions';

export const expenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'isPaid',
    meta: { className: 'w-16' },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Pago
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
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
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Categoria
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.getValue('category')}
      </Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue('description') ?? '—'}
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Data
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : '—'}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-end"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Valor
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'recurrence',
    meta: { className: 'w-24' },
    header: 'Tipo',
    cell: ({ row }) => {
      const recurrence = row.getValue('recurrence') as number;
      const interval = row.original.recurrenceInterval;
      const recurrenceLabel = RECURRENCE_LABELS[recurrence] ?? '—';
      const label =
        recurrence === 2 && interval != null
          ? `${recurrenceLabel} (${RECURRENCE_INTERVAL_LABELS[interval] ?? ''})`
          : recurrenceLabel;
      return (
        <Badge variant="outline" className="capitalize">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Pagamento',
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate capitalize">
        {row.getValue('paymentMethod') ?? '—'}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ExpenseRowActions expense={row.original} />,
  },
];
