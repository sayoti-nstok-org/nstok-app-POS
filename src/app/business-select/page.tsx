"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Scissors, 
  Wrench, 
  Boxes, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Store,
  Sparkles,
  Loader2
} from "lucide-react";
import { useBusinessMode, BusinessArchetype, ARCHETYPES } from "@/context/BusinessModeContext";
import { useWorkspaceSettings } from "@/context/WorkspaceSettingsContext";
import { useAuth } from "@/context/AuthContext";

export default function BusinessSelectPage() {
  const router = useRouter();
  const { user, updateUserWorkspace, isLoading: authLoading } = useAuth();
  const { mode, setMode } = useBusinessMode();
  const { updateSettings } = useWorkspaceSettings();

  const [selectedType, setSelectedType] = useState<BusinessArchetype>("FNB");
  const [customBusinessName, setCustomBusinessName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    // 1 Akun = 1 Jenis Bisnis: jika sudah pernah onboarding, kunci dan langsung arahkan ke POS
    if (user?.hasCompletedOnboarding && user?.businessType) {
      router.push("/pos");
      return;
    }

    if (user?.organizationName) {
      setCustomBusinessName(user.organizationName);
    } else {
      setCustomBusinessName("Usaha Baru Saya");
    }
    if (user?.businessType && ARCHETYPES[user.businessType as BusinessArchetype]) {
      setSelectedType(user.businessType as BusinessArchetype);
    }
  }, [user, authLoading, router]);

  const getArchetypeIcon = (type: BusinessArchetype) => {
    switch (type) {
      case "FNB": return <UtensilsCrossed className="w-6 h-6" />;
      case "RETAIL": return <ShoppingBag className="w-6 h-6" />;
      case "SALON": return <Scissors className="w-6 h-6" />;
      case "SERVICES": return <Wrench className="w-6 h-6" />;
      case "WHOLESALE": return <Boxes className="w-6 h-6" />;
      case "HYBRID": return <Globe className="w-6 h-6" />;
    }
  };

  const handleSelectAndProceed = async () => {
    if (!customBusinessName.trim()) {
      alert("Silakan masukkan nama bisnis / toko Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
      setMode(selectedType);
      updateSettings({ businessName: customBusinessName.trim() });
      await updateUserWorkspace(customBusinessName.trim(), selectedType);

      setTimeout(() => {
        router.push("/pos");
      }, 400);
    } catch (e) {
      console.error("Error setting business type:", e);
      router.push("/pos");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-xs font-bold text-foreground">Memuat konfigurasi workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-y-auto p-4 sm:p-8 py-8 sm:py-12 bg-background text-foreground font-sans flex flex-col justify-start items-center">
      <div className="w-full max-w-4xl space-y-6 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black mb-1 glow-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Onboarding Toko Baru: {user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Pilih Jenis Usaha & Konfigurasi Toko Anda
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto font-medium">
            Sistem nstok-APP-pos akan otomatis menyiapkan template produk dan mengaktifkan modul khusus untuk workspace toko Anda.
          </p>
        </div>

        {/* Business Name Input Card */}
        <div className="max-w-md mx-auto p-5 rounded-3xl border border-border bg-card shadow-2xl space-y-2 backdrop-blur-md">
          <label className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4 text-primary" />
            <span>Nama Bisnis / Toko Anda</span>
          </label>
          <input
            placeholder="Contoh: Kopi Kenangan, Minimarket Berkah, dll"
            value={customBusinessName}
            onChange={(e) => setCustomBusinessName(e.target.value)}
            className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-bold"
          />
        </div>

        {/* Archetype Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ARCHETYPES) as BusinessArchetype[]).map((type) => {
            const info = ARCHETYPES[type];
            const isSelected = selectedType === type;

            return (
              <div
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "border-primary bg-primary/15 shadow-2xl shadow-primary/20 ring-2 ring-primary scale-[1.02]"
                    : "border-border bg-card hover:bg-muted/50 hover:border-border/80"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                      isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
                    }`}>
                      {getArchetypeIcon(type)}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-secondary animate-in zoom-in-50" />}
                  </div>

                  <div>
                    <h3 className="font-black text-base text-foreground">{info.name}</h3>
                    <span className="text-[11px] font-bold text-secondary">Vertikal {info.badge}</span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border">
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider block">
                      Modul Otomatis:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {info.features.map((feat) => (
                        <span key={feat} className="text-[10px] font-bold bg-background border border-border text-foreground px-2 py-0.5 rounded-full">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSelectAndProceed}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[280px] py-4 px-8 rounded-2xl bg-secondary hover:bg-secondary/90 active:scale-95 text-secondary-foreground font-black text-sm shadow-xl shadow-secondary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer glow-secondary"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Mulai Menggunakan POS Toko</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
