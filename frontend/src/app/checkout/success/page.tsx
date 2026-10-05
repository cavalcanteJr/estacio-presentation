"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/config/api";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Calendar
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { token } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error("Erro ao carregar pedido:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  return (
    <div className="space-y-8">
      {/* Card de Parabéns */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Pedido Confirmado com Sucesso!
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Obrigado pela sua compra! O pagamento foi homologado e seu pedido já está sendo preparado pelos lojistas parceiros.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-400">
          <span>Identificador do Pedido:</span>
          <strong className="text-white">{orderId || "#ORD-CONFIRMADO"}</strong>
        </div>
      </div>

      {/* Detalhes do Pedido */}
      {order && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-sky-400" />
              <span>Resumo do Envio</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              Status: Em Preparação
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Endereço de Entrega
              </span>
              <p className="text-slate-200 font-semibold">{order.shippingAddress?.recipient}</p>
              <p className="text-slate-400">{order.shippingAddress?.street}</p>
              <p className="text-slate-400">
                {order.shippingAddress?.neighborhood} &bull; {order.shippingAddress?.city} - {order.shippingAddress?.state}
              </p>
              <p className="text-slate-500 font-mono">CEP: {order.shippingAddress?.zipCode}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Rastreamento & Envio
              </span>
              <p className="text-slate-200 font-semibold">{order.shippingMethod}</p>
              <p className="text-sky-400 font-mono text-xs mt-1">
                Rastreio: {order.trackingCode}
              </p>
              <p className="text-slate-500 text-[11px] mt-2">
                Previsão de entrega em até 2 dias úteis.
              </p>
            </div>
          </div>

          {/* Itens Comprados */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-300 block">Itens Inclusos:</span>
            {order.items?.map((it: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs gap-3"
              >
                <div className="flex items-center gap-3 truncate">
                  {it.imageUrl && (
                    <img src={it.imageUrl} alt={it.name} className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div className="truncate">
                    <span className="font-semibold text-white truncate block">{it.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Qtd: {it.quantity} &bull; Vendido por: {it.sellerName}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-emerald-400 font-bold shrink-0">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    it.price * it.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Total Pago */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Pago via {order.paymentMethod}:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.totalAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/orders"
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition-all text-center"
        >
          <Package className="w-4 h-4" />
          <span>Ver Meus Pedidos</span>
        </Link>

        <Link
          href="/"
          className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-center"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continuar Comprando</span>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-400 text-xs">Carregando confirmação do pedido...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
