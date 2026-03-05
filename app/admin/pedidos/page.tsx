"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import {
  useOrders,
  useUpdateOrderStatus,
} from "@/features/order/presentation/hooks/use-order-queries";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Order } from "@/features/order/domain/entities/order";
import type { OrderStatus } from "@/features/order/domain/entities/order-status";
import { ADMIN_ORDERS } from "@/constants/admin/orders";
import { AdminOrderCard } from "@/components/molecules/AdminOrderCard";

export default function AdminPedidosPage() {
  const { token, role } = useAuth();
  const { data: orders = [] } = useOrders(token ?? "", {
    refetchInterval: 30_000,
  });
  const updateStatusMutation = useUpdateOrderStatus();

  const [filter, setFilter] = useState<"todos" | OrderStatus>("todos");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingOrder, setRejectingOrder] = useState<string | null>(null);

  const isCocina = role === "cocina";
  const isDomiciliario = role === "domiciliario";

  // Role-based page title
  const pageTitle = useMemo(() => {
    if (isCocina) return "Pedidos en Cocina";
    if (isDomiciliario) return "Mis Entregas";
    return "Gestion de Pedidos";
  }, [isCocina, isDomiciliario]);

  const pageSubtitle = useMemo(() => {
    if (isCocina) return "Pedidos confirmados listos para preparar";
    if (isDomiciliario) return "Pedidos listos para entregar";
    return "Administra y gestiona los pedidos entrantes";
  }, [isCocina, isDomiciliario]);

  // Role-based filter buttons
  const filterButtons: { value: "todos" | OrderStatus; label: string }[] = useMemo(() => {
    if (isCocina) {
      return [
        { value: "todos", label: ADMIN_ORDERS.FILTER_ALL },
        { value: "confirmado", label: ADMIN_ORDERS.FILTER_CONFIRMED },
        { value: "pagado", label: ADMIN_ORDERS.FILTER_PAID },
      ];
    }
    if (isDomiciliario) {
      return [
        { value: "todos", label: ADMIN_ORDERS.FILTER_ALL },
        { value: "pagado", label: ADMIN_ORDERS.FILTER_PAID },
        { value: "entregado", label: ADMIN_ORDERS.FILTER_DELIVERED },
      ];
    }
    return [
      { value: "todos", label: ADMIN_ORDERS.FILTER_ALL },
      { value: "pendiente", label: ADMIN_ORDERS.FILTER_PENDING },
      { value: "confirmado", label: ADMIN_ORDERS.FILTER_CONFIRMED },
      { value: "pagado", label: ADMIN_ORDERS.FILTER_PAID },
      { value: "entregado", label: ADMIN_ORDERS.FILTER_DELIVERED },
      { value: "rechazado", label: ADMIN_ORDERS.FILTER_REJECTED },
    ];
  }, [isCocina, isDomiciliario]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Cocina: only show confirmed/paid orders
    if (isCocina) {
      result = result.filter((o) => o.status === "confirmado" || o.status === "pagado");
    }

    // Domiciliario: only show paid/entregado orders
    if (isDomiciliario) {
      result = result.filter(
        (o) => o.status === "pagado" || o.status === "entregado" || o.status === "confirmado",
      );
    }

    // Apply user filter
    if (filter !== "todos") {
      result = result.filter((o) => o.status === filter);
    }

    // Apply search
    if (search) {
      result = result.filter(
        (o) =>
          o.orderNumber.toString().includes(search) ||
          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.customerPhone.includes(search),
      );
    }

    return result;
  }, [orders, filter, search, isCocina, isDomiciliario]);

  const updateStatus = async (
    id: string,
    status: OrderStatus,
    rejectionReason?: string,
  ) => {
    if (!token) return;
    try {
      await updateStatusMutation.mutateAsync({
        id,
        data: { status, rejectionReason },
        token,
      });
    } catch {
      toast.error(ADMIN_ORDERS.TOAST_UPDATE_ERROR);
      throw new Error('update failed');
    }
  };

  const handleConfirm = async (order: Order) => {
    try {
      await updateStatus(order.id, "confirmado");
      toast.success(`Pedido #${order.orderNumber} confirmado`);
    } catch { /* error toast handled in updateStatus */ }
  };

  const handleReject = async (orderId: string) => {
    if (!rejectReason.trim()) {
      toast.error(ADMIN_ORDERS.TOAST_REJECTION_REASON_REQUIRED);
      return;
    }
    try {
      await updateStatus(orderId, "rechazado", rejectReason);
      toast.info(ADMIN_ORDERS.TOAST_REJECTED);
      setRejectingOrder(null);
      setRejectReason("");
    } catch { /* error toast handled in updateStatus */ }
  };

  const handleMarkPaid = async (order: Order) => {
    try {
      await updateStatus(order.id, "pagado");
      toast.success(`Pedido #${order.orderNumber} marcado como pagado`);
    } catch { /* error toast handled in updateStatus */ }
  };

  const handleMarkDelivered = async (order: Order) => {
    try {
      await updateStatus(order.id, "entregado");
      toast.success(`Pedido #${order.orderNumber} entregado`);
    } catch { /* error toast handled in updateStatus */ }
  };

  const handleMarkReady = async (order: Order) => {
    try {
      await updateStatus(order.id, "entregado");
      toast.success(`Pedido #${order.orderNumber} listo`);
    } catch { /* error toast handled in updateStatus */ }
  };

  return (
    <div className="space-y-6 max-w-5xl w-full">
      <div>
        <h1
          className="text-gray-900"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {pageTitle}
        </h1>
        <p className="text-gray-500" style={{ fontSize: "14px" }}>
          {pageSubtitle}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={ADMIN_ORDERS.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
          {filterButtons.map((fb) => (
            <button
              key={fb.value}
              onClick={() => setFilter(fb.value)}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
                filter === fb.value
                  ? "bg-orange-500 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Filter size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">{ADMIN_ORDERS.NO_ORDERS}</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              role={role}
              isExpanded={expandedOrder === order.id}
              onToggleExpand={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
              rejectingOrder={rejectingOrder}
              rejectReason={rejectReason}
              onRejectReasonChange={setRejectReason}
              onStartReject={() => setRejectingOrder(order.id)}
              onCancelReject={() => {
                setRejectingOrder(null);
                setRejectReason("");
              }}
              onConfirm={() => void handleConfirm(order)}
              onReject={() => void handleReject(order.id)}
              onMarkPaid={() => void handleMarkPaid(order)}
              onMarkDelivered={() => void handleMarkDelivered(order)}
              onMarkReady={() => void handleMarkReady(order)}
            />
          ))
        )}
      </div>
    </div>
  );
}
