"use client";

import React from "react";
import { useStoreSettings } from "@/features/store-settings/presentation/hooks/use-store-settings-queries";
import { useCategories } from "@/features/category/presentation/hooks/use-category-queries";
import { BusinessClosed } from "@/components/BusinessClosed";
import { HeroSection } from "@/components/organisms/HeroSection";
import { FeaturesSection } from "@/components/organisms/FeaturesSection";
import { CategoriesSection } from "@/components/organisms/CategoriesSection";

export default function HomePage() {
  const { data: storeSettings, isLoading: loadingStore } = useStoreSettings();
  const { data: categories = [], isLoading: loadingCats } = useCategories();

  if (loadingStore || loadingCats) return <div className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      {storeSettings && !storeSettings.isOpen && (
        <BusinessClosed settings={storeSettings} />
      )}

      <HeroSection />
      <FeaturesSection />
      <CategoriesSection categories={categories} />
    </div>
  );
}
