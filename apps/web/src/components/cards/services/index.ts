import { apiClient } from '@/services/api';
import { HttpClient } from '@/services/httpClient';
import type { CreditCard } from '../types';

export const cardsQueryKeys = {
  item: (id: string) => ['card', id],
  list: () => ['cards'],
};

class CardsService extends HttpClient<CreditCard, Partial<CreditCard>, Partial<CreditCard>> {
  constructor() {
    super(apiClient, 'v1', '/cards');
  }
}

export const cardsService = new CardsService();
