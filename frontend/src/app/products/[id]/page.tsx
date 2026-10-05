"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart, Product } from "@/context/CartContext";
import { API_BASE } from "@/config/api";
import {
  Store,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Edit,
  CheckCircle2,
  Share2,
  Heart
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      }
    } catch (e) {
      console.error("Erro ao carregar detalhes do produto:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, "").length >= 8) {
      setShippingCalculated(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-xs">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-lg font-bold text-white mb-2">Produto não encontrado</h2>
        <p className="text-xs text-slate-400 mb-6">O item solicitado não está mais disponível no catálogo.</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const isMyProduct = user?.id === product.sellerId;
  const installments = product.price / 10;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb e Voltar */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
        <span className="font-mono text-slate-500">Cód: #{product.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna da Imagem */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
          <div className="relative aspect-square w-full max-w-md rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountBadge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
                {product.discountBadge}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia de 12 Meses</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>Produto Novo & Lacrado</span>
            </div>
          </div>
        </div>

        {/* Coluna de Compra & Detalhes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              {/* Lojista Parceiro */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs text-sky-400">
                  <Store className="w-4 h-4" />
                  <span className="font-semibold">{product.sellerName}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating || 4.8}</span>
                  <span className="text-slate-500 font-normal">({product.reviewsCount || 42} avaliações)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {product.name}
              </h1>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Bloco de Preço */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">Preço à vista com desconto:</div>
              <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight mt-1">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                ou em até 10x de{" "}
                <span className="text-white font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installments)}
                </span>{" "}
                sem juros no cartão
              </div>
            </div>

            {/* Ações de Compra */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {isMyProduct ? (
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs space-y-2">
                  <p className="font-bold">Você é o lojista deste produto.</p>
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar Preço do Produto</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Seletor de Quantidade */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Quantidade:</span>
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-white px-2 font-mono">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="space-y-2.5">
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Comprar Agora</span>
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Adicionar ao Carrinho</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Simulador de Frete por CEP */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Calcular frete e prazo de entrega:
              </label>
              <form onSubmit={handleCalculateShipping} className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Calcular
                </button>
              </form>

              {shippingCalculated && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">SEDEX Expresso</span>
                    <span className="text-emerald-400 font-bold font-mono">Grátis (2 dias úteis)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>PAC Convencional</span>
                    <span>Grátis (5 dias úteis)</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
