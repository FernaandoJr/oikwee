'use client';
'use no memo';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { expenseColumns } from '../lib/columns';
import type { Expense } from '../types';

interface ExpenseTableProps {
  data: Expense[];
  pageCount: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ExpenseTable({
  data,
  pageCount,
  onDelete,
  isDeleting,
}: ExpenseTableProps) {
  const router = useRouter();

  const columns = React.useMemo(
    () => expenseColumns({ onDelete, isDeleting }),
    [onDelete, isDeleting],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: 'date', desc: true }],
      columnPinning: { right: ['actions'] },
    },
  });

  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table}>
        <DataTableFilterList table={table} />
        <DataTableSortList table={table} />
        <Button
          size="sm"
          onClick={() => router.push('/dashboard/expenses/new')}
          className="ml-auto"
        >
          <Plus className="size-4" />
          Nova despesa
        </Button>
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
