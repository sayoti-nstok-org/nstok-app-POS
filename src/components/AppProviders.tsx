"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { WorkspaceSettingsProvider } from "@/context/WorkspaceSettingsContext";
import { ShiftProvider } from "@/context/ShiftContext";
import { BusinessModeProvider } from "@/context/BusinessModeContext";
import { CartProvider } from "@/context/CartContext";
import { SidebarNav } from "@/components/SidebarNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WorkspaceSettingsProvider>
        <ShiftProvider>
          <BusinessModeProvider>
            <CartProvider>
              <SidebarNav />
              <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto pb-16 lg:pb-0">
                {children}
              </main>
              <MobileBottomNav />
            </CartProvider>
          </BusinessModeProvider>
        </ShiftProvider>
      </WorkspaceSettingsProvider>
    </AuthProvider>
  );
}
