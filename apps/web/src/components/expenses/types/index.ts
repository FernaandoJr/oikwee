import type {
  Category,
  PaymentMethod,
  ExpenseType,
  RecurrenceInterval,
  ExpenseStatus,
} from '@oikwee/domains/expenses';

export type {
  Category,
  PaymentMethod,
  ExpenseType,
  RecurrenceInterval,
  ExpenseStatus,
} from '@oikwee/domains/expenses';

export {
  expenseSchema,
  CATEGORIES,
  PAYMENT_METHODS,
  EXPENSE_TYPES,
  RECURRENCE_INTERVALS,
  EXPENSE_STATUSES,
} from '@oikwee/domains/expenses';

export interface IExpenseComplete {
  id: string;
  name: string;
  amount: number;
  category: Category;
  type: ExpenseType;
  status: ExpenseStatus;
  startDate: string;
  isPaid: boolean;
  installmentsPaid: number;
  totalAmountPaid: number;
  recurrenceInterval?: RecurrenceInterval;
  installmentsTotal?: number;
  lastPaidAt?: string;
  lastResetAt?: string;
  creditCardId?: string;
  paymentMethod?: PaymentMethod;
  dueDay?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const RECURRENCE_INTERVAL_LABELS: Record<string, string> = {
  weekly: 'Semanal',
  monthly: 'Mensal',
  annual: 'Anual',
};

export const EXPENSE_STATUS_LABELS: Record<string, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
};

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  subscription: 'Assinatura',
  installment: 'Parcela',
};
