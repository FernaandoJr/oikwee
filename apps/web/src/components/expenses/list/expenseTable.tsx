'use client';
'use no memo';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/useDataTable';
import { useTranslation } from '@repo/i18n';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { expenseColumns } from '../columns';
import type { IExpenseComplete } from '../types';
import { AdvanceDialog } from './AdvanceDialog';

interface ExpenseTableProps {
  data: IExpenseComplete[];
  hasMore: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  limit: number;
  onLimitChange: (n: number) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onTogglePaid: (id: string, isPaid: boolean) => void;
  advancingExpense: IExpenseComplete | null;
  onSetAdvancingExpense: (expense: IExpenseComplete | null) => void;
  onAdvanceInstallment: (id: string, count: number, amount: number) => void;
  isAdvancing: boolean;
}

export function ExpenseTable({
  data,
  hasMore,
  hasPrev,
  onNext,
  onPrev,
  limit,
  onLimitChange,
  onDelete,
  isDeleting,
  onTogglePaid,
  advancingExpense,
  onSetAdvancingExpense,
  onAdvanceInstallment,
  isAdvancing,
}: ExpenseTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleRowClick = (expense: IExpenseComplete) => {
    router.push(`/dashboard/expenses/edit/${expense.id}`);
  };

  const columns = React.useMemo(
    () =>
      expenseColumns(
        { onDelete, isDeleting, onTogglePaid, onAdvance: onSetAdvancingExpense },
        t,
      ),
    [t, onDelete, isDeleting, onTogglePaid, onSetAdvancingExpense],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: -1,
    getRowId: (row) => row.id ?? '',
    initialState: {
      sorting: [{ id: 'name', desc: false }],
      columnPinning: { left: ['actions'] },
    },
  });

  return (
    <>
      <DataTable table={table} onRowClick={handleRowClick}>
        <DataTableAdvancedToolbar
          table={table}
          actions={
            <Button size="sm" onClick={() => router.push('/dashboard/expenses/new')}>
              <Plus />
              {t('new')}
            </Button>
          }
        />
      </DataTable>

      <DataTablePagination
        hasNext={hasMore}
        hasPrev={hasPrev}
        onNext={onNext}
        onPrev={onPrev}
        limit={limit}
        onLimitChange={onLimitChange}
      />

      <AdvanceDialog
        expense={advancingExpense}
        onClose={() => onSetAdvancingExpense(null)}
        onAdvance={onAdvanceInstallment}
        isAdvancing={isAdvancing}
      />
    </>
  );
}
