import { ExpenseHandler } from '@/components/expenses/handler';

export default function NewExpenseModal() {
  return <ExpenseHandler isEdit={false} />;
}
