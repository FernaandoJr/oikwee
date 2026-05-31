"use client";
"use no memo";

import type { Table } from "@tanstack/react-table";
import type * as React from "react";

import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { cn } from "@/lib/utils";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
  actions?: React.ReactNode;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  actions,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn("flex w-full items-center justify-between p-1", className)}
      {...props}
    >
      <div className="flex items-center">
        <DataTableViewOptions table={table} align="start" buttonClassName="rounded-r-none" />
        <DataTableFilterList table={table} buttonClassName="rounded-none -ml-px relative overflow-visible" />
        <DataTableSortList table={table} buttonClassName="rounded-l-none -ml-px relative overflow-visible" />
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
