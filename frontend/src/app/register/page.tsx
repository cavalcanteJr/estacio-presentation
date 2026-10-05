"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserPlus, User, Lock, Store, ShoppingBag, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("SELLER");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessInfo(null);

    const res = await register({
      name,
      username,
      password,
      role,
    });

    if (res.success) {
      setSuccessInfo(res.message || "Cadastro realizado com sucesso!");
    } else {
      setErrorMessage(res.message || "Erro ao realizar cadastro.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 mb-3 border border-sky-500/20">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Criar Nova Conta</h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre-se como cliente ou registre sua loja como vendedor parceiro.
          </p>
        </div>

        {/* Success Alert */}
        {successInfo && (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 mb-1">
              <CheckCircle2 className="w-5 h-5" />
              <span>Cadastro Registrado!</span>
            </div>
            <p className="leading-relaxed">{successInfo}</p>
            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                Ir para o Login <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {!successInfo && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Escolha do Tipo de Conta */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Tipo de Cadastro
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("SELLER")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === "SELLER"
                      ? "bg-sky-500/20 border-sky-500 text-white shadow-lg shadow-sky-500/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-400">
                    <Store className="w-4 h-4" />
                    <span>Lojista (Vendedor)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Requer aprovação do Admin.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    role === "CUSTOMER"
                      ? "bg-sky-500/20 border-sky-500 text-white shadow-lg shadow-sky-500/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-indigo-400">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Comprador (Cliente)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    Acesso imediato à vitrine.
                  </p>
                </button>
              </div>
            </div>

            {/* Nome Completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {role === "SELLER" ? "Nome da Loja / Razão Social" : "Seu Nome Completo"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "SELLER" ? "ex: Loja Gamer Tech" : "ex: Rodrigo Silva"}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome de Usuário (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: rodrigotech"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Concluir Cadastro"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          Já possui conta?{" "}
          <Link href="/login" className="text-sky-400 hover:text-sky-300 font-bold underline">
            Faça login aqui
          </Link>
        </div>

      </div>
    </div>
  );
}
