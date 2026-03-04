'use client';

import React from 'react';
import { Truck, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { HOME_PAGE } from '@/constants/pages/home';

const FEATURE_ICONS = [Truck, Clock, Star];
const FEATURES = HOME_PAGE.FEATURES.map((feat, i) => ({
  icon: FEATURE_ICONS[i],
  title: feat.title,
  desc: feat.desc,
}));

export function FeaturesSection() {
  return (
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
  );
}
