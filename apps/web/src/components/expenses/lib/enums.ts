export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
];

export const PAYMENT_METHODS = [
  'Dinheiro',
  'PIX',
  'Cartão de crédito',
  'Cartão de débito',
  'Boleto',
];

export const RECURRENCE_LABELS: Record<number, string> = {
  1: 'Única',
  2: 'Recorrente',
};

export const RECURRENCE_INTERVAL_LABELS: Record<number, string> = {
  1: 'Semanal',
  2: 'Mensal',
  3: 'Anual',
};

export const EXPENSE_STATUS_LABELS: Record<number, string> = {
  1: 'Rascunho',
  2: 'Confirmado',
  3: 'Cancelado',
};

export function getRecurrenceLabel(n: number): string {
  return RECURRENCE_LABELS[n] ?? '—';
}

export function getRecurrenceIntervalLabel(n: number): string {
  return RECURRENCE_INTERVAL_LABELS[n] ?? '—';
}

export function getExpenseStatusLabel(n: number): string {
  return EXPENSE_STATUS_LABELS[n] ?? '—';
}
