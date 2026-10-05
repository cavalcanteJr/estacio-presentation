const express = require("express");
const db = require("../../db");
const { authenticateV2 } = require("../../middlewares/auth");

const router = express.Router();

// Tabela oficial de cupons válidos no servidor
const VALID_COUPONS = {
  TECH10: { code: "TECH10", discountPercent: 10, maxDiscount: 2000 },
  PRIMEIRACOMPRA: { code: "PRIMEIRACOMPRA", discountPercent: 10, maxDiscount: 2000 }
};

/**
 * =============================================================================
 * API V2 - PEDIDOS (BLINDADA / OWASP API Security: Business Logic & Integrity)
 * =============================================================================
 * Proteções implementadas:
 * 1. Zero Trust no Cliente: Preços, fretes e descontos são auditados no servidor.
 * 2. Prevenção de Price Tampering: Cruzamento com preço cadastrado no Supabase.
 * 3. Prevenção de Coupon/Discount Tampering: Descontos só existem com cupons auditados.
 * 4. Validação Numérica Estrita: Quantidades obrigatoriamente inteiras >= 1.
 * 5. Rejeição com 400 detalhado alertando tentativa de adulteração de integridade.
 */
router.post("/", authenticateV2, async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingCost,
      discount,
      couponCode,
      totalAmount,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      paymentDetails
    } = req.body;

    // 1. Validação básica da lista de itens
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Requisição Inválida",
        message: "O pedido deve conter pelo menos um item válido."
      });
    }

    let serverSubtotal = 0;
    const verifiedItems = [];

    // 2. Auditoria item a item contra a base oficial do Supabase
    for (const item of items) {
      const productId = item.productId || item.id;
      if (!productId) {
        return res.status(400).json({
          error: "Item Inválido",
          message: "Todo item deve conter o identificador 'productId'."
        });
      }

      // Validação estrita de quantidade (evita quantidades fracionárias ou negativas)
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          error: "Tentativa de Fraude / Quantidade Inválida",
          message: `A quantidade para o produto #${productId} deve ser um número inteiro maior ou igual a 1. Valor recebido: ${item.quantity}`,
          vulnerability: "Business Logic Flaw - Negative / Fractional Quantities"
        });
      }

      // Busca produto oficial no PostgreSQL (Supabase)
      const realProduct = await db.findProductById(productId);
      if (!realProduct) {
        return res.status(404).json({
          error: "Produto Não Encontrado",
          message: `O produto #${productId} não existe no catálogo oficial do marketplace.`
        });
      }

      const serverPrice = Number(realProduct.price);

      // Checagem de Adulteração de Preço (Price Tampering)
      if (item.price !== undefined && item.price !== null) {
        const clientPrice = Number(item.price);
        if (isNaN(clientPrice) || Math.abs(clientPrice - serverPrice) > 0.01) {
          return res.status(400).json({
            error: "Tentativa de Fraude Detectada: Adulteração de Preço (Price Tampering)",
            message: `O preço enviado para "${realProduct.name}" (R$ ${Number(clientPrice || 0).toFixed(2)}) diverge do valor oficial no banco de dados (R$ ${serverPrice.toFixed(2)}).`,
            productId: realProduct.id,
            productName: realProduct.name,
            expectedPrice: serverPrice,
            submittedPrice: clientPrice,
            vulnerability: "OWASP API Security - Price Tampering / Broken Business Logic",
            protection: "Modo V2 Ativo: Preços e totais validados estritamente pelo banco de dados no servidor."
          });
        }
      }

      serverSubtotal += serverPrice * quantity;

      verifiedItems.push({
        productId: realProduct.id,
        name: realProduct.name,
        price: serverPrice,
        quantity,
        sellerId: realProduct.sellerId,
        sellerName: realProduct.sellerName,
        imageUrl: realProduct.imageUrl
      });
    }

    // 3. Auditoria e Validação de Cupom / Desconto
    let serverDiscount = 0;
    const cleanCoupon = (couponCode || "").toString().trim().toUpperCase();

    if (cleanCoupon) {
      const couponRule = VALID_COUPONS[cleanCoupon];
      if (!couponRule) {
        return res.status(400).json({
          error: "Cupom Inválido",
          message: `O cupom "${cleanCoupon}" não existe ou expirou.`
        });
      }
      serverDiscount = (serverSubtotal * couponRule.discountPercent) / 100;
      if (couponRule.maxDiscount && serverDiscount > couponRule.maxDiscount) {
        serverDiscount = couponRule.maxDiscount;
      }
    }

    // Se o cliente enviou campo discount arbitrário sem cupom ou com valor divergente
    if (discount !== undefined && discount !== null && Number(discount) > 0) {
      const clientDiscount = Number(discount);
      if (Math.abs(clientDiscount - serverDiscount) > 0.01) {
        return res.status(400).json({
          error: "Tentativa de Fraude Detectada: Adulteração de Desconto (Discount Tampering)",
          message: `O desconto solicitado (R$ ${clientDiscount.toFixed(2)}) não confere com nenhum cupom válido auditado pelo servidor (desconto real autorizado: R$ ${serverDiscount.toFixed(2)}).`,
          vulnerability: "OWASP API Security - Discount/Coupon Tampering",
          protection: "Modo V2 Ativo: Descontos só são concedidos mediante validação de regras de cupons no servidor."
        });
      }
    }

    // 4. Auditoria e Cálculo de Frete Oficial
    // Regra do marketplace: compras acima de R$ 300 têm frete grátis, caso contrário R$ 25
    const officialShipping = serverSubtotal >= 300 ? 0 : 25;

    if (shippingCost !== undefined && shippingCost !== null) {
      const clientShipping = Number(shippingCost);
      if (clientShipping < 0 || Math.abs(clientShipping - officialShipping) > 0.01) {
        return res.status(400).json({
          error: "Tentativa de Fraude / Frete Inválido",
          message: `O valor do frete enviado (R$ ${clientShipping.toFixed(2)}) é incompatível com a política de frete oficial (R$ ${officialShipping.toFixed(2)}).`,
          protection: "Modo V2 Ativo: Frete recalculado no servidor com base nas regras de negócio."
        });
      }
    }

    // 5. Cálculo do Total Oficial Auditado
    const serverTotal = Math.max(0, serverSubtotal - serverDiscount + officialShipping);

    // Validação estrita se o cliente enviou subtotal ou totalAmount
    if (subtotal !== undefined && Math.abs(Number(subtotal) - serverSubtotal) > 0.01) {
      return res.status(400).json({
        error: "Tentativa de Fraude: Subtotal Adulterado",
        message: `O subtotal enviado (R$ ${Number(subtotal).toFixed(2)}) diverge da soma real dos produtos no catálogo (R$ ${serverSubtotal.toFixed(2)}).`,
        expectedSubtotal: serverSubtotal,
        submittedSubtotal: Number(subtotal)
      });
    }

    if (totalAmount !== undefined && Math.abs(Number(totalAmount) - serverTotal) > 0.01) {
      return res.status(400).json({
        error: "Tentativa de Fraude: Total Adulterado (Price Tampering)",
        message: `O valor total enviado (R$ ${Number(totalAmount).toFixed(2)}) diverge do total auditado pelo servidor (R$ ${serverTotal.toFixed(2)}).`,
        expectedTotal: serverTotal,
        submittedTotal: Number(totalAmount),
        vulnerability: "OWASP API Security - Price / Total Tampering",
        protection: "Modo V2 Ativo: Nenhum pedido é aceito com valores adulterados pelo cliente."
      });
    }

    // 6. Gravação definitiva no Supabase com os dados 100% blindados e auditados
    const newOrder = await db.createOrder({
      userId: req.user.id,
      customerName: req.user.name || "Cliente",
      items: verifiedItems,
      subtotal: serverSubtotal,
      shippingCost: officialShipping,
      discount: serverDiscount,
      totalAmount: serverTotal,
      shippingAddress: shippingAddress || { street: "Endereço Padrão", city: "São Paulo", state: "SP" },
      shippingMethod: shippingMethod || (officialShipping === 0 ? "SEDEX Expresso Tech (Frete Grátis)" : "SEDEX Padrão"),
      paymentMethod: paymentMethod || "CREDIT_CARD",
      paymentDetails: paymentDetails || {}
    });

    return res.status(201).json({
      message: "Pedido validado e realizado com sucesso com proteção V2!",
      mode: "v2",
      order: newOrder
    });
  } catch (err) {
    return res.status(500).json({
      error: "Falha ao processar pedido em V2",
      details: err.message
    });
  }
});

router.get("/my-orders", authenticateV2, async (req, res) => {
  try {
    const orders = await db.getUserOrders(req.user.id);
    return res.json({ total: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar histórico de pedidos", details: err.message });
  }
});

router.get("/seller", authenticateV2, async (req, res) => {
  try {
    const orders = await db.getSellerOrders(req.user.id);
    return res.json({ total: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar pedidos da loja", details: err.message });
  }
});

router.get("/:id", authenticateV2, async (req, res) => {
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
