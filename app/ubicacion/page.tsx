import type { Metadata } from 'next';
import { SEO } from '@/constants/app';
import UbicacionPageClient from './UbicacionPageClient';

const { PAGES, SITE_URL, OG_IMAGE, LOCALE } = SEO;

export const metadata: Metadata = {
  title: PAGES.UBICACION.TITLE,
  description: PAGES.UBICACION.DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/ubicacion/` },
  openGraph: {
    title: PAGES.UBICACION.TITLE,
    description: PAGES.UBICACION.DESCRIPTION,
    url: `${SITE_URL}/ubicacion/`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Ubicación Takillero' }],
    locale: LOCALE,
    type: 'website',
  },
  twitter: {
    title: PAGES.UBICACION.TITLE,
    description: PAGES.UBICACION.DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function UbicacionPage() {
  return <UbicacionPageClient />;
}
