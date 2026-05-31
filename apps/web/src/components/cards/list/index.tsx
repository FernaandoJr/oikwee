'use client';
'use no memo';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { CardTable } from './cardTable';
import { useCardList } from './useCardList';

export function CardList() {
  const { data, pageCount, isLoading, deleteCard, isDeleting } = useCardList();

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} rowCount={5} />;
  }

  return (
    <CardTable
      data={data}
      pageCount={pageCount}
      onDelete={deleteCard}
      isDeleting={isDeleting}
    />
  );
}
