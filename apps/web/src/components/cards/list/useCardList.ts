import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseAsInteger, useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { cardsQueryKeys, cardsService } from '../services';
import type { CreditCard } from '../types';

export function useCardList() {
  const queryClient = useQueryClient();

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const { data: allData = [], isLoading } = useQuery({
    queryKey: cardsQueryKeys.list(),
    queryFn: (): Promise<CreditCard[]> => cardsService.get(),
  });

  const pageCount = Math.max(1, Math.ceil(allData.length / perPage));
  const start = (page - 1) * perPage;
  const data = allData.slice(start, start + perPage);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cardsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsQueryKeys.list() });
      toast.success('Cartão excluído com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir cartão');
    },
  });

  return {
    data,
    pageCount,
    isLoading,
    deleteCard: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
  };
}
