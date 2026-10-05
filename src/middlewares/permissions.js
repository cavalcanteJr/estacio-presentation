/**
 * Middleware de Autorização Baseada em Papéis (RBAC - Role-Based Access Control).
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Faça login para acessar este recurso."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Acesso negado",
        message: `Seu perfil de usuário não tem permissão para acessar esta funcionalidade.`
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
