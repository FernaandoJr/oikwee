'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from '@repo/i18n';
import { CreditCard, LogOut, Moon, Receipt, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useMemo } from 'react';
import { useSignOut } from '@/auth';
import {
  MenuSearch,
  type MenuActionItem,
  type MenuOptionItem,
} from '@/components/sidebar/menuSearch';
import { UserMenu } from '@/components/dashboard/userMenu';

export function DashboardHeader() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { mutate: signOut } = useSignOut();

  const navMain = useMemo(
    () => [
      { title: t('expenses'), url: '/dashboard/expenses', icon: Receipt },
      { title: t('cards'), url: '/dashboard/cards', icon: CreditCard },
    ],
    [t],
  );

  const menuSearchItems = useMemo<MenuOptionItem[]>(
    () =>
      navMain.map((item) => ({
        label: item.title,
        path: item.url,
        icon: React.createElement(item.icon),
      })),
    [navMain],
  );

  const menuSearchActions = useMemo<MenuActionItem[]>(
    () => [
      {
        id: 'theme-toggle',
        label: t('toggleTheme'),
        icon:
          theme === 'light' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          ),
        keywords: ['tema', 'dark', 'light', 'escuro', 'claro', 'modo'],
        onSelect: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'logout',
        label: t('logout'),
        icon: <LogOut className="size-4" />,
        keywords: ['logout', 'sair', 'desconectar'],
        onSelect: () => signOut(),
      },
    ],
    [t, theme, setTheme, signOut],
  );

  return (
    <header className="flex items-center justify-between gap-2 border-b p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <MenuSearch
          items={menuSearchItems}
          actions={menuSearchActions}
          triggerClassName="w-48"
        />
      </div>
      <div className="flex items-center justify-end">
        <UserMenu />
      </div>
    </header>
  );
}
