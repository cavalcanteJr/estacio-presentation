import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pres = new pptxgen();

// Formato Widescreen 16:9
pres.layout = "LAYOUT_16x9";
pres.title = "Teste de Segurança em REST APIs";
pres.author = "Estácio Tech Talk";

// Paleta de cores Modern Dark Cyber
const C = {
  bg: "0B0F19",
  cardBg: "161E31",
  cardBorder: "2A364F",
  accent: "38BDF8",     // Azul ciano
  danger: "F43F5E",     // Vermelho/rosa alerta
  dangerBg: "2D1522",
  success: "10B981",    // Verde seguro
  successBg: "132C26",
  warning: "F59E0B",    // Âmbar
  text: "F8FAFC",
  textMuted: "94A3B8",
  codeBg: "06090E",
  jwtHeader: "F43F5E",
  jwtPayload: "EC4899",
  jwtSig: "38BDF8"
};

function addBaseSlide(title, subtitle, tag = "// OWASP API SECURITY") {
  const slide = pres.addSlide();
  slide.background = { color: C.bg };

  // Tag no topo
  slide.addText(tag, {
    x: 0.8,
    y: 0.5,
    w: 8.0,
    h: 0.3,
    fontSize: 11,
    color: C.accent,
    bold: true,
    fontFace: "Courier New"
  });

  // Título
  slide.addText(title, {
    x: 0.8,
    y: 0.8,
    w: 11.5,
    h: 0.8,
    fontSize: 26,
    color: C.text,
    bold: true,
    fontFace: "Arial"
  });

  // Subtítulo
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.5,
      w: 11.5,
      h: 0.5,
      fontSize: 13,
      color: C.textMuted,
      fontFace: "Arial"
    });
  }

  // Rodapé
  slide.addText("🛡️ Palestra de Segurança em TI | OWASP API Top 10", {
    x: 0.8,
    y: 7.0,
    w: 6.0,
    h: 0.3,
    fontSize: 9,
    color: C.textMuted
  });

  return slide;
}

// ==========================================
// SLIDE 1: Capa
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };

  slide.addText("// PALESTRA TÉCNICA (20 MINUTOS)", {
    x: 0.8,
    y: 1.2,
    w: 10.0,
    h: 0.4,
    fontSize: 13,
    color: C.accent,
    bold: true,
    fontFace: "Courier New"
  });

  slide.addText("Teste de Segurança\nem REST APIs", {
    x: 0.8,
    y: 1.7,
    w: 11.5,
    h: 1.8,
    fontSize: 38,
    color: C.text,
    bold: true,
    fontFace: "Arial"
  });

  slide.addText("Vulnerabilidades em JWT, Quebra de Permissões Multi-usuário (BOLA & BFLA) e Demonstração Prática ao Vivo em um E-commerce.", {
    x: 0.8,
    y: 3.6,
    w: 11.0,
    h: 0.8,
    fontSize: 15,
    color: C.textMuted,
    fontFace: "Arial"
  });

  const cards = [
    { title: "🔑 Autenticação", desc: "O que é e o que NÃO é um JWT? Mitos comuns do mercado sobre tokens." },
    { title: "🎯 BFLA", desc: "Broken Function Level Auth: Usuário comum agindo como Admin ou Vendedor." },
    { title: "💥 BOLA / IDOR", desc: "Broken Object Level Auth: Alterando preços e produtos de lojas concorrentes." }
  ];

  cards.forEach((c, i) => {
    const xPos = 0.8 + i * 3.9;
    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 4.8,
      w: 3.6,
      h: 1.8,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 }
    });
    slide.addText(c.title, {
      x: xPos + 0.2,
      y: 5.0,
      w: 3.2,
      h: 0.4,
      fontSize: 14,
      color: C.text,
      bold: true
    });
    slide.addText(c.desc, {
      x: xPos + 0.2,
      y: 5.5,
      w: 3.2,
      h: 0.9,
      fontSize: 11,
      color: C.textMuted
    });
  });
}

