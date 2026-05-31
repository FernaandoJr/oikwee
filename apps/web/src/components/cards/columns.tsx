'use client';

import { Badge } from '@/components/ui/badge';
import { createActionsColumn, createColumn } from '@/lib/tableColumns';
import type { ColumnDef } from '@tanstack/react-table';
import { CardRowActions } from './list/rowActions';
import type { CreditCard } from './types';
import { CARD_STATUS_LABELS } from './types';

interface ColumnOptions {
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function cardColumns(
  { onDelete, isDeleting }: ColumnOptions,
  t: (key: string) => string,
): ColumnDef<CreditCard>[] {
  return [
    createActionsColumn((card) => (
      <CardRowActions card={card} onDelete={onDelete} isDeleting={isDeleting} />
    )),
    createColumn<CreditCard>({
      id: 'name',
      accessorKey: 'name',
      label: t('name'),
      cell: (c) => <span className="font-medium">{c.name}</span>,
      meta: { variant: 'text' },
      enableColumnFilter: true,
      enableSorting: true,
    }),
    createColumn<CreditCard>({
      id: 'bank',
      accessorKey: 'bank',
      label: t('bank'),
      cell: (c) => <span className="text-muted-foreground">{c.bank}</span>,
      meta: { variant: 'text' },
      enableColumnFilter: true,
      enableSorting: true,
    }),
    createColumn<CreditCard>({
      id: 'closingDay',
      accessorKey: 'closingDay',
      label: t('closingDay'),
      cell: (c) => <span className="text-sm">{t('day')} {c.closingDay}</span>,
      enableSorting: true,
    }),
    createColumn<CreditCard>({
      id: 'dueDay',
      accessorKey: 'dueDay',
      label: t('cardDueDay'),
      cell: (c) => <span className="text-sm">{t('day')} {c.dueDay}</span>,
      enableSorting: true,
    }),
    createColumn<CreditCard>({
      id: 'status',
      accessorKey: 'status',
      label: t('status'),
      cell: (c) => (
        <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>
          {CARD_STATUS_LABELS[c.status] ?? c.status}
        </Badge>
      ),
      meta: {
        variant: 'multiSelect',
        options: Object.entries(CARD_STATUS_LABELS).map(([v, l]) => ({ label: l, value: v })),
      },
      enableColumnFilter: true,
      enableSorting: true,
    }),
  ];
}
