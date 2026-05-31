import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodV4Resolver } from '@/components/expenses/lib/resolver';
import { z } from 'zod';
import { cardsQueryKeys, cardsService } from '../services';
import {
  createCardSchema,
  updateCardSchema,
  type CreateCardInput,
  type CreditCard,
  type UpdateCardInput,
} from '../types';

export type CardFormValues = z.infer<typeof createCardSchema>;

const defaultFormValues: Partial<CardFormValues> = {
  name: '',
  bank: '',
  description: '',
  closingDay: undefined,
  dueDay: undefined,
  status: 'active',
};

function cardToFormValues(card: CreditCard): Partial<CardFormValues> {
  return {
    name: card.name,
    bank: card.bank,
    description: card.description ?? '',
    closingDay: card.closingDay,
    dueDay: card.dueDay,
    status: card.status,
  };
}

interface UseCardHandlerProps {
  isEdit: boolean;
  card?: CreditCard;
}

export function useCardHandler({ isEdit, card }: UseCardHandlerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const schema = isEdit ? updateCardSchema : createCardSchema;

  const form = useForm<CardFormValues>({
    resolver: zodV4Resolver(schema as z.ZodType<CardFormValues>),
    defaultValues: isEdit && card ? cardToFormValues(card) : defaultFormValues,
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateCardInput) => cardsService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardsQueryKeys.list() });
      router.back();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UpdateCardInput }) =>
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
      createMutation.mutate(values as CreateCardInput);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
