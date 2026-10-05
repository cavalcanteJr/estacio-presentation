"use client";

import React from "react";
import { Product, useLab } from "@/context/LabContext";
import { Tag, Store, Edit3, AlertCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEditPrice: (product: Product) => void;
}

export default function ProductCard({ product, onEditPrice }: ProductCardProps) {
  const { currentUser } = useLab();

  // Verifica se o usuário atual é o proprietário do produto
  const isOwner = currentUser?.id === product.sellerId;
  const isSeller = currentUser?.role === "SELLER";

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group relative">
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
            ID: #{product.id}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Store className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate max-w-[140px]">{product.sellerName}</span>
          </div>
        </div>

        {/* Name and Description */}
        <h3 className="font-bold text-base text-white group-hover:text-sky-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60">
        {/* Price */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-xs text-slate-400">Preço Atual:</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
          </span>
        </div>

        {/* Exploit Target Alert */}
        {!isOwner && isSeller && (
          <div className="mb-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5 text-[11px] text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>Produto do concorrente! Teste o <strong>BOLA</strong> aqui.</span>
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => onEditPrice(product)}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            !isOwner && isSeller
              ? "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40"
              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{!isOwner && isSeller ? "Alterar Preço Alheio (BOLA)" : "Editar Preço"}</span>
        </button>
      </div>
    </div>
  );
}
