'use client';

import { CardHandler } from '@/components/cards/handler';
import { cardsQueryKeys, cardsService } from '@/components/cards/services';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

export default function EditCardModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: card, isLoading } = useQuery({
    queryKey: cardsQueryKeys.item(id),
    queryFn: () => cardsService.getOne(id),
  });

  if (isLoading || !card) return null;

  return <CardHandler isEdit defaultValues={card} />;
}
