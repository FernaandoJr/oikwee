'use client';

import { DataTable } from './data-table';
import { type Expense, columns } from './columns';

export type { Expense };

interface ExpensesTableProps {
  data: Expense[];
}

export function ExpensesTable({ data }: ExpensesTableProps) {
  return <DataTable columns={columns} data={data} />;
}
