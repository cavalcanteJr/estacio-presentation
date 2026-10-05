"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/config/api";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Erro ao buscar meus pedidos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders");
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, token]);

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-xs">Carregando histórico de pedidos...</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="w-7 h-7 text-sky-400" />
            <span>Meus Pedidos</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe o andamento das suas compras, envio e rastreamento.
          </p>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4 text-sky-400" />
          <span>Explorar Mais Ofertas</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-white">Nenhum pedido realizado ainda</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Você ainda não realizou compras na plataforma. Navegue pelos nossos produtos e faça seu primeiro pedido!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all"
          >
            <span>Ver Catálogo da Loja</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Barra Superior do Pedido */}
              <div className="p-5 sm:p-6 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                      Data da Compra
                    </span>
                    <span className="text-slate-300 font-mono">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                      Valor Total
                    </span>
                    <span className="text-emerald-400 font-black font-mono">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        order.totalAmount
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                      Identificador
                    </span>
                    <span className="text-white font-mono font-bold">{order.id}</span>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/25 font-bold text-xs">
                    {order.status === "DELIVERED"
                      ? "Entregue"
                      : order.status === "SHIPPED"
                      ? "Em Trânsito"
                      : "Em Preparação"}
                  </span>
                </div>
              </div>

              {/* Linha de Progresso Visual do Pedido */}
              <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-900/50">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mb-1 shadow-md shadow-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200 font-bold text-[11px]">Pagamento Aprovado</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mb-1 shadow-md shadow-emerald-500/20">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-slate-200 font-bold text-[11px]">Em Preparação</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      order.status === "SHIPPED" || order.status === "DELIVERED"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] ${
                      order.status === "SHIPPED" || order.status === "DELIVERED" ? "text-slate-200 font-bold" : "text-slate-500"
                    }`}>
                      Enviado
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] ${
                      order.status === "DELIVERED" ? "text-slate-200 font-bold" : "text-slate-500"
                    }`}>
                      Entregue
                    </span>
                  </div>
                </div>

                {order.trackingCode && (
                  <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                    Código de Rastreamento: <span className="text-sky-400 font-bold">{order.trackingCode}</span>
                  </div>
                )}
              </div>

              {/* Itens do Pedido */}
              <div className="p-6 space-y-4">
                <span className="text-xs font-bold text-slate-300 block">Itens da Compra:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items?.map((it: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3.5"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                        {it.imageUrl && (
                          <img src={it.imageUrl} alt={it.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <h4 className="font-bold text-white truncate">{it.name}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                          Vendido por: <span className="text-slate-300 font-medium">{it.sellerName}</span>
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[11px]">
                          <span className="text-slate-500 font-mono">Qtd: {it.quantity}</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              it.price * it.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dados de Entrega */}
                {order.shippingAddress && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">
                        Entrega: {order.shippingAddress.street}, {order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0">
                      Pagamento: {order.paymentMethod}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
