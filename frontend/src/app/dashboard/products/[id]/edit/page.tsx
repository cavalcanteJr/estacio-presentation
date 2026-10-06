"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE, apiFetch } from "@/config/api";
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sellerId: number;
  sellerName: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setNewPrice(data.price.toString());
      } else {
        setStatusMessage({
          type: "error",
          text: "Produto não encontrado.",
        });
      }
    } catch (e: any) {
      setStatusMessage({
        type: "error",
        text: "Erro de conexão ao carregar produto.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (productId) {
      fetchProduct();
    }
  }, [productId, user, authLoading]);

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Informe um preço válido!");
      setSubmitting(false);
      return;
    }

    try {
      const res = await apiFetch(`${API_BASE}/api/products/${productId}/price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPrice: priceNum }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setStatusMessage({
          type: "success",
          text: data.message || "Alterações salvas com sucesso!",
        });
        fetchProduct();
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || data.error || "Não foi possível atualizar o produto.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Erro de conexão ao salvar alterações.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="py-20 text-center text-slate-500 text-sm">Carregando dados do produto...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Botão Voltar */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        
        {/* Header da Ficha */}
        <div className="pb-6 border-b border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
            Item #{productId}
          </span>
          <h1 className="text-2xl font-black text-white mt-2">
            {product?.name || "Editar Produto"}
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {product?.description}
          </p>
        </div>

        {/* Feedback Discreto de Operação */}
        {statusMessage && (
          <div
            className={`mt-6 p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-2.5 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/40 text-rose-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Formulário de Edição */}
        <form onSubmit={handleSavePrice} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Preço de Venda (R$):
            </label>
            <input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-md shadow-sky-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? "Salvando..." : "Salvar Alterações"}</span>
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
