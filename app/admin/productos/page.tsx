'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Package,
  Plus,
  Pencil,
  EyeOff,
  Eye,
  X,
  ImageIcon,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { Product } from '@/types/product.types';
import type { Category } from '@/types/category.types';
import { ADMIN_PRODUCTS } from '@/constants/admin/products';
import { DEFAULT_PRODUCT_IMAGE } from '@/constants/shared';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: '',
};

function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData: ProductFormData;
  title: string;
  categories: Category[];
}) {
  const [form, setForm] = useState<ProductFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = ADMIN_PRODUCTS.VALIDATION_NAME_REQUIRED;
    if (!form.description.trim()) newErrors.description = ADMIN_PRODUCTS.VALIDATION_DESCRIPTION_REQUIRED;
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = ADMIN_PRODUCTS.VALIDATION_PRICE_INVALID;
    if (!form.categoryId) newErrors.categoryId = ADMIN_PRODUCTS.VALIDATION_CATEGORY_REQUIRED;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-gray-900" style={{ fontSize: '20px', fontWeight: 700 }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Image preview */}
              <div className="flex flex-col items-center gap-3">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt={ADMIN_PRODUCTS.FORM_IMAGE_PREVIEW_ALT}
                    className="w-32 h-32 rounded-xl object-cover border-2 border-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                  {ADMIN_PRODUCTS.FORM_NAME_LABEL}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={ADMIN_PRODUCTS.FORM_PLACEHOLDER_NAME}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="text-red-500 mt-1" style={{ fontSize: '12px' }}>{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                  {ADMIN_PRODUCTS.FORM_DESCRIPTION_LABEL}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={ADMIN_PRODUCTS.FORM_PLACEHOLDER_DESCRIPTION}
                  rows={3}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.description && <p className="text-red-500 mt-1" style={{ fontSize: '12px' }}>{errors.description}</p>}
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {ADMIN_PRODUCTS.FORM_PRICE_LABEL}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="12000"
                    min="0"
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all ${
                      errors.price ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 mt-1" style={{ fontSize: '12px' }}>{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                    {ADMIN_PRODUCTS.FORM_CATEGORY_LABEL}
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all ${
                      errors.categoryId ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">{ADMIN_PRODUCTS.FORM_SELECT_CATEGORY}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 mt-1" style={{ fontSize: '12px' }}>{errors.categoryId}</p>}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-gray-700 mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>
                  {ADMIN_PRODUCTS.FORM_IMAGE_URL_LABEL}
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder={ADMIN_PRODUCTS.FORM_PLACEHOLDER_IMAGE_URL}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                />
                <p className="text-gray-400 mt-1" style={{ fontSize: '11px' }}>
                  {ADMIN_PRODUCTS.FORM_IMAGE_URL_HINT}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  {ADMIN_PRODUCTS.FORM_CANCEL}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
                  style={{ fontWeight: 600 }}
                >
                  {title.includes('Nuevo') ? ADMIN_PRODUCTS.FORM_CREATE : ADMIN_PRODUCTS.FORM_SAVE}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminProductosPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'disabled'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchAll = useCallback(async () => {
    const [prods, cats] = await Promise.all([
      productService.getProducts(),
      categoryService.getActiveCategories(),
    ]);
    setProducts(prods);
    setCategories(cats);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

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
      const created = await productService.createProduct(
        {
          name: data.name.trim(),
          description: data.description.trim(),
          price: Number(data.price),
          imageUrl: data.imageUrl.trim() || null,
          categoryId: data.categoryId,
          isAvailable: true,
        },
        token,
      );
      setProducts((prev) => [...prev, created]);
      setShowModal(false);
      toast.success(ADMIN_PRODUCTS.TOAST_CREATED);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_CREATE_ERROR);
    }
  };

  const handleEdit = async (data: ProductFormData) => {
    if (!token || !editingProduct) return;
    try {
      const updated = await productService.updateProduct(
        editingProduct.id,
        {
          name: data.name.trim(),
          description: data.description.trim(),
          price: Number(data.price),
          imageUrl: data.imageUrl.trim() || editingProduct.imageUrl,
          categoryId: data.categoryId,
        },
        token,
      );
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProduct(null);
      toast.success(ADMIN_PRODUCTS.TOAST_UPDATED);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_UPDATE_ERROR);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    if (!token) return;
    try {
      const updated = await productService.updateProduct(
        product.id,
        { isAvailable: !product.isAvailable },
        token,
      );
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success(product.isAvailable ? ADMIN_PRODUCTS.TOAST_SOLD_OUT : ADMIN_PRODUCTS.TOAST_AVAILABLE);
    } catch {
      toast.error(ADMIN_PRODUCTS.TOAST_AVAILABILITY_ERROR);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!token) return;
    if (!confirm(ADMIN_PRODUCTS.DELETE_CONFIRM(product.name))) return;
    try {
      await productService.deleteProduct(product.id, token);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
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
        initialData={{ ...emptyForm, categoryId: categories[0]?.id ?? '' }}
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
            : emptyForm
        }
        title={ADMIN_PRODUCTS.MODAL_TITLE_EDIT}
        categories={categories}
      />
    </div>
  );
}
