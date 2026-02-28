'use client';

import { type Expense, columns } from './columns';
import { DataTable } from './data-table';

export type { Expense };

interface ExpensesTableProps {
  data: Expense[];
}

export function ExpensesTable({ data }: ExpensesTableProps) {
  return <DataTable columns={columns} data={data} />;
}
