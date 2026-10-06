require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const authRoutes = require("./routes/auth.routes");
const systemRoutes = require("./routes/system.routes");
const dynamicProducts = require("./routes/products.dynamic");
const dynamicAdmin = require("./routes/admin.dynamic");
const dynamicOrders = require("./routes/orders.dynamic");

const productsV1Routes = require("./routes/v1/products.v1");
const adminV1Routes = require("./routes/v1/admin.v1");
const ordersV1Routes = require("./routes/v1/orders.v1");

const productsV2Routes = require("./routes/v2/products.v2");
const adminV2Routes = require("./routes/v2/admin.v2");
const ordersV2Routes = require("./routes/v2/orders.v2");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração robusta de CORS para suportar frontends locais, na Vercel (*.vercel.app) e no Render
const configuredOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite chamadas sem header origin (curl, mobile apps, SSR server-to-server)
    if (!origin) return callback(null, true);

    // Permite se explicitamente configurado como coringa
    if (configuredOrigins.includes("*")) return callback(null, true);

    // Permite domínios listados em ALLOWED_ORIGINS
    if (configuredOrigins.includes(origin)) return callback(null, true);

    // Permite qualquer preview ou produção na Vercel (*.vercel.app)
    if (origin.endsWith(".vercel.app")) return callback(null, true);

    // Permite qualquer subdomínio do Render (*.onrender.com)
    if (origin.endsWith(".onrender.com")) return callback(null, true);

    // Permite ambientes locais (localhost / 127.0.0.1 em qualquer porta)
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, true);
    }

    // Por padrão no laboratório educacional, libera para evitar bloqueios indesejados na apresentação
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["X-System-Mode"],
  optionsSuccessStatus: 204
};

app.set("etag", false);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Injeta o modo atual da API no cabeçalho X-System-Mode de todas as respostas
app.use(async (req, res, next) => {
  try {
    const currentMode = await db.getSystemMode();
    res.setHeader("X-System-Mode", currentMode);
  } catch {
    // se falhar temporariamente, segue o fluxo
  }
  next();
});

// Desativa cache para garantir respostas dinâmicas em tempo real (evita 304 Not Modified)
app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store"
  });
  next();
});

// Healthcheck essencial para Docker e Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Log simples de requisições para auditoria didática
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} -> Status ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Servir arquivos estáticos da pasta presentation (slides da palestra)
app.use("/slides", express.static(path.join(__dirname, "../presentation")));

// Rota Informativa Inicial
app.get("/", async (req, res) => {
  try {
    const currentMode = await db.getSystemMode();
    res.json({
      title: "Lab de Segurança em REST APIs - Demonstração Didática",
      activeMode: currentMode,
      database: "Supabase (PostgreSQL - estacio-presentation)",
      fallback: "DESATIVADO (100% Supabase Direto)",
      presentationSlides: `http://localhost:${PORT}/slides/presentation.html`,
      endpoints: {
        auth: "/api/auth/login, /api/auth/register, /api/auth/me",
        system: "GET/POST /api/system/mode",
        products: "/api/products (dinâmico), /api/v1/products, /api/v2/products",
        orders: "/api/orders (dinâmico), /api/v1/orders, /api/v2/orders",
        admin: "/api/admin/sellers, /api/admin/financials"
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erro de conexão com o Supabase", details: err.message });
  }
});

// Endpoint global de reset do banco de dados no Supabase
app.post("/api/reset", async (req, res) => {
  try {
    await db.reset();
    res.json({
      message: "Banco de dados do Supabase restaurado com sucesso para o estado original!",
      database: "Supabase (PostgreSQL)"
    });
  } catch (err) {
    res.status(500).json({ error: "Falha ao resetar banco no Supabase", details: err.message });
  }
});

const reportsRoutes = require("./routes/reports.routes");

// Rotas Base
app.use("/api/auth", authRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/reports", reportsRoutes);

// Rotas Dinâmicas (seguem o toggle mestre em system_config.api_mode no Supabase)
app.use("/api/products", dynamicProducts);
app.use("/api/admin", dynamicAdmin);
app.use("/api/orders", dynamicOrders);

// Rotas Explícitas V1 (Vulneráveis didáticas)
app.use("/api/v1/products", productsV1Routes);
app.use("/api/v1/admin", adminV1Routes);
app.use("/api/v1/orders", ordersV1Routes);

// Rotas Explícitas V2 (Blindadas OWASP)
app.use("/api/v2/products", productsV2Routes);
app.use("/api/v2/admin", adminV2Routes);
app.use("/api/v2/orders", ordersV2Routes);

// Iniciar servidor escutando em todas as interfaces de rede (essencial para Docker e Render)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`======================================================`);
  console.log(`🚀 API Lab de Segurança iniciada na porta ${PORT}`);
  console.log(`💾 Banco de Dados: Supabase (PostgreSQL - estacio-presentation)`);
  console.log(`📊 Slides da Palestra: http://localhost:${PORT}/slides/presentation.html`);
  console.log(`🔗 Documentação da API: http://localhost:${PORT}/`);
  console.log(`======================================================`);
});

module.exports = app;
