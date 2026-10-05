"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart, Product } from "@/context/CartContext";
import { API_BASE } from "@/config/api";
import {
  Store,
  Search,
  ShoppingBag,
  Edit,
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  Flame,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const CATEGORIES = [
  "Todos",
  "Notebooks",
  "Smartphones",
  "Monitores",
  "Áudio",
  "Periféricos",
  "Tablets",
  "Hardware"
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      if (res.ok && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Erro ao carregar produtos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Banner de E-commerce */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl shadow-black/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketplace Oficial de Tecnologia & Eletrônicos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Os melhores gadgets com <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">lojistas verificados</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
            Compre notebooks de alto desempenho, smartphones de última geração e periféricos com garantia oficial, entrega expressa e parcelamento sem juros.
          </p>

          {/* Barra de Pesquisa */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1 bg-slate-950/90 border border-slate-700/80 rounded-2xl px-4 py-3 focus-within:border-sky-500 transition-all shadow-xl">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por MacBook, Galaxy S24, monitores, periféricos..."
                className="bg-transparent border-none text-white text-xs sm:text-sm pl-7 focus:outline-none w-full placeholder-slate-500"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Limpar Busca
              </button>
            )}
          </div>

          {/* Badges de Benefícios */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Frete Grátis Brasil</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Até 12x Sem Juros</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Garantia de 1 Ano</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Lojistas Certificados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias & Filtros */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-400" />
              <span>Departamentos em Destaque</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Filtre os produtos pelos principais departamentos da plataforma.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1 rounded-xl">
            {filteredProducts.length} itens encontrados
          </span>
        </div>

        {/* Pílulas de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-500"
                    : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid de Produtos */}
      <section>
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
            <p className="text-slate-400 text-xs">Carregando catálogo oficial...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-10">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">Nenhum produto encontrado</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tente buscar por outro termo ou selecione a categoria "Todos" para ver todos os itens disponíveis.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Todos");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isMyProduct = user?.id === p.sellerId;
              const installmentsValue = p.price / 10;

              return (
                <div
                  key={p.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:shadow-2xl hover:shadow-black/40 relative"
                >
                  {/* Imagem do Produto com Badge */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={p.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge Promocional */}
                    {p.discountBadge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md backdrop-blur-sm">
                        {p.discountBadge}
                      </span>
                    )}

                    {/* Tag Categoria */}
                    {p.category && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-slate-950/80 text-slate-300 font-mono text-[10px] border border-slate-800 backdrop-blur-sm">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {/* Informações Comerciais */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Vendedor e Avaliação */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                          <Store className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate font-medium text-slate-300">{p.sellerName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{p.rating || 4.8}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({p.reviewsCount || 42})</span>
                        </div>
                      </div>

                      {/* Nome do Produto com Link */}
                      <Link href={`/products/${p.id}`} className="block">
                        <h3 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug">
                          {p.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Bloco de Preços & Parcelas */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <div className="mb-3">
                        <div className="text-[11px] text-slate-400">À vista no PIX com desconto:</div>
                        <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight leading-none mt-1">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.price)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          ou em até 10x de{" "}
                          <span className="text-slate-200 font-bold">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installmentsValue)}
                          </span>{" "}
                          sem juros
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="space-y-2">
                        {isMyProduct ? (
                          <Link
                            href={`/dashboard/products/${p.id}/edit`}
                            className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5 text-sky-400" />
                            <span>Gerenciar Preço (Meu Item)</span>
                          </Link>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="py-2.5 px-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
                              <span>Carrinho</span>
                            </button>

                            <button
                              onClick={() => handleBuyNow(p)}
                              className="py-2.5 px-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-1"
                            >
                              <span>Comprar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}
