'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Check,
  Banknote,
  Smartphone,
  X,
  Monitor,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/features/product/presentation/hooks/use-product-queries';
import { useCategories } from '@/features/category/presentation/hooks/use-category-queries';
import { useCreatePosOrder } from '@/features/order/presentation/hooks/use-order-queries';
import { formatPrice } from '@/lib/format-price';
import { POS } from '@/constants/admin/pos';
import type { Product } from '@/features/product/domain/entities/product';
import type { PaymentMethod } from '@/features/order/domain/entities/order-status';

interface PosCartItem {
  product: Product;
  quantity: number;
}

export default function POSPage() {
  const { token } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const createPosOrder = useCreatePosOrder();

  const [posCart, setPosCart] = useState<PosCartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ orderNumber: number } | null>(null);

  const availableProducts = useMemo(
    () => products.filter((p) => p.isAvailable),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [availableProducts, search, selectedCategory]);

  const addToPos = (product: Product) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromPos = (productId: string) => {
    setPosCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = posCart.reduce(
    (s, item) => s + item.product.price * item.quantity,
    0,
  );
  const totalItems = posCart.reduce((s, item) => s + item.quantity, 0);

  const handleCreateOrder = () => {
    if (posCart.length === 0) {
      toast.error(POS.TOAST_EMPTY);
      return;
    }
    if (!token) return;

    createPosOrder.mutate(
      {
        data: {
          orderType: 'local',
          paymentMethod,
          notes: notes || undefined,
          items: posCart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        },
        token,
      },
      {
        onSuccess: (order) => {
          setLastOrder({ orderNumber: order.orderNumber });
          setPosCart([]);
          setNotes('');
          setPaymentMethod('efectivo');
          setShowConfirm(false);
          toast.success(POS.TOAST_SUCCESS(order.orderNumber));
        },
      },
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] lg:h-[calc(100vh-64px)]">
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Monitor size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1
              className="text-gray-900"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {POS.TITLE}
            </h1>
            <p className="text-gray-500" style={{ fontSize: '13px' }}>
              {POS.SUBTITLE}
            </p>
          </div>
          {lastOrder && (
            <div className="ml-auto bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
              <span
                className="text-green-700"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                {POS.LAST_ORDER} #{lastOrder.orderNumber}
              </span>
            </div>
          )}
        </div>

        {/* Search + Categories */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={POS.SEARCH_PLACEHOLDER}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-4 py-1.5 rounded-full transition-all ${
                selectedCategory === 'all'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              {POS.ALL_CATEGORIES}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                }`}
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start pb-4">
          {filteredProducts.map((product) => {
            const inCart = posCart.find(
              (i) => i.product.id === product.id,
            );
            return (
              <button
                key={product.id}
                onClick={() => addToPos(product)}
                className={`relative text-left bg-white rounded-xl border p-3 hover:shadow-md transition-all ${
                  inCart
                    ? 'border-indigo-300 ring-1 ring-indigo-200'
                    : 'border-gray-100'
                }`}
              >
                <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden mb-2">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p
                  className="text-gray-900 truncate"
                  style={{ fontSize: '13px', fontWeight: 500 }}
                >
                  {product.name}
                </p>
                {product.description && (
                  <p
                    className="text-gray-400"
                    style={{ fontSize: '11px' }}
                  >
                    {product.description}
                  </p>
                )}
                <p
                  className="text-indigo-600"
                  style={{ fontSize: '14px', fontWeight: 700 }}
                >
                  {formatPrice(product.price)}
                </p>
                {inCart && (
                  <span
                    className="absolute top-2 right-2 bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ fontSize: '11px', fontWeight: 700 }}
                  >
                    {inCart.quantity}
                  </span>
                )}
              </button>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <p style={{ fontSize: '14px' }}>{POS.NO_PRODUCTS}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full lg:w-96 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-[300px] lg:min-h-0">
        {/* Cart header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-indigo-600" />
            <span
              className="text-gray-900"
              style={{ fontWeight: 600 }}
            >
              {POS.CURRENT_ORDER}
            </span>
            {totalItems > 0 && (
              <span
                className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
                style={{ fontSize: '12px', fontWeight: 600 }}
              >
                {totalItems}
              </span>
            )}
          </div>
          {posCart.length > 0 && (
            <button
              onClick={() => setPosCart([])}
              className="text-gray-400 hover:text-red-500 transition-colors"
              style={{ fontSize: '12px' }}
            >
              {POS.CLEAR}
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {posCart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingBag
                  size={32}
                  className="mx-auto mb-2 opacity-30"
                />
                <p style={{ fontSize: '14px' }}>{POS.EMPTY_CART}</p>
              </div>
            ) : (
              posCart.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-gray-900 truncate"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      {item.product.name}
                    </p>
                    <p
                      className="text-indigo-600"
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      className="w-6 text-center text-gray-900"
                      style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeFromPos(item.product.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 ml-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Notes */}
        {posCart.length > 0 && (
          <div className="px-4 pb-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={POS.NOTES_PLACEHOLDER}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
              style={{ fontSize: '13px' }}
            />
          </div>
        )}

        {/* Payment & Total */}
        {posCart.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            {/* Payment method */}
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod('efectivo')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500'
                }`}
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                <Banknote size={16} /> {POS.CASH}
              </button>
              <button
                onClick={() => setPaymentMethod('transferencia')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition-all ${
                  paymentMethod === 'transferencia'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500'
                }`}
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                <Smartphone size={16} /> {POS.TRANSFER}
              </button>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-gray-500" style={{ fontSize: '14px' }}>
                {POS.TOTAL}
              </span>
              <span
                className="text-gray-900"
                style={{ fontSize: '24px', fontWeight: 800 }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Confirm button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl transition-all shadow-md shadow-indigo-200"
              style={{ fontWeight: 600 }}
            >
              <Check size={18} /> {POS.CREATE_ORDER}
            </button>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-gray-900"
                  style={{ fontSize: '18px', fontWeight: 700 }}
                >
                  {POS.CONFIRM_TITLE}
                </h3>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {posCart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between"
                    style={{ fontSize: '14px' }}
                  >
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span
                      className="text-gray-900"
                      style={{ fontWeight: 500 }}
                    >
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {POS.CONFIRM_TYPE_LABEL}
                  </span>
                  <span
                    className="text-gray-900"
                    style={{ fontWeight: 500 }}
                  >
                    {POS.CONFIRM_TYPE_VALUE}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {POS.CONFIRM_PAYMENT_LABEL}
                  </span>
                  <span
                    className="text-gray-900"
                    style={{ fontWeight: 500 }}
                  >
                    {paymentMethod === 'efectivo'
                      ? POS.CONFIRM_PAYMENT_CASH
                      : POS.CONFIRM_PAYMENT_TRANSFER}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span
                    className="text-gray-900"
                    style={{ fontWeight: 700, fontSize: '18px' }}
                  >
                    {POS.CONFIRM_TOTAL}
                  </span>
                  <span
                    className="text-indigo-600"
                    style={{ fontWeight: 800, fontSize: '18px' }}
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  style={{ fontWeight: 500 }}
                >
                  {POS.CANCEL}
                </button>
                <button
                  onClick={() => void handleCreateOrder()}
                  disabled={createPosOrder.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-md disabled:opacity-50"
                  style={{ fontWeight: 600 }}
                >
                  {createPosOrder.isPending ? '...' : POS.CONFIRM}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
