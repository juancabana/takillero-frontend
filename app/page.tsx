'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Clock, Star, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { storeService } from '@/services/store.service';
import { categoryService } from '@/services/category.service';
import { BusinessClosed } from '@/components/BusinessClosed';
import { HOME_PAGE } from '@/constants/pages/home';
import type { StoreSettings } from '@/types/store.types';
import type { Category } from '@/types/category.types';

const FEATURE_ICONS = [Truck, Clock, Star];
const FEATURES = HOME_PAGE.FEATURES.map((feat, i) => ({
  icon: FEATURE_ICONS[i],
  title: feat.title,
  desc: feat.desc,
}));

export default function HomePage() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([storeService.getSettings(), categoryService.getActiveCategories()])
      .then(([settings, cats]: [StoreSettings, Category[]]) => {
        setStoreSettings(settings);
        setCategories(cats);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      {storeSettings && !storeSettings.isOpen && (
        <BusinessClosed settings={storeSettings} />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                <Truck size={16} />
                {HOME_PAGE.BADGE_TEXT}
              </div>
              <h1
                className="text-gray-900 mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}
              >
                {HOME_PAGE.HERO_TITLE_PREFIX}{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  {HOME_PAGE.HERO_TITLE_HIGHLIGHT}
                </span>{' '}
                {HOME_PAGE.HERO_TITLE_SUFFIX}
              </h1>
              <p
                className="text-gray-600 mb-8 max-w-lg"
                style={{ fontSize: '18px', lineHeight: 1.7 }}
              >
                {HOME_PAGE.HERO_DESCRIPTION}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300"
                  style={{ fontWeight: 600, fontSize: '18px' }}
                >
                  {HOME_PAGE.CTA_MENU} <ArrowRight size={20} />
                </Link>
                <Link
                  href="/ubicacion"
                  className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 px-8 py-4 rounded-2xl transition-all"
                  style={{ fontWeight: 600, fontSize: '18px' }}
                >
                  <MapPin size={20} /> {HOME_PAGE.CTA_LOCATION}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 blur-3xl" />
                <img
                  src={HOME_PAGE.HERO_IMAGE_URL}
                  alt={HOME_PAGE.HERO_IMAGE_ALT}
                  className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <feat.icon size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">{feat.title}</h3>
                  <p className="text-gray-500" style={{ fontSize: '14px' }}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-3" style={{ fontSize: '32px', fontWeight: 700 }}>
              {HOME_PAGE.MENU_SECTION_TITLE}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {HOME_PAGE.MENU_SECTION_SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/menu?categoria=${cat.id}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-square"
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                    <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl transition-all shadow-md shadow-orange-200"
              style={{ fontWeight: 600 }}
            >
              {HOME_PAGE.CTA_FULL_MENU} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
