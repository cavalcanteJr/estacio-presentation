require("dotenv").config();
const db = require("../db");

async function seed() {
  console.log("🌱 Inicializando e populando base de dados...");
  await db.reset();
  const users = await db.getAllUsers();
  const products = await db.getAllProducts();
  const mode = await db.getSystemMode();

  console.log(`✅ Base pronta! (${db.isSupabaseActive() ? "Supabase Conectado" : "Modo Local"})`);
  console.log(`👥 Usuários: ${users.length}`);
  console.log(`📦 Produtos: ${products.length}`);
  console.log(`⚙️ Modo do Sistema: ${mode.toUpperCase()}`);
  process.exit(0);
}

seed().catch(err => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
