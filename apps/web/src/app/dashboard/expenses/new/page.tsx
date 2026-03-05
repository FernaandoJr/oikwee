import { ExpenseHandler } from '@/components/expenses/handler';

export default function NewExpensePage() {
  return (
    <div className="container mx-auto p-4">
      <ExpenseHandler isEdit={false} />
    </div>
  );
}
