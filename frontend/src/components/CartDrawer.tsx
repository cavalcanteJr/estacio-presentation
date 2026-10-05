"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop com blur suave */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Seu Carrinho</h2>
                <p className="text-xs text-slate-400">
                  {totalItems} {totalItems === 1 ? "item adicionado" : "itens adicionados"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">Seu carrinho está vazio</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Navegue pelo nosso catálogo e encontre os melhores eletrônicos e gadgets com lojistas verificados.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex gap-3.5 group hover:border-slate-700 transition-all"
                >
                  {/* Foto do Produto */}
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remover produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        Vendido por: <span className="text-slate-300 font-medium">{product.sellerName}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          product.price * quantity
                        )}
                      </span>

                      {/* Controle de Quantidade */}
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5 min-w-[20px] text-center font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com Valores e Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Frete estimado</span>
                  <span className="text-emerald-400 font-semibold">Grátis para compras hoje</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white">Total</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <span>Finalizar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center transition-colors"
                >
                  Ver Carrinho Detalhado
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Compra Segura &bull; Checkout Criptografado</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
