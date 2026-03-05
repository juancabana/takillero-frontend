import type { Metadata } from 'next';
import { SEO } from '@/constants/app';
import { JsonLd } from '@/components/seo/JsonLd';
import HomePageClient from './HomePageClient';

const { PAGES, SITE_URL, OG_IMAGE, LOCALE } = SEO;

export const metadata: Metadata = {
  title: PAGES.HOME.TITLE,
  description: PAGES.HOME.DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: PAGES.HOME.TITLE,
    description: PAGES.HOME.DESCRIPTION,
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Takillero — Comida Rápida' }],
    locale: LOCALE,
    type: 'website',
  },
  twitter: {
    title: PAGES.HOME.TITLE,
    description: PAGES.HOME.DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <HomePageClient />
    </>
  );
}
