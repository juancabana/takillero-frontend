'use client';

import React, { useState } from 'react';
import {
  Search,
  Package,
  Plus,
  Pencil,
  EyeOff,
  Eye,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useToggleProductAvailability } from '@/features/product/presentation/hooks/use-product-queries';
import { useCategories } from '@/features/category/presentation/hooks/use-category-queries';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { Product } from '@/features/product/domain/entities/product';
import { ADMIN_PRODUCTS } from '@/constants/admin/products';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { ProductFormModal, emptyProductForm } from '@/components/modals/ProductFormModal';
import type { ProductFormData } from '@/components/modals/ProductFormModal';
import { SearchInput, PillFilter, PageHeader } from '@/components/atoms';
import type { PillOption } from '@/components/atoms';
import { btn, card, badge, layout, text, pill } from '@/config/theme';

export default function AdminProductosPage() {
  const { token } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const toggleAvailabilityMutation = useToggleProductAvailability();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'disabled'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === 'todos' || p.categoryId === activeCategory;
    const matchSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && p.isAvailable) ||
      (filterStatus === 'disabled' && !p.isAvailable);
    return matchCategory && matchSearch && matchStatus;
  });

  const handleAdd = async (data: ProductFormData) => {
    if (!token) return;
    try {
      await createProductMutation.mutateAsync({
        data: {
          name: data.name.trim(),
          description: data.description.trim(),
          price: Number(data.price),
          imageUrl: data.imageUrl.trim() || undefined,
          categoryId: data.categoryId,
          isAvailable: true,
        },
        token,
      });
      setShowModal(false);
      toast.success(ADMIN_PRODUCTS.TOAST_CREATED);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_CREATE_ERROR);
    }
  };

  const handleEdit = async (data: ProductFormData) => {
    if (!token || !editingProduct) return;
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          name: data.name.trim(),
          description: data.description.trim(),
          price: Number(data.price),
          imageUrl: data.imageUrl.trim() || editingProduct.imageUrl,
          categoryId: data.categoryId,
        },
        token,
      });
      setEditingProduct(null);
      toast.success(ADMIN_PRODUCTS.TOAST_UPDATED);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_UPDATE_ERROR);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    if (!token) return;
    try {
      await toggleAvailabilityMutation.mutateAsync({
        id: product.id,
        isAvailable: !product.isAvailable,
        token,
      });
      toast.success(product.isAvailable ? ADMIN_PRODUCTS.TOAST_SOLD_OUT : ADMIN_PRODUCTS.TOAST_AVAILABLE);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_AVAILABILITY_ERROR);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!token) return;
    if (!confirm(ADMIN_PRODUCTS.DELETE_CONFIRM(product.name))) return;
    try {
      await deleteProductMutation.mutateAsync({ id: product.id, token });
      toast.success(ADMIN_PRODUCTS.TOAST_DELETED);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_DELETE_ERROR);
    }
  };

  const activeCount = products.filter((p) => p.isAvailable).length;
  const disabledCount = products.filter((p) => !p.isAvailable).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '28px', fontWeight: 700 }}>
            {ADMIN_PRODUCTS.TITLE}
          </h1>
          <p className="text-gray-500" style={{ fontSize: '14px' }}>
            {ADMIN_PRODUCTS.SUBTITLE}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
          style={{ fontWeight: 600, fontSize: '14px' }}
        >
          <Plus size={18} /> {ADMIN_PRODUCTS.NEW_PRODUCT_BUTTON}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-gray-400" style={{ fontSize: '12px' }}>{ADMIN_PRODUCTS.STATS_TOTAL}</p>
          <p className="text-gray-900" style={{ fontSize: '24px', fontWeight: 700 }}>{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-green-100 text-center">
          <p className="text-green-500" style={{ fontSize: '12px' }}>{ADMIN_PRODUCTS.STATS_AVAILABLE}</p>
          <p className="text-green-600" style={{ fontSize: '24px', fontWeight: 700 }}>{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-red-100 text-center">
          <p className="text-red-400" style={{ fontSize: '12px' }}>{ADMIN_PRODUCTS.STATS_SOLD_OUT}</p>
          <p className="text-red-500" style={{ fontSize: '24px', fontWeight: 700 }}>{disabledCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={ADMIN_PRODUCTS.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {(['all', 'active', 'disabled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl transition-all ${
              filterStatus === s ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            {s === 'all' ? ADMIN_PRODUCTS.FILTER_ALL : s === 'active' ? ADMIN_PRODUCTS.FILTER_AVAILABLE : ADMIN_PRODUCTS.FILTER_SOLD_OUT}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('todos')}
          className={`shrink-0 px-4 py-2 rounded-xl transition-all ${
            activeCategory === 'todos' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
          style={{ fontSize: '13px', fontWeight: 500 }}
        >
          {ADMIN_PRODUCTS.FILTER_ALL}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${
              activeCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Products list */}
      <div className="grid gap-3">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            className={`bg-white rounded-xl p-4 border transition-all ${
              product.isAvailable ? 'border-gray-100' : 'border-red-200 bg-red-50/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
                  alt={product.name}
                  className={`w-16 h-16 rounded-xl object-cover ${!product.isAvailable ? 'opacity-60' : ''}`}
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                    <EyeOff size={16} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-gray-900 truncate" style={{ fontWeight: 500 }}>
                    {product.name}
                  </h3>
                  {!product.isAvailable && (
                    <span
                      className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full"
                      style={{ fontSize: '11px', fontWeight: 600 }}
                    >
                      {ADMIN_PRODUCTS.SOLD_OUT_BADGE}
                    </span>
                  )}
                </div>
                <p className="text-gray-400" style={{ fontSize: '13px' }}>
                  {categories.find((c) => c.id === product.categoryId)?.name} -{' '}
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-400 truncate mt-0.5" style={{ fontSize: '12px' }}>
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  title="Editar producto"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => void handleToggleAvailable(product)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    product.isAvailable
                      ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      : 'bg-green-50 text-green-500 hover:bg-green-100'
                  }`}
                  title={product.isAvailable ? 'Marcar como agotado' : 'Marcar como disponible'}
                >
                  {product.isAvailable ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <button
                  onClick={() => void handleDelete(product)}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Package size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{ADMIN_PRODUCTS.NO_PRODUCTS}</p>
        </div>
      )}

      {/* Add modal */}
      <ProductFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => void handleAdd(data)}
        initialData={{ ...emptyProductForm, categoryId: categories[0]?.id ?? '' }}
        title={ADMIN_PRODUCTS.MODAL_TITLE_NEW}
        categories={categories}
      />

      {/* Edit modal */}
      <ProductFormModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={(data) => void handleEdit(data)}
        initialData={
          editingProduct
            ? {
                name: editingProduct.name,
                description: editingProduct.description,
                price: String(editingProduct.price),
                imageUrl: editingProduct.imageUrl ?? '',
                categoryId: editingProduct.categoryId,
              }
            : emptyProductForm
        }
        title={ADMIN_PRODUCTS.MODAL_TITLE_EDIT}
        categories={categories}
      />
    </div>
  );
}
