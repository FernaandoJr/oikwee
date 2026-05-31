'use client';
'use no memo';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { ExpenseTable } from './expenseTable';
import { useExpenseList } from './useExpenseList';

export function ExpenseList() {
  const {
    data,
    isLoading,
    hasMore,
    hasPrev,
    onNext,
    onPrev,
    limit,
    onLimitChange,
    deleteExpense,
    isDeleting,
    togglePaid,
    advancingExpense,
    setAdvancingExpense,
    advanceInstallment,
    isAdvancing,
  } = useExpenseList();

  if (isLoading) {
    return <DataTableSkeleton columnCount={8} rowCount={10} />;
  }

  return (
    <ExpenseTable
      data={data}
      hasMore={hasMore}
      hasPrev={hasPrev}
      onNext={onNext}
      onPrev={onPrev}
      limit={limit}
      onLimitChange={onLimitChange}
      onDelete={deleteExpense}
      isDeleting={isDeleting}
      onTogglePaid={togglePaid}
      advancingExpense={advancingExpense}
      onSetAdvancingExpense={setAdvancingExpense}
      onAdvanceInstallment={advanceInstallment}
      isAdvancing={isAdvancing}
    />
  );
}
