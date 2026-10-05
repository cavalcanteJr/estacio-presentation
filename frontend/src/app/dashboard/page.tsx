"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/config/api";
import {
  Store,
  Plus,
  Edit,
  Package,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Star,
  Clock,
  Layers,
  Truck
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sellerId: number;
  sellerName: string;
  category?: string;
  imageUrl?: string;
  stock?: number;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"PRODUCTS" | "ORDERS">("PRODUCTS");
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form states para criação
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Notebooks");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [createMsg, setCreateMsg] = useState<{ success: boolean; text: string } | null>(null);

  const fetchMyProducts = async () => {
    if (!token) return;
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_BASE}/api/products/seller/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.products) {
        setMyProducts(data.products);
      }
    } catch (e) {
      console.error("Erro ao buscar meus produtos:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSellerOrders = async () => {
    if (!token) return;
    try {
      setLoadingOrders(true);
      const res = await fetch(`${API_BASE}/api/orders/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.orders) {
        setSellerOrders(data.orders);
      }
    } catch (e) {
      console.error("Erro ao buscar pedidos da loja:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard");
    } else if (user) {
      fetchMyProducts();
      fetchSellerOrders();
    }
  }, [user, loading, token]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          category,
          price: parseFloat(price),
          imageUrl: imageUrl || undefined
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setCreateMsg({ success: true, text: "Produto homologado e publicado no catálogo da loja!" });
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setShowCreateForm(false);
        fetchMyProducts();
      } else {
        setCreateMsg({ success: false, text: data.message || data.error || "Erro ao criar produto." });
      }
    } catch (err: any) {
      setCreateMsg({ success: false, text: err.message });
    }
  };

  if (loading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-xs">Carregando Seller Center...</p>
      </div>
    );
  }

  const totalCatalogValue = myProducts.reduce((acc, p) => acc + p.price, 0);
  const totalSalesRevenue = sellerOrders.reduce((acc, o) => {
    const myItems = o.items.filter((it: any) => Number(it.sellerId) === Number(user.id));
    return acc + myItems.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
  }, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner do Seller Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
            <Store className="w-4 h-4" />
            <span>SELLER CENTER &bull; PAINEL DO LOJISTA PARCEIRO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
            <span>ID do Vendedor: <code className="text-sky-300 font-mono">#{user.id}</code></span>
            <span>&bull;</span>
            <span>Status: <strong className="text-emerald-400 font-semibold">{user.status}</strong></span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.9 / 5.0 (Lojista Verificado)</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showCreateForm ? "Fechar Formulário" : "Publicar Novo Produto"}</span>
        </button>
      </div>

      {/* Cards de Métricas Comerciais da Loja */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Vendas Realizadas</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSalesRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Faturamento bruto faturado em pedidos</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pedidos Recebidos</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {sellerOrders.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Compras feitas por clientes na sua loja</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Produtos no Catálogo</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {myProducts.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Valor do inventário: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalCatalogValue)}</div>
        </div>
      </div>

      {/* Alerta de Feedback de Cadastro */}
      {createMsg && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
          createMsg.success
            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
            : "bg-rose-500/15 border-rose-500/40 text-rose-300"
        }`}>
          {createMsg.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{createMsg.text}</span>
        </div>
      )}

      {/* Formulário de Cadastro de Produto */}
      {showCreateForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Cadastrar Novo Produto para Venda</span>
            </h2>
            <span className="text-xs text-slate-400">Homologação Imediata</span>
          </div>

          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Nome do Produto:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cadeira Gamer Ergonômica Pro"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Preço de Venda (R$):</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Categoria:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Notebooks">Notebooks</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Monitores">Monitores</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Áudio">Áudio</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">URL da Imagem do Produto (Opcional):</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold text-slate-300 mb-1">Descrição Comercial & Especificações:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Informe as características técnicas, diferenciais e garantia..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/20"
              >
                Salvar e Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Navegação por Abas: Produtos vs Pedidos */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("PRODUCTS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "PRODUCTS"
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Meus Produtos Homologados ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ORDERS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ORDERS"
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pedidos Recebidos pela Loja ({sellerOrders.length})</span>
        </button>
      </div>

      {/* Conteúdo Aba: Produtos */}
      {activeTab === "PRODUCTS" && (
        <section>
          {loadingProducts ? (
            <div className="py-16 text-center text-slate-500 text-xs">Carregando itens da sua loja...</div>
          ) : myProducts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
              Sua loja ainda não possui produtos cadastrados. Clique no botão acima para cadastrar o primeiro!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        ID: #{p.id}
                      </span>
                      {p.category && (
                        <span className="text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-lg">
                          {p.category}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-sky-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Preço Atual:</span>
                      <span className="font-bold text-emerald-400 font-mono text-base">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.price)}
                      </span>
                    </div>

                    {/* Botão de Edição de Preço (Alvo do teste BOLA) */}
                    <Link
                      href={`/dashboard/products/${p.id}/edit`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Edit className="w-3.5 h-3.5 text-sky-400" />
                      <span>Editar Preço</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Conteúdo Aba: Pedidos */}
      {activeTab === "ORDERS" && (
        <section>
          {loadingOrders ? (
            <div className="py-16 text-center text-slate-500 text-xs">Carregando pedidos da loja...</div>
          ) : sellerOrders.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
              Sua loja ainda não recebeu pedidos de compras.
            </div>
          ) : (
            <div className="space-y-4">
              {sellerOrders.map((order) => {
                const myItems = order.items.filter(
                  (it: any) => Number(it.sellerId) === Number(user.id)
                );

                return (
                  <div
                    key={order.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-lg"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
                      <div>
                        <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                        <span className="text-slate-500 ml-2">
                          Cliente: <strong className="text-slate-300">{order.customerName}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-slate-400 font-semibold block">Itens pertencentes à sua loja:</span>
                      {myItems.map((it: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                        >
                          <span className="font-bold text-white">{it.name} (x{it.quantity})</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              it.price * it.quantity
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Envio: {order.shippingMethod}</span>
                      <span className="font-mono text-sky-400 font-semibold">Rastreio: {order.trackingCode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

    </main>
  );
}
