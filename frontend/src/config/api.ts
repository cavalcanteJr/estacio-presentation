/**
 * Configuração centralizada da URL base da API
 * Permite alternar facilmente entre ambiente local (Docker / localhost)
 * e ambiente de produção (Render / Vercel).
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/$/, "");
