import { QueryProvider } from '@/components/providers/queryProvider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import type { Metadata } from 'next';
import { Fira_Code, Outfit } from 'next/font/google';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
