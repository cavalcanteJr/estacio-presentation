"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Store,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Package,
  Sparkles,
  Terminal
} from "lucide-react";

export default function Navbar() {
  const { user, logout, systemMode, toggleSystemMode } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo e Links de Navegação */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  Tech<span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Market</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                  Oficial Store
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Catálogo
              </Link>

              <Link
                href="/hoppscotch"
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>Instruções API</span>
              </Link>

              {user && (
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Meus Pedidos</span>
                </Link>
              )}

              {user?.role === "SELLER" && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Painel do Vendedor</span>
                </Link>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gestão de Lojistas</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Área de Ações: Carrinho + Modo + Auth */}
          <div className="flex items-center gap-2.5">
            
            {/* Toggle Rápido da API (V1 / V2) para Apresentação */}
            <button
              onClick={() => toggleSystemMode()}
              title={`Modo Atual da API: ${systemMode.toUpperCase()}. Clique para alternar entre V1 (Vulnerável) e V2 (Blindada).`}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                systemMode === "v2"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/50 hover:bg-amber-500/25 animate-pulse"
              }`}
            >
              {systemMode === "v2" ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">API V2 (Blindada)</span>
                  <span className="sm:hidden">V2</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">API V1 (Vulnerável)</span>
                  <span className="sm:hidden">V1</span>
                </>
              )}
            </button>

            {/* Botão de Carrinho com Badge Dinâmico */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-2 group"
              title="Abrir Carrinho"
            >
              <ShoppingBag className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold">Carrinho</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{user.name}</div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">@{user.username}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : user.role === "SELLER"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    }`}>
                      {user.role === "ADMIN" ? "Admin" : user.role === "SELLER" ? "Vendedor" : "Cliente"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Encerrar Sessão"
                  className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-all shadow-md shadow-sky-600/20"
                >
                  Criar Conta
                </Link>
              </div>
            )}

            {/* Acesso Secreto do Palestrante */}
            <Link
              href="/backstage"
              title="Acesso Secreto do Palestrante (Toggle V1/V2)"
              className="p-2 text-slate-600 hover:text-slate-400 transition-colors rounded-xl"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}
