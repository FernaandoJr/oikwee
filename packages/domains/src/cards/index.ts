import { z } from 'zod';

export const CARD_STATUSES = ['active', 'inactive'] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

export const cardSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  bank: z.string().min(1),
  description: z.string().optional(),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
  status: z.enum(CARD_STATUSES).default('active'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CreditCard = z.infer<typeof cardSchema>;
