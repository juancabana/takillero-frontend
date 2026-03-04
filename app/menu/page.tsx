'use client';

import React, { Suspense, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts } from '@/features/product/presentation/hooks/use-product-queries';
import { useCategories } from '@/features/category/presentation/hooks/use-category-queries';
import { useCart } from '@/context/CartContext';
import { MENU_PAGE } from '@/constants/pages/menu';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { SearchInput, PillFilter, QuantityStepper, PageHeader } from '@/components/atoms';
import type { PillOption } from '@/components/atoms';
import { btn, card, text, layout, skeleton, pill } from '@/config/theme';
import type { Product } from '@/features/product/domain/entities/product';

function ProductCard({ product }: { product: Product }) {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={card.hover + ' overflow-hidden'}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '13px', fontWeight: 600 }}>
              {MENU_PAGE.SOLD_OUT}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{product.name}</h3>
        <p className="text-gray-500 mb-3" style={{ fontSize: '13px', lineHeight: 1.4 }}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-orange-600" style={{ fontSize: '18px', fontWeight: 700 }}>
            {formatPrice(product.price)}
          </span>

          {inCart ? (
            <QuantityStepper
              quantity={inCart.quantity}
              onDecrement={() =>
                inCart.quantity === 1
                  ? removeFromCart(product.id)
                  : updateQuantity(product.id, inCart.quantity - 1)
              }
              onIncrement={() => updateQuantity(product.id, inCart.quantity + 1)}
            />
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className={`${btn.base} gap-1.5 px-4 py-2 ${
                product.isAvailable
                  ? btn.primary
                  : btn.disabled
              }`}
              style={{ fontWeight: 600, fontSize: '14px' }}
            >
              <Plus size={16} />
              {MENU_PAGE.ADD_TO_CART}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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

export default function MenuPage() {
  return (
    <Suspense>
      <MenuContent />
    </Suspense>
  );
}
