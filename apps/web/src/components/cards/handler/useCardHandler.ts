import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardFormSchema } from '../schema';
import { cardsQueryKeys, cardsService } from '../services';
import { type CreditCard } from '../types';

const defaultFormValues: Partial<CreditCard> = {
  name: '',
  bank: '',
  description: '',
  closingDay: undefined,
  dueDay: undefined,
  status: 'active',
};

interface UseCardHandlerProps {
  isEdit: boolean;
  card?: CreditCard;
}

export function useCardHandler({ isEdit, card }: UseCardHandlerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<Partial<CreditCard>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: isEdit && card ? card : defaultFormValues,
  });

  const createMutation = useMutation({
    mutationFn: (values: Partial<CreditCard>) =>
      cardsService.create(values as CreditCard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsQueryKeys.list() });
      router.back();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<CreditCard> }) =>
      cardsService.patch(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsQueryKeys.list() });
      router.back();
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && card?.id) {
      updateMutation.mutate({ id: card.id, values });
    } else {
      createMutation.mutate(values);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
