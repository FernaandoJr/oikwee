import { apiClient } from '@/services/api';
import { HttpClient } from '@/services/httpClient';
import type {
  CreateCardInput,
  CreditCard,
  UpdateCardInput,
} from '../types';

export const cardsQueryKeys = {
  item: (id: string) => ['card', id],
  list: () => ['cards'],
};

class CardsService extends HttpClient<
  CreditCard,
  CreateCardInput,
  UpdateCardInput
> {
  constructor() {
    super(apiClient, 'v1', '/cards');
  }
}

export const cardsService = new CardsService();
