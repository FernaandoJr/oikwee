'use client';

import {
  LayoutDashboard,
  LogOut,
  Moon,
  Receipt,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { useSignOut, useUser } from '@/auth';
import {
  MenuSearch,
  type MenuActionItem,
  type MenuOptionItem,
} from '@/components/sidebar/menu-search';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslation } from '@repo/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, useMemo } from 'react';

interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavMainItem[];
}

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: 'Despesas',
          url: '/dashboard/expenses',
          icon: Receipt,
        },
      ],
    },
    {
      title: 'Despesas',
      url: '/dashboard/expenses',
      icon: Receipt,
    },
  ],
  navSecondary: [] as { title: string; url: string; icon: LucideIcon }[],
};

function navMainToMenuItems(): MenuOptionItem[] {
  return data.navMain.map((item) => ({
    label: item.title,
    path: item.url,
    icon: React.createElement(item.icon),
    children: item.items?.map((sub) => ({
      label: sub.title,
      path: sub.url,
    })),
  }));
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user, isLoading } = useUser();
  const { theme, setTheme } = useTheme();
  const { mutate: signOut } = useSignOut();
  const menuSearchItems = useMemo(() => navMainToMenuItems(), []);

  const menuSearchActions = useMemo<MenuActionItem[]>(
    () => [
      {
        id: 'theme-toggle',
        label: 'Alternar modo',
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
        label: 'Sair',
        icon: <LogOut className="size-4" />,
        keywords: ['logout', 'sair', 'desconectar'],
        onSelect: () => signOut(),
      },
    ],
    [theme, setTheme, signOut],
  );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="select-none">
                <div className="bg-sidebar-secondary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo/flat_color.svg"
                    alt="Logo"
                    width={32}
                    height={32 * 1.1298535964}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t('oiKwee')}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Enterprise
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <MenuSearch items={menuSearchItems} actions={menuSearchActions} />
        <NavMain items={data.navMain} />
        {data.navSecondary.length > 0 && (
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.image ?? '',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
