import { DashboardHeader } from '@/components/dashboard/header';
import { ExpenseList } from '@/components/expenses/list';

export default function ExpensesPage() {
  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-4">
        <ExpenseList />
      </div>
    </>
  );
}
