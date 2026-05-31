import { CardHandler } from '@/components/cards/handler';

export default function NewCardPage() {
  return (
    <div className="container mx-auto p-4">
      <CardHandler isEdit={false} />
    </div>
  );
}
