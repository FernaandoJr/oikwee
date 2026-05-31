import { cardSchema } from '@oikwee/domains/cards';

export const cardFormSchema = cardSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();
