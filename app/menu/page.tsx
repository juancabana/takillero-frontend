'use client';

import React, { Suspense, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts } from '@/features/product/presentation/hooks/use-product-queries';
import { useCategories } from '@/features/category/presentation/hooks/use-category-queries';
import { useCart } from '@/context/CartContext';
import { MENU_PAGE } from '@/constants/pages/menu';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import type { Product } from '@/features/product/domain/entities/product';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

function ProductCard({ product }: { product: Product }) {
  const { addToCart, removeFromCart, updateQuantity, items } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  inCart.quantity === 1
                    ? removeFromCart(product.id)
                    : updateQuantity(product.id, inCart.quantity - 1)
                }
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span
                className="w-8 text-center text-orange-600"
                style={{ fontWeight: 700, fontSize: '15px' }}
              >
                {inCart.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={!product.isAvailable}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                product.isAvailable
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
            {MENU_PAGE.TITLE}
          </h1>
          <p className="text-gray-500">{MENU_PAGE.SUBTITLE}</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={MENU_PAGE.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => handleCategoryChange('todos')}
            className={`shrink-0 px-5 py-2.5 rounded-xl transition-all ${
              activeCategory === 'todos'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
            }`}
            style={{ fontWeight: 500 }}
          >
            {MENU_PAGE.ALL_CATEGORIES}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`shrink-0 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
              style={{ fontWeight: 500 }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
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
