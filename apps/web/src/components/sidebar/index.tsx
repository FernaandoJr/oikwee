'use client';

import { NavBrand } from '@/components/sidebar/navBrand';
import { NavMain } from '@/components/sidebar/navMain';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useTranslation } from '@repo/i18n';
import { CreditCard, Receipt } from 'lucide-react';
import { ComponentProps, useMemo } from 'react';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  const navMain = useMemo(() => [
    { title: t('expenses'), url: '/dashboard/expenses', icon: Receipt },
    { title: t('cards'), url: '/dashboard/cards', icon: CreditCard },
  ], [t]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <NavBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={t('dashboard')} />
      </SidebarContent>
    </Sidebar>
  );
}
