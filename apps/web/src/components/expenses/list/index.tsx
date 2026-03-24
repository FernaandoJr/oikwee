'use client';
"use no memo";

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { ExpenseTable } from './expenseTable';
import { useExpenseList } from './useExpenseList';

export function ExpenseList() {
  const { data, pageCount, isLoading, deleteExpense, isDeleting } =
    useExpenseList();

  if (isLoading) {
    return <DataTableSkeleton columnCount={8} rowCount={10} />;
  }

  return (
    <ExpenseTable
      data={data}
      pageCount={pageCount}
      onDelete={deleteExpense}
      isDeleting={isDeleting}
    />
  );
}
