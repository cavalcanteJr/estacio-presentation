"use client";

import React, { useState } from "react";
import { useLab, HttpLog } from "@/context/LabContext";
import { Terminal, ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export default function RequestConsole() {
  const { logs, clearLogs } = useLab();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const lastLog = logs[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md transition-all duration-300">
      {/* Console Bar Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-900/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-bold">Console HTTP REST</span>
          </div>

          {lastLog && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                lastLog.status < 300
                  ? "bg-emerald-500/20 text-emerald-400"
                  : lastLog.status === 403
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}>
                {lastLog.status}
              </span>
              <span className="text-slate-400 font-bold">{lastLog.method}</span>
              <span className="text-slate-200">{lastLog.url}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearLogs();
              }}
              title="Limpar logs"
              className="p-1 text-slate-400 hover:text-white"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[11px] text-slate-400 font-mono">
            {logs.length} requisições
          </span>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Log List */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 py-3 max-h-60 overflow-y-auto space-y-2 border-t border-slate-800/60 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="py-4 text-center text-slate-400 text-xs">
              Nenhuma requisição registrada ainda. Clique em alguma ação para inspecionar!
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                    log.status < 300
                      ? "bg-emerald-500/20 text-emerald-400"
                      : log.status === 403
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-sky-300 font-bold">{log.method}</span>
                  <span className="text-white">{log.url}</span>
                </div>

                {log.responseBody && (
                  <div className="text-[11px] text-slate-400 truncate max-w-md">
                    {JSON.stringify(log.responseBody)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
