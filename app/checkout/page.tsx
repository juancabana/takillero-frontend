'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  CreditCard,
  MapPin,
  MessageCircle,
  Check,
  Banknote,
  Smartphone,
  Copy,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useCreateOrder } from '@/features/order/presentation/hooks/use-order-queries';
import { toast } from 'sonner';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { COMMON_LABELS, CUSTOMER_LABELS, PAYMENT_DATA, PAYMENT_METHODS, DEFAULT_WHATSAPP_NUMBER, DEFAULT_PRODUCT_IMAGE, STORE_DEFAULTS } from '@/constants/shared';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

type PaymentMethod = 'efectivo' | 'transferencia';

interface FormData {
  cedula: string;
  nombre: string;
  telefono: string;
  direccion: string;
  barrio: string;
  formaPago: PaymentMethod;
  notas: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { settings } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orderSent, setOrderSent] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ orderNumber: number; id: string } | null>(null);
  const createOrderMutation = useCreateOrder();
  const [form, setForm] = useState<FormData>({
    cedula: '',
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    formaPago: 'efectivo',
    notas: '',
  });

  const activeZones = settings?.deliveryZones?.filter((z) => z.active) ?? [];
  const deliveryFee =
    activeZones.find((z) => z.name.toLowerCase() === form.barrio.toLowerCase())?.fee ?? 5000;
  const total = totalPrice + deliveryFee;
  const whatsapp = settings?.whatsappNumber ?? DEFAULT_WHATSAPP_NUMBER;

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isStep1Valid =
    form.cedula.trim() !== '' && form.nombre.trim() !== '' && form.telefono.trim() !== '';
  const isStep2Valid = form.direccion.trim() !== '' && form.barrio.trim() !== '';

  const generateWhatsAppMessage = (orderNumber: number) => {
    let msg = `${CHECKOUT_PAGE.WA_MSG_HEADER} #${orderNumber} - ${settings?.businessName ?? STORE_DEFAULTS.BUSINESS_NAME}*\n\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_CUSTOMER_TITLE}\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_CUSTOMER_NAME} ${form.nombre}\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_CUSTOMER_CEDULA} ${form.cedula}\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_CUSTOMER_PHONE} ${form.telefono}\n\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_ADDRESS_TITLE}\n`;
    msg += `${form.direccion}\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_NEIGHBORHOOD} ${form.barrio}\n\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_ORDER_TITLE}\n`;
    items.forEach((item) => {
      msg += `• ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}\n`;
    });
    msg += `\n${CHECKOUT_PAGE.WA_MSG_SUBTOTAL} ${formatPrice(totalPrice)}\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_DELIVERY} ${formatPrice(deliveryFee)}\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_TOTAL} ${formatPrice(total)}*\n\n`;
    msg += `${CHECKOUT_PAGE.WA_MSG_PAYMENT} ${form.formaPago === 'efectivo' ? PAYMENT_METHODS.CASH_LABEL : PAYMENT_METHODS.TRANSFER_LABEL}\n`;
    if (form.notas) {
      msg += `\n${CHECKOUT_PAGE.WA_MSG_NOTES} ${form.notas}\n`;
    }
    msg += `\n${CHECKOUT_PAGE.WA_MSG_STATUS}`;
    msg += `\n${CHECKOUT_PAGE.WA_MSG_AWAITING}`;
    return encodeURIComponent(msg);
  };

  const handleSendOrder = async () => {
    try {
      const order = await createOrderMutation.mutateAsync({
        customerName: form.nombre,
        customerCedula: form.cedula,
        customerPhone: form.telefono,
        customerAddress: form.direccion,
        customerBarrio: form.barrio,
        paymentMethod: form.formaPago,
        notes: form.notas || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      setCreatedOrder({ orderNumber: order.orderNumber, id: order.id });

      // Send WhatsApp
      const message = generateWhatsAppMessage(order.orderNumber);
      window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
      setOrderSent(true);
    } catch {
      toast.error(CHECKOUT_PAGE.ERROR_CREATE_ORDER);
    }
  };

  const isSubmitting = createOrderMutation.isPending;

  const handleNewOrder = () => {
    clearCart();
    router.push('/');
  };

  if (items.length === 0 && !orderSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-400" style={{ fontSize: '48px' }}>🛒</p>
          <h2 className="text-gray-900 mt-4 mb-2" style={{ fontSize: '24px', fontWeight: 700 }}>
            {CHECKOUT_PAGE.EMPTY_CART_TITLE}
          </h2>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-all"
            style={{ fontWeight: 600 }}
          >
            {CHECKOUT_PAGE.EMPTY_CART_CTA}
          </Link>
        </div>
      </div>
    );
  }

  if (orderSent && createdOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-orange-600" />
          </div>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
            {CHECKOUT_PAGE.ORDER_SENT_TITLE}
          </h2>
          <p className="text-gray-500 mb-4">
            {CHECKOUT_PAGE.ORDER_SENT_DESCRIPTION}
          </p>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <p className="text-gray-500 mb-1" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.ORDER_NUMBER_LABEL}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-orange-600" style={{ fontSize: '42px', fontWeight: 800 }}>
                #{createdOrder.orderNumber}
              </span>
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(createdOrder.orderNumber.toString());
                  toast.success(CHECKOUT_PAGE.ORDER_NUMBER_COPIED);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Copy size={20} />
              </button>
            </div>
            <p className="text-gray-400 mt-2" style={{ fontSize: '13px' }}>
              {CHECKOUT_PAGE.ORDER_NUMBER_SAVE_HINT}
            </p>
          </div>

          {form.formaPago === 'transferencia' && (
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 mb-6 text-left">
              <p className="text-blue-800 mb-2" style={{ fontWeight: 600, fontSize: '14px' }}>
                {CHECKOUT_PAGE.TRANSFER_DATA_TITLE}
              </p>
              <div className="space-y-1 text-blue-700" style={{ fontSize: '14px' }}>
                <p>{PAYMENT_DATA.NEQUI}</p>
                <p>{PAYMENT_DATA.DAVIPLATA}</p>
                <p>{PAYMENT_DATA.BANCOLOMBIA}</p>
              </div>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola! Soy ${form.nombre}. Quiero enviar el comprobante de pago de mi pedido #${createdOrder.orderNumber} por ${formatPrice(total)}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl transition-all"
                style={{ fontWeight: 600, fontSize: '14px' }}
              >
                <MessageCircle size={18} /> {CHECKOUT_PAGE.SEND_RECEIPT_WHATSAPP}
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/pedido"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-all"
              style={{ fontWeight: 600 }}
              onClick={() => clearCart()}
            >
              {CHECKOUT_PAGE.VIEW_ORDER_STATUS}
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=${generateWhatsAppMessage(createdOrder.orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all"
              style={{ fontWeight: 600 }}
            >
              <MessageCircle size={20} /> {CHECKOUT_PAGE.OPEN_WHATSAPP}
            </a>
            <button
              onClick={handleNewOrder}
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 py-3 rounded-xl transition-colors"
            >
              {CHECKOUT_PAGE.NEW_ORDER}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/carrito"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-gray-900" style={{ fontSize: '32px', fontWeight: 700 }}>
              {CHECKOUT_PAGE.PAGE_TITLE}
            </h1>
            <p className="text-gray-500">{CHECKOUT_PAGE.PAGE_SUBTITLE}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all ${
                    step > s ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.STEP_1_TITLE}</h3>
                      <p className="text-gray-500" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.STEP_1_SUBTITLE}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                        {CHECKOUT_PAGE.LABEL_FULL_NAME}
                      </label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => updateForm('nombre', e.target.value)}
                        placeholder={CHECKOUT_PAGE.PLACEHOLDER_NAME}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                        {CHECKOUT_PAGE.LABEL_CEDULA}
                      </label>
                      <input
                        type="text"
                        value={form.cedula}
                        onChange={(e) => updateForm('cedula', e.target.value)}
                        placeholder={CHECKOUT_PAGE.PLACEHOLDER_CEDULA}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                        {CHECKOUT_PAGE.LABEL_PHONE}
                      </label>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => updateForm('telefono', e.target.value)}
                        placeholder={CHECKOUT_PAGE.PLACEHOLDER_PHONE}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all"
                      style={{ fontWeight: 600 }}
                    >
                      {COMMON_LABELS.NEXT} <ArrowLeft size={18} className="rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.STEP_2_TITLE}</h3>
                      <p className="text-gray-500" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.STEP_2_SUBTITLE}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                        {CHECKOUT_PAGE.LABEL_ADDRESS}
                      </label>
                      <input
                        type="text"
                        value={form.direccion}
                        onChange={(e) => updateForm('direccion', e.target.value)}
                        placeholder={CHECKOUT_PAGE.PLACEHOLDER_ADDRESS}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                        {CHECKOUT_PAGE.LABEL_NEIGHBORHOOD}
                      </label>
                      <select
                        value={form.barrio}
                        onChange={(e) => updateForm('barrio', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                      >
                        <option value="">{CHECKOUT_PAGE.SELECT_NEIGHBORHOOD}</option>
                        {activeZones.map((z) => (
                          <option key={z.id} value={z.name}>
                            {z.name} - Domicilio: {formatPrice(z.fee)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1.5" style={{ fontSize: '14px' }}>
                        {CHECKOUT_PAGE.LABEL_NOTES}
                      </label>
                      <textarea
                        value={form.notas}
                        onChange={(e) => updateForm('notas', e.target.value)}
                        placeholder={CHECKOUT_PAGE.PLACEHOLDER_NOTES}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors"
                    >
                      <ArrowLeft size={18} /> {COMMON_LABELS.BACK}
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all"
                      style={{ fontWeight: 600 }}
                    >
                      {COMMON_LABELS.NEXT} <ArrowLeft size={18} className="rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <CreditCard size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.STEP_3_TITLE}</h3>
                      <p className="text-gray-500" style={{ fontSize: '14px' }}>{CHECKOUT_PAGE.STEP_3_SUBTITLE}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => updateForm('formaPago', 'efectivo')}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        form.formaPago === 'efectivo'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          form.formaPago === 'efectivo' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Banknote size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-gray-900" style={{ fontWeight: 600 }}>{PAYMENT_METHODS.CASH_LABEL}</p>
                        <p className="text-gray-500" style={{ fontSize: '13px' }}>{PAYMENT_METHODS.CASH_DESCRIPTION}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => updateForm('formaPago', 'transferencia')}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        form.formaPago === 'transferencia'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          form.formaPago === 'transferencia' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Smartphone size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-gray-900" style={{ fontWeight: 600 }}>{PAYMENT_METHODS.TRANSFER_LABEL}</p>
                        <p className="text-gray-500" style={{ fontSize: '13px' }}>{PAYMENT_METHODS.TRANSFER_DESCRIPTION}</p>
                      </div>
                    </button>
                  </div>

                  {form.formaPago === 'transferencia' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
                    >
                      <p className="text-blue-800" style={{ fontWeight: 600, fontSize: '14px' }}>
                        {CHECKOUT_PAGE.TRANSFER_DATA_TITLE}
                      </p>
                      <div className="mt-2 space-y-1 text-blue-700" style={{ fontSize: '14px' }}>
                        <p>{PAYMENT_DATA.NEQUI}</p>
                        <p>{PAYMENT_DATA.DAVIPLATA}</p>
                        <p>{PAYMENT_DATA.BANCOLOMBIA}</p>
                      </div>
                      <p className="mt-2 text-blue-600" style={{ fontSize: '13px' }}>
                        {CHECKOUT_PAGE.TRANSFER_RECEIPT_HINT}
                      </p>
                    </motion.div>
                  )}

                  {/* Order summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.ORDER_SUMMARY_TITLE}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-gray-600" style={{ fontSize: '14px' }}>
                          <span>{item.quantity}x {item.product.name}</span>
                          <span>{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-gray-600" style={{ fontSize: '14px' }}>
                        <span>{COMMON_LABELS.DELIVERY} ({form.barrio || CHECKOUT_PAGE.SELECT_NEIGHBORHOOD_PLACEHOLDER})</span>
                        <span>{formatPrice(deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between text-gray-900" style={{ fontWeight: 700, fontSize: '18px' }}>
                        <span>{COMMON_LABELS.TOTAL}</span>
                        <span className="text-orange-600">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer info summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>{CHECKOUT_PAGE.DELIVERY_DATA_TITLE}</h4>
                    <div className="grid grid-cols-2 gap-2" style={{ fontSize: '14px' }}>
                      <span className="text-gray-500">{CUSTOMER_LABELS.NAME}</span>
                      <span className="text-gray-900">{form.nombre}</span>
                      <span className="text-gray-500">{CUSTOMER_LABELS.CEDULA}</span>
                      <span className="text-gray-900">{form.cedula}</span>
                      <span className="text-gray-500">{CUSTOMER_LABELS.PHONE}</span>
                      <span className="text-gray-900">{form.telefono}</span>
                      <span className="text-gray-500">{CUSTOMER_LABELS.ADDRESS}</span>
                      <span className="text-gray-900">{form.direccion}</span>
                      <span className="text-gray-500">{CUSTOMER_LABELS.NEIGHBORHOOD}</span>
                      <span className="text-gray-900">{form.barrio}</span>
                    </div>
                  </div>

                  {/* Pending confirmation notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-800" style={{ fontWeight: 600, fontSize: '14px' }}>
                          {CHECKOUT_PAGE.MANUAL_VERIFICATION_TITLE}
                        </p>
                        <p className="text-amber-700" style={{ fontSize: '13px' }}>
                          {CHECKOUT_PAGE.MANUAL_VERIFICATION_DESCRIPTION}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors"
                    >
                      <ArrowLeft size={18} /> {COMMON_LABELS.BACK}
                    </button>
                    <button
                      onClick={() => void handleSendOrder()}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl transition-all shadow-md shadow-green-200"
                      style={{ fontWeight: 600 }}
                    >
                      <MessageCircle size={20} />
                      {isSubmitting ? CHECKOUT_PAGE.SUBMITTING : CHECKOUT_PAGE.SUBMIT_ORDER}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-gray-900 mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
                {CHECKOUT_PAGE.SIDEBAR_TITLE} ({items.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={item.product.imageUrl ?? DEFAULT_PRODUCT_IMAGE}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate" style={{ fontSize: '14px' }}>{item.product.name}</p>
                      <p className="text-gray-500" style={{ fontSize: '13px' }}>{item.quantity}x {formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between text-gray-500 mb-1" style={{ fontSize: '14px' }}>
                  <span>{COMMON_LABELS.SUBTOTAL}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500 mb-2" style={{ fontSize: '14px' }}>
                  <span>{COMMON_LABELS.DELIVERY}</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-gray-900" style={{ fontWeight: 700, fontSize: '18px' }}>
                  <span>{COMMON_LABELS.TOTAL}</span>
                  <span className="text-orange-600">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-green-700 mb-1" style={{ fontWeight: 600, fontSize: '14px' }}>
                  <MessageCircle size={16} />
                  {CHECKOUT_PAGE.SIDEBAR_WHATSAPP_TITLE}
                </div>
                <p className="text-green-600" style={{ fontSize: '13px' }}>
                  +{whatsapp.startsWith('57') ? `57 ${whatsapp.slice(2)}` : whatsapp}
                </p>
                <p className="text-green-500 mt-1" style={{ fontSize: '12px' }}>
                  {CHECKOUT_PAGE.SIDEBAR_MANUAL_CONFIRM}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
