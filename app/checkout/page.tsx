'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { useCreateOrder } from '@/features/order/presentation/hooks/use-order-queries';
import { toast } from 'sonner';
import { CHECKOUT_PAGE } from '@/constants/pages/checkout';
import { PAYMENT_METHODS, DEFAULT_WHATSAPP_NUMBER, STORE_DEFAULTS } from '@/constants/shared';
import { formatPrice } from '@/lib/format-price';
import { layout } from '@/config/theme';
import { EmptyState } from '@/components/atoms/EmptyState';
import { CheckoutProgress } from '@/components/molecules/CheckoutProgress';
import { CheckoutStepPersonal } from '@/components/molecules/CheckoutStepPersonal';
import { CheckoutStepAddress } from '@/components/molecules/CheckoutStepAddress';
import { CheckoutStepPayment } from '@/components/molecules/CheckoutStepPayment';
import { CheckoutSidebar } from '@/components/molecules/CheckoutSidebar';
import { OrderSentView } from '@/components/molecules/OrderSentView';

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
      <div className={layout.page}>
        <EmptyState
          emoji="🛒"
          title={CHECKOUT_PAGE.EMPTY_CART_TITLE}
          actionLabel={CHECKOUT_PAGE.EMPTY_CART_CTA}
          actionHref="/menu"
        />
      </div>
    );
  }

  if (orderSent && createdOrder) {
    return (
      <OrderSentView
        orderNumber={createdOrder.orderNumber}
        total={total}
        customerName={form.nombre}
        paymentMethod={form.formaPago}
        whatsapp={whatsapp}
        whatsappMessage={generateWhatsAppMessage(createdOrder.orderNumber)}
        onNewOrder={handleNewOrder}
        onClearCart={clearCart}
      />
    );
  }

  return (
    <div className={layout.page}>
      <div className={`${layout.containerNarrow} py-8`}>
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

        <CheckoutProgress step={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <CheckoutStepPersonal
                  nombre={form.nombre}
                  cedula={form.cedula}
                  telefono={form.telefono}
                  onUpdate={(field, value) => updateForm(field, value)}
                  onNext={() => setStep(2)}
                  isValid={isStep1Valid}
                />
              )}

              {step === 2 && (
                <CheckoutStepAddress
                  direccion={form.direccion}
                  barrio={form.barrio}
                  notas={form.notas}
                  activeZones={activeZones}
                  onUpdate={(field, value) => updateForm(field, value)}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                  isValid={isStep2Valid}
                />
              )}

              {step === 3 && (
                <CheckoutStepPayment
                  formaPago={form.formaPago}
                  onPaymentChange={(method) => updateForm('formaPago', method)}
                  items={items}
                  totalPrice={totalPrice}
                  deliveryFee={deliveryFee}
                  total={total}
                  form={form}
                  isSubmitting={isSubmitting}
                  onBack={() => setStep(2)}
                  onSubmit={() => void handleSendOrder()}
                />
              )}
            </AnimatePresence>
          </div>

          <CheckoutSidebar
            items={items}
            totalPrice={totalPrice}
            deliveryFee={deliveryFee}
            total={total}
            whatsapp={whatsapp}
          />
        </div>
      </div>
    </div>
  );
}
