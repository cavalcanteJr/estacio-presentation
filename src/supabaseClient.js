const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ ERRO CRÍTICO: SUPABASE_URL e SUPABASE_KEY são obrigatórios no arquivo .env. Configure o Supabase para prosseguir.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  realtime: {
    transport: WebSocket
  }
});

console.log("⚡ Conectado exclusivamente ao Supabase (PostgreSQL - estacio-presentation):", supabaseUrl);

module.exports = supabase;
