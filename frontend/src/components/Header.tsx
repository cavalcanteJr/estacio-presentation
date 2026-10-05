"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLab } from "@/context/LabContext";
import { Shield, ShieldAlert, User as UserIcon, PlusCircle, BarChart3, RotateCcw, Key, Settings } from "lucide-react";

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenAdminModal: () => void;
  onOpenJwtModal: () => void;
}

export default function Header({ onOpenCreateModal, onOpenAdminModal, onOpenJwtModal }: HeaderProps) {
  const { currentUser, usersList, switchUser, systemMode, resetDatabase } = useLab();
  const isV2 = systemMode === "v2";

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Mode Indicator */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                🛍️ <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">TechMarket</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                LAB DEMO
              </span>
            </Link>

            {/* Badge do Modo Ativo com link para /backstage */}
            <Link
              href="/backstage"
              title="Clique para ir à rota escondida de controle"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                isV2
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25 animate-pulse"
              }`}
            >
              {isV2 ? <Shield className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span>{isV2 ? "Modo V2 (Protegido)" : "Modo V1 (Vulnerável)"}</span>
              <Settings className="w-3 h-3 ml-0.5 opacity-60" />
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Novo Produto</span>
            </button>

            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Painel Admin</span>
            </button>

            <button
              onClick={onOpenJwtModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver JWT</span>
            </button>

            <button
              onClick={resetDatabase}
              title="Restaurar dados iniciais"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Quick Switcher Dropdown / Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Logar como:</span>
            {usersList.map((u) => {
              const isActive = currentUser?.username === u.username;
              return (
                <button
                  key={u.username}
                  onClick={() => switchUser(u.username)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-sky-500 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <UserIcon className="w-3 h-3" />
                  <span className="capitalize">{u.username}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive ? "bg-black/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {u.role.substring(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
}
