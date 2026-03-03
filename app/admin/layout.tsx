"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { orderService } from "@/services/order.service";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  {
    href: "/admin/pedidos",
    icon: ClipboardList,
    label: "Pedidos",
    exact: false,
  },
  {
    href: "/admin/productos",
    icon: ShoppingBag,
    label: "Productos",
    exact: false,
  },
  {
    href: "/admin/configuracion",
    icon: Settings,
    label: "Configuracion",
    exact: false,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout, token } = useAuth();
  const { settings, updateSettings } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login")
      router.replace("/admin/login");
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    if (!token) return;
    orderService
      .getOrders(token)
      .then((orders) => {
        setPendingCount(orders.filter((o) => o.status === "pendiente").length);
      })
      .catch(() => {});
  }, [token]);

  // Mientras no está autenticado, solo renderizar el children (página de login)
  if (!isAuthenticated) {
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
    if (!token) return;
    try {
      await updateSettings({ isOpen: !settings.isOpen }, token);
    } catch {
      // ignore
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
                  Admin Panel
                </p>
              </div>
            </div>
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
                {item.label === "Pedidos" && pendingCount > 0 && (
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
            <button
              onClick={() => void handleToggleOpen()}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                settings.isOpen
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              }`}
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${settings.isOpen ? "bg-green-400" : "bg-red-400"}`}
              />
              {settings.isOpen ? "Negocio Abierto" : "Negocio Cerrado"}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              style={{ fontSize: "13px" }}
            >
              <ChevronLeft size={16} /> Ver tienda
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors"
              style={{ fontSize: "13px" }}
            >
              <LogOut size={16} /> Cerrar sesion
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
          <span style={{ fontWeight: 700 }}>Admin</span>
          {pendingCount > 0 && (
            <span
              className="bg-red-500 text-white px-2 py-0.5 rounded-full"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => void handleToggleOpen()}
          className={`px-3 py-1 rounded-full ${
            settings.isOpen
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
          style={{ fontSize: "12px", fontWeight: 600 }}
        >
          {settings.isOpen ? "Abierto" : "Cerrado"}
        </button>
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
              <span style={{ fontWeight: 700 }}>Menu Admin</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
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
                  {item.label === "Pedidos" && pendingCount > 0 && (
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
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="block text-gray-400 px-4 py-2"
                style={{ fontSize: "13px" }}
              >
                Ver tienda
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 px-4 py-2"
                style={{ fontSize: "13px" }}
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main
        className={`flex-1 pt-14 lg:pt-0 min-h-screen overflow-auto ${isAuthenticated ? "lg:ml-64" : ""}`}
      >
        <div className={`${isAuthenticated ? "p-4 sm:p-6 lg:p-8" : ""}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
