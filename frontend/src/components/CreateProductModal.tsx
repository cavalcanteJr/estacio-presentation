"use client";

import React, { useState } from "react";
import { useLab } from "@/context/LabContext";
import { API_BASE } from "@/config/api";
import { X, ShieldAlert, ShieldCheck, AlertCircle } from "lucide-react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const { currentUser, token, addLog, refreshProducts } = useLab();
  const [name, setName] = useState<string>("PlayStation 5 Pro");
  const [description, setDescription] = useState<string>("Cadastrado para testar vulnerabilidade BFLA");
  const [price, setPrice] = useState<string>("3500.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    status: number;
    title: string;
    message: string;
    isSuccess: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const isCustomer = currentUser?.role === "CUSTOMER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

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
          price: parseFloat(price),
        }),
      });

      const data = await res.json();

      addLog({
        method: "POST",
        url: "/api/products",
        status: res.status,
        requestBody: { name, price: parseFloat(price) },
        responseBody: data,
      });

      if (res.status === 201) {
        setResult({
          status: 201,
          isSuccess: true,
          title: isCustomer
            ? "🚨 FALHA BFLA EXPLORADA! Cliente Comum Cadastrou Produto!"
            : "Produto Criado com Sucesso!",
          message: isCustomer
            ? `O usuário com papel CUSTOMER conseguiu injetar um produto no catálogo da loja!`
            : "Produto adicionado ao catálogo pelo vendedor autorizado.",
        });
        refreshProducts();
      } else if (res.status === 403) {
        setResult({
          status: 403,
          isSuccess: false,
          title: "🛡️ BFLA BLOQUEADO COM SUCESSO! (403 Forbidden)",
          message: data.message || "Apenas vendedores (SELLER) ou administradores têm permissão para criar produtos!",
        });
      } else {
        setResult({
          status: res.status,
          isSuccess: false,
          title: `Erro HTTP ${res.status}`,
          message: data.error || "Erro ao cadastrar produto.",
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
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Cadastrar Novo Produto</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">Usuário Ativo:</span>
            <span className="font-bold text-white">
              {currentUser?.name} (<span className="text-sky-400">{currentUser?.role}</span>)
            </span>
          </div>

          {isCustomer && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Você está logado como <strong>Cliente</strong>. Clientes nunca deveriam poder criar produtos!
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nome do Produto:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Descrição:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Preço (R$):</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:outline-none focus:border-sky-500"
              required
            />
          </div>

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
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm mb-1">{result.title}</h4>
                <p>{result.message}</p>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Fechar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500"
            >
              {loading ? "Criando..." : "Disparar POST /api/products"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
