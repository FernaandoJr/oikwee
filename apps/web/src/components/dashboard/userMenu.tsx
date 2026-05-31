'use client';

import { useSignOut, useUser } from '@/auth';
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
import { avatarColorClasses } from '@/constants/avatar';
import i18n, { useTranslation } from '@repo/i18n';
import { Facehash } from 'facehash';
import {
  BadgeCheck,
  Bell,
  Check,
  Globe,
  Home,
  LogOut,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const languages = [
  { name: 'ptBR', label: 'portuguese', image: '/pt-br.svg' },
  { name: 'enUS', label: 'english', image: '/en.svg' },
];

function setLanguage(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  i18n.changeLanguage(locale);
}

export function UserMenu() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const router = useRouter();
  const { t, i18n: i18nCtx } = useTranslation();
  const lang = i18nCtx.language;

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? ''} alt={user.name} />
            <AvatarFallback>
              <Facehash
                enableBlink
                name={user.name}
                intensity3d="medium"
                showInitial={false}
                colorClasses={avatarColorClasses}
              />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm select-none">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.image ?? ''} alt={user.name} />
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
          <DropdownMenuItem>
            <BadgeCheck />
            {t('account')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            {t('notifications')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
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
        </DropdownMenuGroup>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} disabled={isSigningOut}>
          <LogOut />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
