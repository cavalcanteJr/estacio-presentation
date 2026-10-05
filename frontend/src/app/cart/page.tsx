"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Store
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = coupon.trim().toUpperCase();
    if (code === "TECH10" || code === "PRIMEIRACOMPRA") {
      setAppliedCoupon({ code, discountPercent: 10 });
    } else {
      setCouponError("Cupom inválido ou expirado. Tente TECH10");
    }
  };

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const shippingCost = subtotal > 300 ? 0 : 25;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-white">Seu carrinho de compras está vazio</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
          Explore as melhores ofertas de tecnologia com lojistas homologados e adicione itens para continuar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explorar Catálogo</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-sky-400" />
            <span>Meu Carrinho de Compras</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revise seus itens, quantidades e aplique cupons antes de fechar o pedido.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-400 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Esvaziar Carrinho</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de Itens do Carrinho */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                  <img
                    src={product.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    ID #{product.id}
                  </span>
                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="font-bold text-sm text-white hover:text-sky-300 transition-colors truncate max-w-xs mt-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Store className="w-3 h-3 text-sky-400" />
                    <span>{product.sellerName}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Unitário: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                {/* Controles de Quantidade */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-white px-2 font-mono">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal do item */}
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      product.price * quantity
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors mt-0.5"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Cupom de Desconto */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-sky-400" />
              <span>Cupom Promocional</span>
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Ex: TECH10"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Aplicar
              </button>
            </form>

            {appliedCoupon && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cupom <strong>{appliedCoupon.code}</strong> aplicado com sucesso! ({appliedCoupon.discountPercent}% OFF)
              </p>
            )}

            {couponError && (
              <p className="text-xs text-rose-400 mt-2">{couponError}</p>
            )}
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white pb-4 border-b border-slate-800">
            Resumo do Pedido
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Subtotal ({totalItems} itens)</span>
              <span className="font-mono text-slate-200">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Desconto ({appliedCoupon.code})</span>
                <span className="font-mono">
                  - {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(discountAmount)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-400">
              <span>Frete de Envio</span>
              <span className="font-mono text-slate-200">
                {shippingCost === 0 ? (
                  <span className="text-emerald-400 font-bold">Grátis</span>
                ) : (
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(shippingCost)
                )}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold text-white block">Valor Total</span>
                <span className="text-[10px] text-slate-400 font-mono">Em até 10x sem juros</span>
              </div>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(finalTotal)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition-all"
            >
              <span>Prosseguir para Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-400 hover:text-white block transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ambiente 100% Seguro & Homologado</span>
          </div>
        </div>
      </div>
    </main>
  );
}
