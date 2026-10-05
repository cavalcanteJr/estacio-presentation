"use client";

import React, { useState } from "react";
import { Product, useLab } from "@/context/LabContext";
import { API_BASE } from "@/config/api";
import { X, ShieldCheck, ShieldAlert, Zap, AlertTriangle } from "lucide-react";

interface PriceModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function PriceModal({ product, onClose }: PriceModalProps) {
  const { currentUser, token, addLog, refreshProducts, systemMode } = useLab();
  const [newPrice, setNewPrice] = useState<string>("1.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: number;
    title: string;
    message: string;
    isSuccess: boolean;
  } | null>(null);

  if (!product) return null;

  const isOwner = currentUser?.id === product.sellerId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const priceNumber = parseFloat(newPrice);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Informe um preço válido!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/products/${product.id}/price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPrice: priceNumber }),
      });

      const data = await res.json();

      addLog({
        method: "PUT",
        url: `/api/products/${product.id}/price`,
        status: res.status,
        requestBody: { newPrice: priceNumber },
        responseBody: data,
      });

      if (res.status === 200) {
        setResult({
          status: 200,
          isSuccess: true,
          title: isOwner
            ? "Preço Atualizado com Sucesso!"
            : "🚨 VULNERABILIDADE BOLA EXPLORADA COM SUCESSO!",
          message: isOwner
            ? `Você atualizou o seu próprio produto para R$ ${priceNumber.toFixed(2)}.`
            : `Você alterou o preço do produto de "${product.sellerName}" para R$ ${priceNumber.toFixed(2)} sem permissão!`,
        });
        refreshProducts();
      } else if (res.status === 403) {
        setResult({
          status: 403,
          isSuccess: false,
          title: "🛡️ BOLA BLOQUEADO COM SUCESSO! (403 Forbidden)",
          message: data.security_defense || "A API verificou a propriedade do produto e barrou a alteração indevida!",
        });
      } else {
        setResult({
          status: res.status,
          isSuccess: false,
          title: `Erro HTTP ${res.status}`,
          message: data.error || "Ocorreu um erro ao tentar alterar o preço.",
        });
      }
    } catch (err: any) {
      setResult({
        status: 500,
        isSuccess: false,
        title: "Erro de Conexão",
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Alterar Preço do Produto</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Info */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Produto Alvo:</span>
              <span className="font-semibold text-white">{product.name} (#{product.id})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dono Oficial:</span>
              <span className="font-semibold text-sky-300">{product.sellerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Preço Atual:</span>
              <span className="font-mono font-bold text-emerald-400">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Você está logado como:</span>
              <span className={`font-bold ${isOwner ? "text-emerald-400" : "text-rose-400"}`}>
                {currentUser?.name} ({currentUser?.role})
              </span>
            </div>
          </div>

          {/* Quick Exploit Button */}
          {!isOwner && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
              <div className="text-[11px] text-amber-300">
                Ataque Rápido: Derrubar preço para <strong>R$ 1,00</strong>
              </div>
              <button
                type="button"
                onClick={() => setNewPrice("1.00")}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Zap className="w-3 h-3" /> R$ 1,00
              </button>
            </div>
          )}

          {/* Price Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Novo Preço (R$):
            </label>
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-lg focus:outline-none focus:border-sky-500"
              placeholder="0.00"
              required
            />
          </div>

          {/* Result Alert */}
          {result && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                result.isSuccess
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-200"
                  : result.status === 403
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-200"
              }`}
            >
              {result.isSuccess ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : result.status === 403 ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm mb-1">{result.title}</h4>
                <p>{result.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Fechar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                !isOwner
                  ? "bg-rose-600 hover:bg-rose-500"
                  : "bg-sky-600 hover:bg-sky-500"
              }`}
            >
              {loading ? "Enviando Requisição..." : "Disparar PUT /api/products"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
