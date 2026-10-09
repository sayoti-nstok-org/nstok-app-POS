"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  UsersRound, 
  Settings, 
  LogOut,
  Store
} from "lucide-react";
import { useAuth, Role } from "@/context/AuthContext";
import { useWorkspaceSettings } from "@/context/WorkspaceSettingsContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Kasir POS",
    href: "/pos",
    icon: ShoppingBag,
    allowedRoles: ["OWNER", "MANAGER", "SUPERVISOR", "KASIR", "STAFF_DAPUR", "TEKNISI"],
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["OWNER", "MANAGER"],
  },
  {
    name: "Inventori Stok",
    href: "/inventory",
    icon: Package,
    allowedRoles: ["OWNER", "MANAGER", "SUPERVISOR"],
  },
  {
    name: "Pelanggan & CRM",
    href: "/customers",
    icon: Users,
    allowedRoles: ["OWNER", "MANAGER", "SUPERVISOR", "KASIR"],
  },
  {
    name: "Pemasok",
    href: "/suppliers",
    icon: Truck,
    allowedRoles: ["OWNER", "MANAGER"],
  },
  {
    name: "Manajemen Tim",
    href: "/team",
    icon: UsersRound,
    allowedRoles: ["OWNER", "MANAGER"],
  },
  {
    name: "Pengaturan Toko",
    href: "/settings",
    icon: Settings,
    allowedRoles: ["OWNER", "MANAGER"],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout, canAccess } = useAuth();
  const { settings } = useWorkspaceSettings();

  // If on login or invite page, do not render sidebar
  if (pathname === "/login" || pathname.startsWith("/accept-invite") || pathname === "/business-select") {
    return null;
  }

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccess(item.allowedRoles));

  return (
    <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col justify-between h-screen shrink-0 sticky top-0 select-none">
      <div>
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-lg shrink-0 shadow-lg shadow-primary/20">
            <Store className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-black text-sm truncate text-foreground">{settings.businessName}</h2>
            <p className="text-xs text-muted-foreground truncate font-semibold">{user?.role || "KASIR"} • {user?.name}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-black">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="p-3 border-t border-border">
        <div className="p-3 rounded-2xl bg-background/80 border border-border mb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-wider">Maximalism POS</p>
            <p className="text-xs font-bold text-foreground">v3.0.0 Unified POS</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-lg shadow-secondary/50 animate-pulse" title="Dual Persistence Active" />
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs text-destructive hover:bg-destructive/10 transition-colors font-bold cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
