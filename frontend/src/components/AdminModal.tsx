"use client";

import React, { useState, useEffect } from "react";
import { useLab } from "@/context/LabContext";
import { API_BASE } from "@/config/api";
import { X, ShieldAlert, ShieldCheck, DollarSign, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const { currentUser, token, addLog, systemMode } = useLab();
  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isActuallyAdmin = currentUser?.role === "ADMIN";

  const fetchAdminFinancials = async () => {
    setLoading(true);
    setMetrics(null);
    setErrorStatus(null);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/financials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      addLog({
        method: "GET",
        url: "/api/admin/financials",
        status: res.status,
        responseBody: data,
      });

      if (res.status === 200) {
        setMetrics(data);
      } else {
        setErrorStatus(res.status);
        setErrorMessage(data.message || data.error || "Acesso Negado");
      }
    } catch (err: any) {
      setErrorStatus(500);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminFinancials();
    }
  }, [isOpen, currentUser, systemMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Relatório Financeiro Confidencial</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminFinancials}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between">
            <span className="text-slate-400">Usuário da Requisição:</span>
            <span className={`font-bold ${isActuallyAdmin ? "text-emerald-400" : "text-rose-400"}`}>
              {currentUser?.name} ({currentUser?.role})
            </span>
          </div>

          {loading && (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Consultando endpoint /api/admin/financials...
            </div>
          )}

          {/* Success Result (or Leak in V1) */}
          {metrics && (
            <div className="space-y-4">
              {!isActuallyAdmin ? (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>
                    <h4 className="font-bold text-sm">🚨 VAZAMENTO BFLA (200 OK)!</h4>
                    <p className="mt-0.5">
                      Você está autenticado como <strong>{currentUser?.role}</strong>, mas a API vazou os dados estratégicos da diretoria!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Acesso concedido para Administrador legítimo.</span>
                </div>
              )}

              {/* Data Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Valor Total em Estoque</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      metrics.confidentialData?.platformTotalInventoryValue || 0
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Taxa Faturada da Plataforma (10%)</span>
                  <div className="text-xl font-bold font-mono text-sky-400 mt-1">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      metrics.confidentialData?.platformFeeEarned || 0
                    )}
                  </div>
                </div>
              </div>

              {/* Top sellers */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold block mb-2">Maiores Faturamentos por Vendedor:</span>
                <div className="space-y-1.5">
                  {metrics.confidentialData?.topSellers?.map((seller: any) => (
                    <div key={seller.sellerId} className="flex justify-between font-mono">
                      <span className="text-slate-300">{seller.name}</span>
                      <span className="text-emerald-400">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(seller.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Blocked Result (V2 Defense) */}
          {errorStatus === 403 && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-emerald-300 mb-1">
                  🛡️ BFLA BLOQUEADO COM SUCESSO! (403 Forbidden)
                </h4>
                <p>{errorMessage}</p>
                <p className="mt-2 text-[11px] text-emerald-400/80">
                  O middleware de autorização (RBAC) verificou que o seu papel ({currentUser?.role}) não pertence ao grupo permitido [ADMIN].
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
