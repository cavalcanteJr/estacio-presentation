const express = require("express");
const db = require("../../db");
const { authenticateV1 } = require("../../middlewares/auth");

const router = express.Router();

/**
 * =============================================================================
 * API V1 - PEDIDOS (VULNERÁVEL: Price Tampering / Broken Business Logic)
 * =============================================================================
 * Falhas demonstradas:
 * 1. Price Tampering: Aceita cegamente os preços de produtos enviados pelo cliente.
 * 2. Coupon/Discount Tampering: Aceita qualquer valor de desconto forjado no body.
 * 3. Quantidade Negativa/Fracionária: Não valida quantidades inteiras e positivas.
 * 4. Total Manipulation: O cliente dita o totalAmount que deseja pagar.
 */
router.post("/", authenticateV1, async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingCost,
      discount,
      totalAmount,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "O pedido deve conter pelo menos um item." });
    }

    // VULNERABILIDADE V1: Confia no totalAmount e preços enviados pelo atacante
    const trustedItems = items.map((item) => ({
      productId: item.productId || item.id,
      name: item.name || "Produto",
      price: Number(item.price !== undefined ? item.price : 1.00),
      quantity: Number(item.quantity || 1),
      sellerId: item.sellerId || 2,
      sellerName: item.sellerName || "Loja Parceira",
      imageUrl: item.imageUrl || ""
    }));

    const finalSubtotal = Number(subtotal !== undefined ? subtotal : totalAmount);
    const finalTotal = Number(totalAmount !== undefined ? totalAmount : finalSubtotal);

    const newOrder = await db.createOrder({
      userId: req.user.id,
      customerName: req.user.name || "Cliente",
      items: trustedItems,
      subtotal: finalSubtotal,
      shippingCost: Number(shippingCost || 0),
      discount: Number(discount || 0),
      totalAmount: finalTotal,
      shippingAddress: shippingAddress || { street: "Não informado" },
      shippingMethod: shippingMethod || "SEDEX",
      paymentMethod: paymentMethod || "PIX",
      paymentDetails: paymentDetails || {}
    });

    return res.status(201).json({
      message: "Pedido realizado com sucesso (Modo V1 Vulnerável: preços confiados cegamente ao cliente)!",
      mode: "v1",
      order: newOrder
    });
  } catch (err) {
    return res.status(500).json({
      error: "Falha ao processar pedido em V1",
      details: err.message
    });
  }
});

router.get("/my-orders", authenticateV1, async (req, res) => {
  try {
    const orders = await db.getUserOrders(req.user.id);
    return res.json({ total: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar histórico de pedidos", details: err.message });
  }
});

router.get("/seller", authenticateV1, async (req, res) => {
  try {
    const orders = await db.getSellerOrders(req.user.id);
    return res.json({ total: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar pedidos da loja", details: err.message });
  }
});

router.get("/:id", authenticateV1, async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar pedido", details: err.message });
  }
});

module.exports = router;
