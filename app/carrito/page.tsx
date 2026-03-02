'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { settings } = useStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-orange-400" />
          </div>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Agrega productos del menú para empezar tu pedido
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-all shadow-md shadow-orange-200"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> Ver Menú
          </Link>
        </div>
      </div>
    );
  }

  const activeZones = settings?.deliveryZones?.filter((z) => z.active) ?? [];
  const domicilio = activeZones.length > 0
    ? Math.min(...activeZones.map((z) => z.fee))
    : 5000;
  const total = totalPrice + domicilio;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900" style={{ fontSize: '32px', fontWeight: 700 }}>
              Tu Carrito
            </h1>
            <p className="text-gray-500">{items.length} producto(s)</p>
          </div>
          <Link
            href="/menu"
            className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <ArrowLeft size={18} /> Seguir comprando
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm"
                >
                  <img
                    src={item.product.imageUrl ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-gray-900" style={{ fontWeight: 500 }}>{item.product.name}</h3>
                        <p className="text-orange-600" style={{ fontWeight: 600 }}>
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center text-gray-900" style={{ fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-gray-900" style={{ fontWeight: 700 }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-gray-900 mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
                Resumen del Pedido
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Domicilio (desde)</span>
                  <span>{formatPrice(domicilio)}</span>
                </div>
                <div
                  className="border-t border-gray-100 pt-3 flex justify-between text-gray-900"
                  style={{ fontWeight: 700, fontSize: '18px' }}
                >
                  <span>Total</span>
                  <span className="text-orange-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl transition-all shadow-md shadow-orange-200"
                style={{ fontWeight: 600 }}
              >
                Realizar Pedido <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
