import { CardList } from '@/components/cards/list';
import { DashboardHeader } from '@/components/dashboard/header';

export default function CardsPage() {
  return (
    <>
      <DashboardHeader />
      <div className="container mx-auto p-4">
        <CardList />
      </div>
    </>
  );
}
