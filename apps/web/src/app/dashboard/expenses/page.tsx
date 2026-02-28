import { AppSidebar } from '@/components/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { ExpensesTable, type Expense } from '@/components/expenses/table';

async function getData(): Promise<Expense[]> {
  return [
    {
      id: '1',
      amount: 150.5,
      category: 'Alimentação',
      date: '2025-02-25',
      description: 'Supermercado',
      isPaid: true,
    },
    {
      id: '2',
      amount: 89.9,
      category: 'Transporte',
      date: '2025-02-24',
      description: 'Combustível',
      isPaid: false,
    },
    {
      id: '3',
      amount: 1200,
      category: 'Moradia',
      date: '2025-02-01',
      description: 'Aluguel',
      isPaid: true,
    },
    {
      id: '4',
      amount: 45,
      category: 'Lazer',
      date: '2025-02-23',
      description: 'Streaming',
      isPaid: true,
    },
    {
      id: '5',
      amount: 320,
      category: 'Saúde',
      date: '2025-02-20',
      description: 'Consulta',
      isPaid: false,
    },
    {
      id: '6',
      amount: 55.8,
      category: 'Alimentação',
      date: '2025-02-22',
      description: 'Restaurante',
      isPaid: false,
    },
  ];
}

export default async function ExpensesPage() {
  const data = await getData();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Despesas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-6">
          <h1 className="mb-6 text-2xl font-semibold">Despesas</h1>
          <ExpensesTable data={data} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
