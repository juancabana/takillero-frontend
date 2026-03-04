'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  XCircle,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useOrderByNumber } from '@/features/order/presentation/hooks/use-order-queries';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { ORDER_TRACKING_PAGE } from '@/constants/pages/order-tracking';
import { DEFAULT_WHATSAPP_NUMBER } from '@/constants/shared';
import { layout } from '@/config/theme';
import { OrderStatusTracker } from '@/components/molecules/OrderStatusTracker';
import { OrderDetailCard } from '@/components/molecules/OrderDetailCard';
import { TransferPaymentCard } from '@/components/molecules/TransferPaymentCard';

export default function PedidoPage() {
  return (
    <Suspense>
      <PedidoContent />
    </Suspense>
  );
}

function PedidoContent() {
  const { settings } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialNum = searchParams.get('numero');
  const [orderNum, setOrderNum] = useState(initialNum ?? '');
  const [submittedNum, setSubmittedNum] = useState<number | null>(
    initialNum ? parseInt(initialNum) : null,
  );

  const { data: order, isLoading: isSearching, isError, isFetched } = useOrderByNumber(submittedNum);

  const whatsapp = settings?.whatsappNumber ?? DEFAULT_WHATSAPP_NUMBER;
  const searched = isFetched && submittedNum !== null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(orderNum);
    if (isNaN(num)) {
      toast.error(ORDER_TRACKING_PAGE.TOAST_INVALID_ORDER);
      return;
    }
    setSubmittedNum(num);
    router.replace(`/pedido?numero=${num}`);
  };

  return (
    <div className={layout.page}>
      <div className={`${layout.containerXNarrow} py-8`}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> {ORDER_TRACKING_PAGE.BACK_TO_HOME}
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
            {ORDER_TRACKING_PAGE.TITLE}
          </h1>
          <p className="text-gray-500">{ORDER_TRACKING_PAGE.SUBTITLE}</p>
        </div>

        {/* Search */}
        <form onSubmit={(e) => void handleSearch(e)} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontWeight: 600 }}>#</span>
            <input
              type="text"
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value.replace(/\D/g, ''))}
              placeholder={ORDER_TRACKING_PAGE.SEARCH_PLACEHOLDER}
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl transition-all"
            style={{ fontWeight: 600 }}
          >
            <Search size={18} /> {isSearching ? ORDER_TRACKING_PAGE.SEARCHING : ORDER_TRACKING_PAGE.SEARCH_BUTTON}
          </button>
        </form>

        {/* Not found */}
        {searched && (isError || !order) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl border border-gray-100"
          >
            <XCircle size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">{ORDER_TRACKING_PAGE.NOT_FOUND_PREFIX} #{orderNum}</p>
          </motion.div>
        )}

        {/* Order details */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <OrderDetailCard order={order} />

            <OrderStatusTracker status={order.status} rejectionReason={order.rejectionReason} />

            {/* Transfer payment CTA */}
            {order.paymentMethod === 'transferencia' && order.paymentStatus !== 'pagado' && (
              <TransferPaymentCard
                orderNumber={order.orderNumber}
                customerName={order.customerName}
                total={order.total}
                whatsapp={whatsapp}
              />
            )}

            {/* WhatsApp contact */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200 flex items-center justify-between">
              <div>
                <p className="text-green-800" style={{ fontWeight: 500, fontSize: '14px' }}>
                  {ORDER_TRACKING_PAGE.NEED_HELP}
                </p>
                <p className="text-green-600" style={{ fontSize: '13px' }}>
                  {ORDER_TRACKING_PAGE.WRITE_US_WHATSAPP}
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
