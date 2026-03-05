'use client';

import React, { Suspense, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '@/features/product/presentation/hooks/use-product-queries';
import { useCategories } from '@/features/category/presentation/hooks/use-category-queries';
import { MENU_PAGE } from '@/constants/pages/menu';
import { SearchInput } from '@/components/atoms/SearchInput';
import { PillFilter } from '@/components/atoms/PillFilter';
import type { PillOption } from '@/components/atoms/PillFilter';
import { PageHeader } from '@/components/atoms/PageHeader';
import { ProductCard } from '@/components/molecules/ProductCard';
import { layout, skeleton } from '@/config/theme';

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('categoria');

  const [activeCategory, setActiveCategory] = useState<string>(categoryParam ?? 'todos');
  const [search, setSearch] = useState('');

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const handleCategoryChange = useCallback(
    (catId: string) => {
      setActiveCategory(catId);
      if (catId === 'todos') {
        router.push('/menu');
      } else {
        router.push(`/menu?categoria=${catId}`);
      }
    },
    [router],
  );

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'todos' || p.categoryId === activeCategory;
    const matchSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryPills: PillOption[] = [
    { value: 'todos', label: MENU_PAGE.ALL_CATEGORIES },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name, icon: cat.icon })),
  ];

  return (
    <div className={layout.page}>
      <div className={`${layout.container} py-8`}>
        <div className="mb-8">
          <PageHeader title={MENU_PAGE.TITLE} subtitle={MENU_PAGE.SUBTITLE} />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={MENU_PAGE.SEARCH_PLACEHOLDER}
          />
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <PillFilter
            options={categoryPills}
            value={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${skeleton.base} h-72`} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400" style={{ fontSize: '48px' }}>{MENU_PAGE.NO_PRODUCTS_EMOJI}</p>
            <p className="text-gray-500 mt-4">{MENU_PAGE.NO_PRODUCTS_FOUND}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPageClient() {
  return (
    <Suspense>
      <MenuContent />
    </Suspense>
  );
}
