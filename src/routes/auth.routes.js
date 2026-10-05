const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { WEAK_SECRET, STRONG_SECRET, authenticateV1, authenticateV2 } = require("../middlewares/auth");

const router = express.Router();

/**
 * POST /api/auth/register
 * Cadastro real de novos usuários.
 * Se role = 'SELLER', a conta nasce PENDING aguardando aprovação do admin.
 */
router.post("/register", async (req, res) => {
  const { username, password, name, role = "CUSTOMER" } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: "Informe nome, username e senha." });
  }

  const existing = await db.findUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: "Este nome de usuário já está em uso." });
  }

  const validRole = role === "SELLER" ? "SELLER" : "CUSTOMER";
  const newUser = await db.createUser({
    username: username.toLowerCase().trim(),
    password,
    name,
    role: validRole
  });

  return res.status(201).json({
    message: validRole === "SELLER"
      ? "Cadastro de vendedor realizado com sucesso! Aguarde a aprovação do administrador para acessar o sistema."
      : "Cadastro realizado com sucesso! Você já pode entrar.",
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status
    }
  });
});

/**
 * POST /api/auth/login
 * Login real de usuários com validação de status de aprovação.
 */
router.post("/login", async (req, res) => {
  const { username, password, version } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Informe username e password" });
  }

  const user = await db.findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenciais inválidas. Verifique usuário e senha." });
  }

  // REGRA DE NEGÓCIO: Vendedores precisam ser aprovados pelo Admin
  if (user.role === "SELLER" && user.status === "PENDING") {
    return res.status(403).json({
      error: "Conta de vendedor pendente de aprovação.",
      status: "PENDING",
      message: "Seu cadastro de vendedor está em análise e precisa ser aprovado pelo Administrador da plataforma antes de você poder entrar."
    });
  }

  if (user.role === "SELLER" && user.status === "REJECTED") {
    return res.status(403).json({
      error: "Cadastro rejeitado.",
      status: "REJECTED",
      message: "Seu cadastro de vendedor foi recusado pelo administrador."
    });
  }

  const activeMode = version || (await db.getSystemMode());
  const secret = activeMode === "v2" ? STRONG_SECRET : WEAK_SECRET;

  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    status: user.status
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: "24h",
    algorithm: "HS256"
  });

  return res.json({
    message: "Login realizado com sucesso!",
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      status: user.status
    },
    token
  });
});

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado atual
 */
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.decode(token);
    if (!payload || !payload.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const user = await db.findUserById(payload.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      status: user.status
    });
  } catch (e) {
    return res.status(401).json({ error: "Falha ao decodificar token" });
  }
});

module.exports = router;
