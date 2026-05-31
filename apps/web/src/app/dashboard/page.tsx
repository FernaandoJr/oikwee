import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-2">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
    </header>
  );
}
