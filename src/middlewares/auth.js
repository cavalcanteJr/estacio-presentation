const jwt = require("jsonwebtoken");
const db = require("../db");

const WEAK_SECRET = process.env.JWT_WEAK_SECRET || "secret123";
const STRONG_SECRET = process.env.JWT_STRONG_SECRET || "c9b3a7f802d5e1823901bca93710d9e4823abf104928eab7183021948ba12034";

/**
 * Middleware V1 (Vulnerável)
 */
function authenticateV1(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token não fornecido",
      hint: "Envie o token no header: Authorization: Bearer <seu-jwt>"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    let payload;
    try {
      payload = jwt.verify(token, WEAK_SECRET);
    } catch {
      payload = jwt.verify(token, STRONG_SECRET);
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido ou expirado",
      details: err.message
    });
  }
}

/**
 * Middleware V2 (Seguro)
 */
async function authenticateV2(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Não autorizado: Token ausente",
      message: "Formato esperado: Authorization: Bearer <token>"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    let payload;
    try {
      payload = jwt.verify(token, STRONG_SECRET, { algorithms: ["HS256"] });
    } catch {
      payload = jwt.verify(token, WEAK_SECRET, { algorithms: ["HS256"] });
    }

    const userFromDb = await db.findUserById(payload.id);
    if (!userFromDb) {
      return res.status(401).json({ error: "Usuário do token não encontrado no sistema" });
    }

    req.user = {
      id: userFromDb.id,
      username: userFromDb.username,
      name: userFromDb.name,
      role: userFromDb.role
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido, corrompido ou expirado",
      message: err.message
    });
  }
}

module.exports = {
  authenticateV1,
  authenticateV2,
  WEAK_SECRET,
  STRONG_SECRET
};
