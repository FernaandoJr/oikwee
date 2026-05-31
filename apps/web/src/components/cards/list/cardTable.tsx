'use client';
'use no memo';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/useDataTable';
import { useTranslation } from '@repo/i18n';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { cardColumns } from '../columns';
import type { CreditCard } from '../types';

interface CardTableProps {
  data: CreditCard[];
  pageCount: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function CardTable({ data, pageCount, onDelete, isDeleting }: CardTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const columns = React.useMemo(
    () => cardColumns({ onDelete, isDeleting }, t),
    [t, onDelete, isDeleting],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    getRowId: (row) => row.id ?? '',
    initialState: {
      sorting: [{ id: 'name', desc: false }],
      columnPinning: { left: ['actions'] },
    },
  });

  const handleRowClick = (card: CreditCard) => {
    router.push(`/dashboard/cards/edit/${card.id}`);
  };

  return (
    <DataTable table={table} onRowClick={handleRowClick}>
      <DataTableAdvancedToolbar
        table={table}
        actions={
          <Button size="sm" onClick={() => router.push('/dashboard/cards/new')}>
            <Plus />
            {t('new')}
          </Button>
        }
      />
    </DataTable>
  );
}
