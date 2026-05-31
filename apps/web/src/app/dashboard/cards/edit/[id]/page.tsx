'use client';

import { CardHandler } from '@/components/cards/handler';
import { cardsQueryKeys, cardsService } from '@/components/cards/services';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

export default function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: card, isLoading } = useQuery({
    queryKey: cardsQueryKeys.item(id),
    queryFn: () => cardsService.getOne(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="container mx-auto p-4 text-destructive">
        Cartão não encontrado.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <CardHandler isEdit defaultValues={card} />
    </div>
  );
}
