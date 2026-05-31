export type { CreditCard, CardStatus } from '@oikwee/domains/cards';
export { cardSchema, CARD_STATUSES } from '@oikwee/domains/cards';

export const CARD_STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};