// ==========================================
// SLIDE 2: O Cenário Didático
// ==========================================
{
  const slide = addBaseSlide(
    "Marketplace Multi-vendedor",
    "Várias lojas e clientes operando na mesma API. O que pode dar errado?",
    "// O CENÁRIO REAL"
  );

  const personas = [
    { title: "👤 Alice (Cliente)", role: "ROLE: CUSTOMER", desc: "Deveria apenas navegar, adicionar ao carrinho e comprar produtos." },
    { title: "🏪 João & Maria (Lojas)", role: "ROLE: SELLER", desc: "Cada um possui seus próprios produtos. Não deveriam tocar no catálogo do concorrente." },
    { title: "👑 Carlos (Admin)", role: "ROLE: ADMIN", desc: "Acesso exclusivo a relatórios financeiros e governança da plataforma." }
  ];

  personas.forEach((p, i) => {
    const xPos = 0.8 + i * 3.9;
    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 2.2,
      w: 3.6,
      h: 2.2,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 }
    });
    slide.addText(p.title, {
      x: xPos + 0.2,
      y: 2.4,
      w: 3.2,
      h: 0.4,
      fontSize: 14,
      color: C.accent,
      bold: true
    });
    slide.addText(p.role, {
      x: xPos + 0.2,
      y: 2.8,
      w: 3.2,
      h: 0.3,
      fontSize: 10,
      color: C.textMuted,
      bold: true,
      fontFace: "Courier New"
    });
    slide.addText(p.desc, {
      x: xPos + 0.2,
      y: 3.2,
      w: 3.2,
      h: 1.0,
      fontSize: 11,
      color: C.text
    });
  });

  // Caixa de Alerta Inferior
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 4.8,
    w: 11.5,
    h: 1.8,
    fill: { color: C.dangerBg },
    line: { color: C.danger, width: 1.5 }
  });
  slide.addText("⚠️ A Grande Pergunta:", {
    x: 1.1,
    y: 5.0,
    w: 10.9,
    h: 0.4,
    fontSize: 15,
    color: C.danger,
    bold: true
  });
  slide.addText(
    "Se um usuário possui um token JWT válido, a API pode confiar que ele pode realizar qualquer ação?\n\nResposta curta: NUNCA! Autenticação (quem você é) ≠ Autorização (o que você pode fazer).",
    {
      x: 1.1,
      y: 5.4,
      w: 10.9,
      h: 1.0,
      fontSize: 13,
      color: C.text
    }
  );
}

// ==========================================
// SLIDE 3: Anatomia do JWT
// ==========================================
{
  const slide = addBaseSlide(
    "Anatomia do JWT (JSON Web Token)",
    "JWT NÃO É CRIPTOGRAFIA! É apenas Base64URL assinado.",
    "// DESMISTIFICANDO O TOKEN"
  );

  // JWT String Box
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 2.2,
    w: 11.5,
    h: 1.4,
    fill: { color: C.codeBg },
    line: { color: C.cardBorder, width: 1 }
  });

  slide.addText([
    { text: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", options: { color: C.jwtHeader, bold: true } },
    { text: ".", options: { color: C.textMuted } },
    { text: "eyJpZCI6MSwidXNlciI6ImFsaWNlIiwicm9sZSI6IkNVU1RPTUVSIn0", options: { color: C.jwtPayload, bold: true } },
    { text: ".", options: { color: C.textMuted } },
    { text: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", options: { color: C.jwtSig, bold: true } }
  ], {
    x: 1.1,
    y: 2.4,
    w: 10.9,
    h: 1.0,
    fontSize: 14,
    fontFace: "Courier New"
  });

  const jwtParts = [
    { title: "🔴 Header (Vermelho)", color: C.jwtHeader, desc: "Metadados: tipo do token e algoritmo de assinatura (ex: HS256, RS256)." },
    { title: "🟣 Payload (Rosa)", color: C.jwtPayload, desc: "Claims com dados do usuário (id, role, exp). Legível por qualquer interceptador no DevTools!" },
    { title: "🔵 Assinatura (Azul)", color: C.jwtSig, desc: "Garante integridade. Se a chave secreta for fraca ('secret123'), qualquer um forja privilégio de ADMIN!" }
  ];

  jwtParts.forEach((part, i) => {
    const xPos = 0.8 + i * 3.9;
    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 4.0,
      w: 3.6,
      h: 2.6,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 }
    });
    slide.addText(part.title, {
      x: xPos + 0.2,
      y: 4.2,
      w: 3.2,
      h: 0.4,
      fontSize: 13,
      color: part.color,
      bold: true
    });
    slide.addText(part.desc, {
      x: xPos + 0.2,
      y: 4.7,
      w: 3.2,
      h: 1.7,
      fontSize: 11,
      color: C.textMuted
    });
  });
}

