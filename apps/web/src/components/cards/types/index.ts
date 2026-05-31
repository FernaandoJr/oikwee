export type {
  CreditCard,
  CreateCardInput,
  UpdateCardInput,
  CardStatus,
} from '@oikwee/domains/cards';

export {
  cardSchema,
  createCardSchema,
  updateCardSchema,
  CARD_STATUSES,
} from '@oikwee/domains/cards';

export const CARD_STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};
