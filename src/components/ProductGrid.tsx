"use client";

import React, { useState } from "react";
import { Search, Tag, Trash2 } from "lucide-react";
import { Product } from "@/db/schema";
import { useCart } from "@/context/CartContext";
import { useWorkspaceSettings } from "@/context/WorkspaceSettingsContext";
import { Input } from "@/components/ui/input";

export function ProductGrid({ 
  products,
  onAddNewProduct,
  onDeleteProduct
}: { 
  products: Product[];
  onAddNewProduct?: () => void;
  onDeleteProduct?: (id: string) => void;
}) {
  const { addToCart, items } = useCart();
  const { formatCurrency } = useWorkspaceSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));
    
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getItemQuantityInCart = (productId: string) => {
    const found = items.find((i) => i.product.id === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Search & Category Tabs */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari menu, SKU, atau scan barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs rounded-2xl bg-card border-border"
          />
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              {cat === "ALL" ? "Semua Menu" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-2xl text-center p-6 space-y-2 bg-card/40">
            <Tag className="w-8 h-8 text-primary" />
            <p className="text-xs font-bold text-foreground">Tidak ada produk ditemukan</p>
            <p className="text-[11px] text-muted-foreground">Coba ubah kata kunci pencarian atau kategori.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {filteredProducts.map((product) => {
              const inCartQty = getItemQuantityInCart(product.id);
              const isLowStock = product.stock <= product.minStockAlert;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && addToCart(product, 1)}
                  className={`group relative rounded-2xl border border-border bg-card p-3 sm:p-4 flex flex-col justify-between transition-all select-none cursor-pointer hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 touch-manipulation ${
                    isOutOfStock ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-wider truncate">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {onDeleteProduct && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProduct(product.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive rounded-lg"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {inCartQty > 0 && (
                        <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground font-black text-xs flex items-center justify-center shadow-md shadow-secondary/40 animate-pulse">
                          {inCartQty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Title & SKU */}
                  <div className="space-y-1 mb-3">
                    <h3 className="font-black text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {product.sku}
                    </p>
                  </div>

                  {/* Bottom: Price & Stock Status */}
                  <div className="pt-2.5 border-t border-border flex items-end justify-between">
                    <div>
                      <p className="text-sm font-black text-primary">
                        {formatCurrency(parseFloat(product.sellingPrice))}
                      </p>
                      {product.wholesalePrice && (
                        <p className="text-[10px] text-muted-foreground font-semibold">
                          Grosir: {formatCurrency(parseFloat(product.wholesalePrice))} (≥{product.minWholesaleQty})
                        </p>
                      )}
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isOutOfStock
                        ? "bg-destructive/20 text-destructive border border-destructive/30"
                        : isLowStock
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-secondary/15 text-secondary border border-secondary/30"
                    }`}>
                      {isOutOfStock ? "Habis" : `${product.stock} ${product.unit}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