// ==========================================
// SLIDE 4: BFLA
// ==========================================
{
  const slide = addBaseSlide(
    "BFLA: Broken Function Level Authorization",
    "A rota checa se o usuário está logado, mas esquece de checar seu papel de permissão (Role).",
    "// OWASP API5:2023"
  );

  // Coluna Vulnerável
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 2.2,
    w: 5.6,
    h: 4.4,
    fill: { color: C.dangerBg },
    line: { color: C.danger, width: 1.5 }
  });
  slide.addText("❌ Código Vulnerável (Cliente acessa Financeiro)", {
    x: 1.1,
    y: 2.4,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    color: C.danger,
    bold: true
  });
  const vulnCodeBFLA = `// Rota de métricas da empresa
app.get("/api/v1/admin/financials", 
  authenticate, // Só checou se tem token!
  (req, res) => {
    // QUALQUER usuário logado vê isso!
    res.json(db.getFinancialMetrics());
});`;
  slide.addText(vulnCodeBFLA, {
    x: 1.1,
    y: 2.9,
    w: 5.0,
    h: 3.4,
    fontSize: 10,
    color: C.text,
    fontFace: "Courier New"
  });

  // Coluna Segura
  slide.addShape(pres.ShapeType.rect, {
    x: 6.7,
    y: 2.2,
    w: 5.6,
    h: 4.4,
    fill: { color: C.successBg },
    line: { color: C.success, width: 1.5 }
  });
  slide.addText("✅ Código Corrigido (RBAC Estrito)", {
    x: 7.0,
    y: 2.4,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    color: C.success,
    bold: true
  });
  const safeCodeBFLA = `// Protegido por Role no middleware
app.get("/api/v2/admin/financials", 
  authenticate,
  requireRole("ADMIN"), // Bloqueia com 403!
  (req, res) => {
    res.json(db.getFinancialMetrics());
});`;
  slide.addText(safeCodeBFLA, {
    x: 7.0,
    y: 2.9,
    w: 5.0,
    h: 3.4,
    fontSize: 10,
    color: C.text,
    fontFace: "Courier New"
  });
}

// ==========================================
// SLIDE 5: BOLA / IDOR
// ==========================================
{
  const slide = addBaseSlide(
    "BOLA: Broken Object Level Authorization",
    "O #1 da OWASP API Top 10! A loja Maria altera o preço do produto do João para R$ 1,00.",
    "// OWASP API1:2023"
  );

  // Coluna Vulnerável
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 2.2,
    w: 5.6,
    h: 4.4,
    fill: { color: C.dangerBg },
    line: { color: C.danger, width: 1.5 }
  });
  slide.addText("❌ Código Vulnerável (Sem Validação de Dono)", {
    x: 1.1,
    y: 2.4,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    color: C.danger,
    bold: true
  });
  const vulnCodeBOLA = `app.put("/api/v1/products/:id/price", (req, res) => {
  // Confia cegamente no ID do parâmetro!
  Product.update(
    { price: req.body.newPrice }, 
    { where: { id: req.params.id } }
  );
  res.json({ success: true });
});`;
  slide.addText(vulnCodeBOLA, {
    x: 1.1,
    y: 2.9,
    w: 5.0,
    h: 3.4,
    fontSize: 10,
    color: C.text,
    fontFace: "Courier New"
  });

  // Coluna Segura
  slide.addShape(pres.ShapeType.rect, {
    x: 6.7,
    y: 2.2,
    w: 5.6,
    h: 4.4,
    fill: { color: C.successBg },
    line: { color: C.success, width: 1.5 }
  });
  slide.addText("✅ Código Corrigido (Ownership Check)", {
    x: 7.0,
    y: 2.4,
    w: 5.0,
    h: 0.4,
    fontSize: 13,
    color: C.success,
    bold: true
  });
  const safeCodeBOLA = `app.put("/api/v2/products/:id/price", (req, res) => {
  const product = Product.findById(req.params.id);
  // Valida explicitamente o dono do objeto:
  if (product.sellerId !== req.user.id) {
    return res.status(403).json({ error: "Negado" });
  }
  product.updatePrice(req.body.newPrice);
});`;
  slide.addText(safeCodeBOLA, {
    x: 7.0,
    y: 2.9,
    w: 5.0,
    h: 3.4,
    fontSize: 10,
    color: C.text,
    fontFace: "Courier New"
  });
}

