'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HOME_PAGE } from '@/constants/pages/home';
import type { Category } from '@/features/category/domain/entities/category';

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-gray-900 mb-3"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
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
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>
                    {cat.name}
                  </p>
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
  );
}
