import { IHttpClient } from '../http-client/types';

export type IExpensesService = IHttpClient<Expense>;

export type Expense = {
  id?: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  isPaid: boolean;
  recurrence: 1 | 2;
  recurrenceInterval?: 1 | 2 | 3;
  recurrenceGroupId?: string;
  paymentMethod?: string;
  dueDate?: string;
  status?: 1 | 2 | 3;
  createdAt?: string;
  updatedAt?: string;
};