// ==========================================
// SLIDE 6: Live Hacking Demo
// ==========================================
{
  const slide = addBaseSlide(
    "Demonstração Prática (Live Hacking)",
    "Executando as requisições na nossa API em Node.js com Express e Supabase.",
    "// HORA DO SHOW (AO VIVO)"
  );

  const attacks = [
    { title: "1. Ataque BFLA", type: "danger", desc: "Alice (CUSTOMER) acessa /api/v1/admin/financials e extrai todo o faturamento da empresa sem permissão." },
    { title: "2. Ataque BOLA", type: "danger", desc: "Maria (SELLER #2) altera o preço do notebook de João (SELLER #1) via PUT /api/v1/products/1/price para R$ 1,00." },
    { title: "3. Defesa na V2", type: "success", desc: "Repetimos os ataques na rota /api/v2 e o backend rejeita com HTTP 403 Forbidden com RBAC e Ownership Check." }
  ];

  attacks.forEach((a, i) => {
    const xPos = 0.8 + i * 3.9;
    const isDanger = a.type === "danger";
    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 2.2,
      w: 3.6,
      h: 2.5,
      fill: { color: isDanger ? C.dangerBg : C.successBg },
      line: { color: isDanger ? C.danger : C.success, width: 1.2 }
    });
    slide.addText(a.title, {
      x: xPos + 0.2,
      y: 2.4,
      w: 3.2,
      h: 0.4,
      fontSize: 14,
      color: isDanger ? C.danger : C.success,
      bold: true
    });
    slide.addText(a.desc, {
      x: xPos + 0.2,
      y: 2.9,
      w: 3.2,
      h: 1.6,
      fontSize: 11,
      color: C.text
    });
  });

  // Caixa de instrução
  slide.addShape(pres.ShapeType.rect, {
    x: 0.8,
    y: 5.1,
    w: 11.5,
    h: 1.4,
    fill: { color: C.cardBg },
    line: { color: C.accent, width: 1.5 }
  });
  slide.addText("💻 Arquivo de Testes Pronto:", {
    x: 1.1,
    y: 5.3,
    w: 10.9,
    h: 0.3,
    fontSize: 12,
    color: C.accent,
    bold: true
  });
  slide.addText("Abra o arquivo test-requests/requests.http (REST Client) ou importe no Postman para executar em tempo real com a plateia!", {
    x: 1.1,
    y: 5.65,
    w: 10.9,
    h: 0.6,
    fontSize: 12,
    color: C.text
  });
}

// ==========================================
// SLIDE 7: Conclusão
// ==========================================
{
  const slide = addBaseSlide(
    "3 Mandamentos da Segurança em APIs",
    "O que todo desenvolvedor e arquiteto de software deve levar para a carreira:",
    "// LIÇÕES PARA A CARREIRA"
  );

  const lessons = [
    { title: "1. Token ≠ Permissão", desc: "Saber quem é o usuário (Autenticação) é só a metade do caminho. Saber o que ele pode acessar (Autorização) é o que impede invasões." },
    { title: "2. Valide o Dono Sempre", desc: "Nunca faça UPDATE ou DELETE baseado unicamente no ID da URL. Sempre adicione a cláusula restritiva: WHERE id = ? AND owner_id = ?." },
    { title: "3. Segredo JWT Forte", desc: "Nunca use senhas fracas no segredo de assinatura do JWT. Utilize chaves aleatórias de 256 bits geradas de forma criptográfica." }
  ];

  lessons.forEach((l, i) => {
    const xPos = 0.8 + i * 3.9;
    slide.addShape(pres.ShapeType.rect, {
      x: xPos,
      y: 2.2,
      w: 3.6,
      h: 2.8,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 }
    });
    slide.addText(l.title, {
      x: xPos + 0.2,
      y: 2.4,
      w: 3.2,
      h: 0.4,
      fontSize: 14,
      color: C.accent,
      bold: true
    });
    slide.addText(l.desc, {
      x: xPos + 0.2,
      y: 3.0,
      w: 3.2,
      h: 1.8,
      fontSize: 11,
      color: C.textMuted
    });
  });

  slide.addText("🚀 Obrigado! Perguntas & Respostas", {
    x: 0.8,
    y: 5.5,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    color: C.accent,
    bold: true,
    align: "center"
  });
}

const outputPath = path.resolve(__dirname, "../presentation/seguranca-rest-apis.pptx");
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Sucesso: Apresentação gerada em ${outputPath}`);
}).catch(err => {
  console.error("Erro ao gerar apresentação:", err);
  process.exit(1);
});
