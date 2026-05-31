import { I18nProvider } from '@/components/providers/i18nProvider';
import { QueryProvider } from '@/components/providers/queryProvider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import type { Metadata } from 'next';
import { Fira_Code, Outfit } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'oiKwee',
  description: 'oiKwee is a platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'ptBR';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${outfit.variable} ${firaCode.variable} antialiased`}>
        <I18nProvider locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <QueryProvider>{children}</QueryProvider>
              <Toaster position="bottom-right" />
            </NuqsAdapter>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
