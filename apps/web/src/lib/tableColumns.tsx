'use client';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { ColumnDef, ColumnMeta } from '@tanstack/react-table';
import type * as React from 'react';

interface CreateColumnOptions<T> {
  id: string;
  accessorKey?: keyof T & string;
  label: string;
  cell: (row: T) => React.ReactNode;
  size?: number;
  meta?: Omit<ColumnMeta<T, unknown>, 'label'> & { variant?: string; options?: unknown[] };
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
}

export function createColumn<T extends object>({
  id,
  accessorKey,
  label,
  cell,
  size,
  meta,
  enableColumnFilter,
  enableSorting,
}: CreateColumnOptions<T>): ColumnDef<T> {
  return {
    id,
    ...(accessorKey ? { accessorKey } : {}),
    size,
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} label={label} />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">{cell(row.original)}</div>
    ),
    meta: { label, ...meta } as ColumnMeta<T, unknown>,
    enableColumnFilter,
    enableSorting,
  };
}

export function createActionsColumn<T extends object>(
  renderActions: (row: T) => React.ReactNode,
): ColumnDef<T> {
  return {
    id: 'actions',
    size: 0,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-center">{renderActions(row.original)}</div>
    ),
  };
}
