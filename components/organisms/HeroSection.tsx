'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/atoms/Button';
import { appRoutes } from '@/config/appRoutes';
import { HOME_PAGE } from '@/constants/pages/home';

interface HeroSectionProps {
  businessName: string;
}

/**
 * Organism: Sección hero del homepage.
 * Requiere 'use client' por las animaciones de Framer Motion (motion/react).
 */
export function HeroSection({ businessName }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-700">
      {/* Patrón decorativo de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="text-orange-200 font-medium text-lg mb-2 uppercase tracking-widest">
            {HOME_PAGE.HERO_WELCOME_PREFIX}
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            {businessName}
          </h1>
        </motion.div>

        <motion.p
          className="text-orange-100 text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {HOME_PAGE.HERO_SUBTITLE}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          <Button
            as="link"
            href={appRoutes.MENU.getHref()}
            variant="primary"
            size="lg"
          >
            {HOME_PAGE.CTA_MENU}
          </Button>
          <Button
            as="link"
            href={appRoutes.UBICACION.getHref()}
            variant="outline"
            size="lg"
          >
            {HOME_PAGE.CTA_LOCATION_ALT}
          </Button>
        </motion.div>
      </div>

      {/* Ola decorativa inferior */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0"
      >
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-20 fill-white"
        >
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" />
        </svg>
      </div>
    </section>
  );
}
