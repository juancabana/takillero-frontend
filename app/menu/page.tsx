import type { Metadata } from 'next';
import { SEO } from '@/constants/app';
import MenuPageClient from './MenuPageClient';

const { PAGES, SITE_URL, OG_IMAGE, LOCALE } = SEO;

export const metadata: Metadata = {
  title: PAGES.MENU.TITLE,
  description: PAGES.MENU.DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/menu/` },
  openGraph: {
    title: PAGES.MENU.TITLE,
    description: PAGES.MENU.DESCRIPTION,
    url: `${SITE_URL}/menu/`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Menú Takillero' }],
    locale: LOCALE,
    type: 'website',
  },
  twitter: {
    title: PAGES.MENU.TITLE,
    description: PAGES.MENU.DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function MenuPage() {
  return <MenuPageClient />;
}
