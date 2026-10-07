import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "nstok-app-POS | OmniPOS Multi-Bisnis Modular",
  description: "Aplikasi kasir multi-bisnis modern, multi-tenant workspace isolation & dual persistence sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
