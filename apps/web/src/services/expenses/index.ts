import { AxiosInstance } from 'axios';
import { apiClient } from '../api';
import { HttpClient } from '../http-client';
import { Expense, IExpensesService } from './types';

export class ExpensesService
  extends HttpClient<Expense>
  implements IExpensesService
{
  constructor(http: AxiosInstance, version: string, baseURL: string) {
    super(http, version, baseURL);
  }
}

export const expensesService = new ExpensesService(
  apiClient,
  'v1',
  '/expenses',
);
