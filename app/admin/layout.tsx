"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  ShoppingBag,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Truck,
  Shield,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { useOrders } from "@/features/order/presentation/hooks/use-order-queries";
import { ADMIN_LAYOUT } from "@/constants/admin/layout";
import { ROLE_CONFIG } from "@/features/auth/domain/entities/user-role";

const allNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: ADMIN_LAYOUT.NAV_ITEMS.DASHBOARD, exact: true, section: "dashboard" },
  { href: "/admin/pos", icon: Monitor, label: ADMIN_LAYOUT.NAV_ITEMS.POS, exact: false, section: "pos" },
  { href: "/admin/pedidos", icon: ClipboardList, label: ADMIN_LAYOUT.NAV_ITEMS.ORDERS, exact: false, section: "pedidos" },
  { href: "/admin/productos", icon: ShoppingBag, label: ADMIN_LAYOUT.NAV_ITEMS.PRODUCTS, exact: false, section: "productos" },
  { href: "/admin/usuarios", icon: Users, label: ADMIN_LAYOUT.NAV_ITEMS.USERS, exact: false, section: "usuarios" },
  { href: "/admin/configuracion", icon: Settings, label: ADMIN_LAYOUT.NAV_ITEMS.SETTINGS, exact: false, section: "configuracion" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout, token, hasAccess, currentUser, role } = useAuth();
  const { settings, updateSettings } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const { data: orders = [] } = useOrders(token ?? "");
  const pendingCount = orders.filter((o) => o.status === "pendiente").length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);
  const [togglingDelivery, setTogglingDelivery] = useState(false);

  const navItems = useMemo(
    () => allNavItems.filter((item) => hasAccess(item.section)),
    [hasAccess],
  );

  const roleConfig = role ? ROLE_CONFIG[role] : null;

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login")
      router.replace("/admin/login");
  }, [isAuthenticated, pathname, router]);

  // Redirect if user doesn't have access to current section
  useEffect(() => {
    if (!isAuthenticated || pathname === "/admin/login") return;
    const currentSection = pathname.split("/")[2] || "dashboard";
    if (!hasAccess(currentSection) && navItems.length > 0) {
      router.replace(navItems[0].href);
    }
  }, [isAuthenticated, pathname, hasAccess, navItems, router]);

  if (!isAuthenticated || pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const handleToggleOpen = async () => {
    if (!token || togglingOpen) return;
    setTogglingOpen(true);
    try {
      await updateSettings({ isOpen: !settings.isOpen }, token);
    } catch {
      // ignore
    } finally {
      setTogglingOpen(false);
    }
  };

  const handleToggleDelivery = async () => {
    if (!token || togglingDelivery) return;
    setTogglingDelivery(true);
    try {
      await updateSettings({ deliveryEnabled: !settings.deliveryEnabled }, token);
    } catch {
      // ignore
    } finally {
      setTogglingDelivery(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      {isAuthenticated && (
        <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white fixed inset-y-0 left-0">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Takillero"
                className="w-24 h-16 rounded-xl"
              />
              <div>
                <p className="text-gray-400" style={{ fontSize: "12px" }}>
                  {ADMIN_LAYOUT.ADMIN_PANEL_LABEL}
                </p>
              </div>
            </div>
            {/* User role badge */}
            {currentUser && roleConfig && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-xl">
                <Shield size={14} className={roleConfig.color} />
                <div>
                  <p className="text-white" style={{ fontSize: "13px", fontWeight: 500 }}>
                    {currentUser.displayName}
                  </p>
                  <p className={roleConfig.color} style={{ fontSize: "11px", fontWeight: 600 }}>
                    {roleConfig.label}
                  </p>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.href, item.exact)
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                <span style={{ fontSize: "14px" }}>{item.label}</span>
                {item.label === ADMIN_LAYOUT.NAV_ITEMS.ORDERS && pendingCount > 0 && (
                  <span
                    className="ml-auto bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ fontSize: "11px", fontWeight: 600 }}
                  >
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-3">
            {role === "admin" && (
              <>
                <button
                  onClick={() => void handleToggleOpen()}
                  disabled={togglingOpen}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    settings.isOpen
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }`}
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${settings.isOpen ? "bg-green-400" : "bg-red-400"}`}
                  />
                  {settings.isOpen ? ADMIN_LAYOUT.BUSINESS_OPEN : ADMIN_LAYOUT.BUSINESS_CLOSED}
                </button>

                {settings.isOpen && (
                  <button
                    onClick={() => void handleToggleDelivery()}
                    disabled={togglingDelivery}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      settings.deliveryEnabled
                        ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
                        : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                    }`}
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    <Truck size={16} />
                    {settings.deliveryEnabled ? ADMIN_LAYOUT.DELIVERY_ON : ADMIN_LAYOUT.DELIVERY_OFF}
                  </button>
                )}
              </>
            )}

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              style={{ fontSize: "13px" }}
            >
              <ChevronLeft size={16} /> {ADMIN_LAYOUT.VIEW_STORE}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors"
              style={{ fontSize: "13px" }}
            >
              <LogOut size={16} /> {ADMIN_LAYOUT.LOGOUT}
            </button>
          </div>
        </aside>
      )}

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 700 }}>{ADMIN_LAYOUT.ADMIN_TITLE}</span>
          {roleConfig && (
            <span
              className={`px-2 py-0.5 rounded-full ${roleConfig.bg} ${roleConfig.color}`}
              style={{ fontSize: "10px", fontWeight: 600 }}
            >
              {roleConfig.label}
            </span>
          )}
          {pendingCount > 0 && (
            <span
              className="bg-red-500 text-white px-2 py-0.5 rounded-full"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              {pendingCount} {ADMIN_LAYOUT.PENDING_SUFFIX}{pendingCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {role === "admin" && (
          <button
            onClick={() => void handleToggleOpen()}
            disabled={togglingOpen}
            className={`px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${
              settings.isOpen
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            {settings.isOpen ? ADMIN_LAYOUT.OPEN : ADMIN_LAYOUT.CLOSED}
          </button>
        )}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 text-white flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
              <span style={{ fontWeight: 700 }}>{ADMIN_LAYOUT.MOBILE_MENU_TITLE}</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {/* Mobile role badge */}
            {currentUser && roleConfig && (
              <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-xl">
                <Shield size={14} className={roleConfig.color} />
                <div>
                  <p className="text-white" style={{ fontSize: "13px", fontWeight: 500 }}>
                    {currentUser.displayName}
                  </p>
                  <p className={roleConfig.color} style={{ fontSize: "11px", fontWeight: 600 }}>
                    {roleConfig.label}
                  </p>
                </div>
              </div>
            )}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.href, item.exact)
                      ? "bg-orange-500/20 text-orange-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon size={20} />
                  <span style={{ fontSize: "14px" }}>{item.label}</span>
                  {item.label === ADMIN_LAYOUT.NAV_ITEMS.ORDERS && pendingCount > 0 && (
                    <span
                      className="ml-auto bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ fontSize: "11px", fontWeight: 600 }}
                    >
                      {pendingCount > 99 ? "99+" : pendingCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-800 space-y-2">
              {role === "admin" && settings.isOpen && (
                <button
                  onClick={() => void handleToggleDelivery()}
                  disabled={togglingDelivery}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    settings.deliveryEnabled
                      ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
                      : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  }`}
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  <Truck size={16} />
                  {settings.deliveryEnabled ? ADMIN_LAYOUT.DELIVERY_ON : ADMIN_LAYOUT.DELIVERY_OFF}
                </button>
              )}
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="block text-gray-400 px-4 py-2"
                style={{ fontSize: "13px" }}
              >
                {ADMIN_LAYOUT.VIEW_STORE}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 px-4 py-2"
                style={{ fontSize: "13px" }}
              >
                {ADMIN_LAYOUT.LOGOUT}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main
        className={`flex-1 pt-14 lg:pt-0 min-h-screen overflow-auto ${isAuthenticated ? "lg:ml-64" : ""}`}
      >
        <div className={`${isAuthenticated ? "p-4 sm:p-6 lg:p-8 flex justify-center" : ""}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
