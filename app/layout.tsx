import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { AppShell } from '@/components/AppShell';
import { APP_METADATA, SEO } from '@/constants/app';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.SITE_URL),
  title: {
    default: APP_METADATA.TITLE_DEFAULT,
    template: APP_METADATA.TITLE_TEMPLATE,
  },
  description: APP_METADATA.DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: SEO.LOCALE,
    siteName: 'Takillero',
    images: [{ url: SEO.OG_IMAGE, width: 1200, height: 630, alt: 'Takillero — Comida Rápida' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [SEO.OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
