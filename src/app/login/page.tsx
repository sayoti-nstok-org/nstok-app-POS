"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-redirect jika user sudah login (tidak boleh membuka /login sebelum logout)
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (!user.hasCompletedOnboarding) {
        router.replace("/business-select");
      } else {
        router.replace("/pos");
      }
    }
  }, [user, isAuthenticated, authLoading, router]);

  // Tampilkan loading screen jika sesi aktif sedang dialihkan
  if (authLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto glow-primary" />
          <p className="text-xs font-bold text-foreground">Memeriksa status sesi akun...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!userName.trim() || !email.trim() || !password) {
          setErrorMessage("Semua kolom formulir pendaftaran wajib diisi.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage("Kata sandi minimal 6 karakter.");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage("Konfirmasi kata sandi tidak cocok.");
          setIsLoading(false);
          return;
        }

        const res = await register(userName, email, password, "OWNER");
        if (res.success) {
          setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke langkah pemilihan bisnis...");
          setTimeout(() => {
            router.push("/business-select");
          }, 600);
        } else {
          setErrorMessage(res.error || "Gagal mendaftarkan akun.");
        }
      } else {
        if (!email.trim() || !password) {
          setErrorMessage("Email dan kata sandi wajib diisi.");
          setIsLoading(false);
          return;
        }

        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage("Login berhasil! Mengalihkan...");
          setTimeout(() => {
            if (res.needsOnboarding) {
              router.push("/business-select");
            } else {
              router.push("/pos");
            }
          }, 500);
        } else {
          setErrorMessage(res.error || "Email atau kata sandi tidak cocok.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto p-4 py-8 sm:py-12 flex flex-col justify-start items-center bg-background text-foreground font-sans">
      <div className="w-full max-w-md my-auto bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-primary/20 via-card to-card border-b border-border text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl mx-auto shadow-xl shadow-primary/30 glow-primary">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            &Stok
          </h1>
          <p className="text-xs text-muted-foreground font-semibold">
            OmniPOS Multi-Arketipe Bisnis • Maximalism Edition
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-background/60 p-1.5">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer ${!isRegister
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Masuk Sesi Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer ${isRegister
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Daftar Akun Baru (Owner)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{errorMessage}</p>
                {isRegister && errorMessage.includes("sudah terdaftar") && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMessage(null);
                    }}
                    className="text-secondary hover:underline font-black cursor-pointer block mt-1"
                  >
                    Klik di sini untuk langsung Masuk →
                  </button>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-1.5">
                Nama Lengkap Pemilik
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Bpk. Hendra Gunawan"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-1.5">
              Alamat Email {isRegister ? "Bisnis" : "Kasir / Staf"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-2xl pl-10 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-black text-foreground uppercase tracking-wider mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 bg-secondary hover:bg-secondary/90 active:scale-98 text-secondary-foreground font-black text-xs rounded-2xl shadow-xl shadow-secondary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer glow-secondary"
          >
            <span>{isLoading ? "Memproses..." : isRegister ? "Daftar & Lanjut Pilih Bisnis" : "Masuk ke Kasir POS"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Info */}
        <div className="p-4 bg-background/80 border-t border-border text-center">
          <p className="text-[11px] text-muted-foreground font-semibold">
            {isRegister
              ? "Pilihan jenis bisnis & nama toko akan diatur pada langkah berikutnya."
              : "Sistem otomatis mengarahkan ke workspace & katalog toko Anda."}
          </p>
        </div>
      </div>
    </div>
  );
}
