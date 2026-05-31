'use client';

import {
  BadgeCheck,
  Bell,
  Check,
  ChevronsUpDown,
  Globe,
  Home,
  LogOut,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { useSignOut } from '@/auth';
import i18n, { useTranslation } from '@repo/i18n';
import Image from 'next/image';

function setLanguage(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  i18n.changeLanguage(locale);
}
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { avatarColorClasses } from '@/constants/avatar';
import { Facehash } from 'facehash';
import { useRouter } from 'next/navigation';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const router = useRouter();
  const { t, i18n: i18nCtx } = useTranslation();
  const lang = i18nCtx.language;

  const languages = [
    { name: 'ptBR', label: 'portuguese', image: '/pt-br.svg' },
    { name: 'enUS', label: 'english', image: '/en.svg' },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="flex h-8 w-8 items-center justify-center rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  <Facehash
                    enableBlink
                    name={user.name}
                    intensity3d="medium"
                    showInitial={false}
                    colorClasses={avatarColorClasses}
                  />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm select-none">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    <Facehash
                      enableBlink
                      name={user.name}
                      intensity3d="medium"
                      showInitial={false}
                      colorClasses={avatarColorClasses}
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/')}>
                <Home />
                {t('homePage')}
              </DropdownMenuItem>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  {t('account')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  {t('notifications')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon />
                {t('darkMode')}
                {theme === 'dark' && <Check className="ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun />
                {t('lightMode')}
                {theme === 'light' && <Check className="ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor />
                {t('systemMode')}
                {theme === 'system' && <Check className="ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Globe className="size-4" />
                  {t('languages')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {languages.map((l) => (
                    <DropdownMenuItem key={l.name} onClick={() => setLanguage(l.name)}>
                      <Image src={l.image} alt={l.label} width={16} height={12} />
                      {t(l.label)}
                      {lang === l.name && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuItem onClick={() => signOut()} disabled={isSigningOut}>
              <LogOut />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
