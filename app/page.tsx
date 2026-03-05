"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useStoreSettings } from "@/features/store-settings/presentation/hooks/use-store-settings-queries";
import { useCategories } from "@/features/category/presentation/hooks/use-category-queries";
import { BusinessClosed } from "@/components/BusinessClosed";
import { HeroSection } from "@/components/organisms/HeroSection";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { CategoriesSection } from "@/components/organisms/CategoriesSection";
import { HOME_PAGE } from "@/constants/pages/home";

export default function HomePage() {
  const { data: storeSettings, isLoading: loadingStore } = useStoreSettings();
  const { data: categories = [], isLoading: loadingCats } = useCategories();

  if (loadingStore || loadingCats) return <div className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      {storeSettings && !storeSettings.isOpen && (
        <BusinessClosed settings={storeSettings} />
      )}

      {storeSettings?.isOpen && !storeSettings.deliveryEnabled && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-800" style={{ fontSize: '14px' }}>
            <AlertTriangle size={18} className="text-amber-500 shrink-0" />
            {HOME_PAGE.DELIVERY_DISABLED_BANNER}
          </div>
        </div>
      )}

      <HeroSection deliveryEnabled={storeSettings?.deliveryEnabled ?? true} />
      <FeaturesSection />
      <CategoriesSection categories={categories} />
    </div>
  );
}
