'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import i18n, { useTranslation } from '@repo/i18n';
import Image from 'next/image';

const languages = [
  { name: 'ptBR', label: 'portuguese', image: '/pt-br.svg' },
  { name: 'enUS', label: 'english', image: '/en.svg' },
];

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageSwitcher() {
  const { t, i18n: i18nCtx } = useTranslation();
  const selectedLang = languages.find((l) => l.name === i18nCtx.language) ?? languages[0];

  function handleChange(lang: string) {
    setLocaleCookie(lang);
    i18n.changeLanguage(lang);
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className="cursor-pointer p-2">
          <Image
            src={selectedLang.image}
            alt={selectedLang.label}
            width={20}
            height={14}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('languages')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.name} onClick={() => handleChange(lang.name)}>
            <Image src={lang.image} alt={lang.label} width={16} height={12} />
            {t(lang.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
