import { apiClient } from '@/services/api';
import { HttpClient } from '@/services/httpClient';
import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from '../types';

class ExpensesService extends HttpClient<
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput
> {
  constructor() {
    super(apiClient, 'v1', '/expenses');
  }
}

export const expensesService = new ExpensesService();
