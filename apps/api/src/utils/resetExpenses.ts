import { ObjectId } from 'mongodb';
import { db } from '../db/mongo.js';

type ResetCandidate = {
  _id: ObjectId;
  type: string;
  isPaid: boolean;
  dueDay?: number;
  creditCardId?: string;
  lastResetAt?: string;
};

export async function resetExpiredPayments(
  userId: string,
  expenses: ResetCandidate[],
): Promise<Set<string>> {
  const now = new Date();

  const subscriptions = expenses.filter(
    (e) => e.type === 'subscription' && e.isPaid,
  );

  if (subscriptions.length === 0) return new Set();

  const cardIds = [
    ...new Set(
      subscriptions
        .filter((e) => e.creditCardId)
        .map((e) => e.creditCardId as string),
    ),
  ];

  const cards =
    cardIds.length > 0
      ? await db
          .collection('card')
          .find({
            _id: { $in: cardIds.map((id) => new ObjectId(id)) },
            userId,
          })
          .toArray()
      : [];

  const cardClosingDays = new Map(
    cards.map((c) => [c._id.toString(), c.closingDay as number]),
  );

  const toReset: ObjectId[] = [];

  for (const expense of subscriptions) {
    const billingDay = expense.creditCardId
      ? (cardClosingDays.get(expense.creditCardId) ?? expense.dueDay)
      : expense.dueDay;

    if (!billingDay) continue;

    const lastClosingDate = getLastClosingDate(now, billingDay);

    if (
      !expense.lastResetAt ||
      new Date(expense.lastResetAt) < lastClosingDate
    ) {
      toReset.push(expense._id);
    }
  }

  if (toReset.length > 0) {
    await db.collection('expense').updateMany(
      { _id: { $in: toReset }, userId },
      {
        $set: {
          isPaid: false,
          lastResetAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      },
    );
  }

  return new Set(toReset.map((id) => id.toString()));
}

function getLastClosingDate(now: Date, billingDay: number): Date {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  if (day >= billingDay) {
    return new Date(year, month, billingDay);
  }
  return new Date(year, month - 1, billingDay);
}
