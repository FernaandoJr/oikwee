import type { PaginatedResponse } from '@oikwee/domains/pagination';
import { apiClient } from '@/services/api';
import { HttpClient } from '@/services/httpClient';
import type { IExpenseComplete } from '../types';

export const expensesQueryKeys = {
  list: (cursor?: string, limit?: number) => ['expenses', cursor ?? 'first', limit ?? 20],
  item: (id: string) => ['expense', id],
};

class ExpensesService extends HttpClient<
  IExpenseComplete,
  Partial<IExpenseComplete>,
  Partial<IExpenseComplete>
> {
  constructor() {
    super(apiClient, 'v1', '/expenses');
  }

  async list(params?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<IExpenseComplete>> {
    const response = await this.http.get<PaginatedResponse<IExpenseComplete>>(this.baseURL, {
      params: {
        ...(params?.cursor ? { cursor: params.cursor } : {}),
        limit: params?.limit,
      },
    });
    return response.data;
  }

  async setPaid(id: string, isPaid: boolean): Promise<IExpenseComplete> {
    const response = await this.http.patch<IExpenseComplete>(
      `${this.baseURL}/${id}/pay`,
      { isPaid },
    );
    return response.data;
  }

  async advance(
    id: string,
    data: { count: number; amount: number },
  ): Promise<IExpenseComplete> {
    const response = await this.http.patch<IExpenseComplete>(
      `${this.baseURL}/${id}/advance`,
      data,
    );
    return response.data;
  }
}

export const expensesService = new ExpensesService();
