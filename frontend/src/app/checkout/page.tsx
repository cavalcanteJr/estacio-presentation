"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { API_BASE, apiFetch } from "@/config/api";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Truck,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Bug
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart, totalItems } = useCart();

  // Endereço
  const [recipient, setRecipient] = useState("");
  const [zipCode, setZipCode] = useState("01311-200");
  const [street, setStreet] = useState("Av. Paulista, 1500");
  const [neighborhood, setNeighborhood] = useState("Bela Vista");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");

  // Envio
  const [shippingMethod, setShippingMethod] = useState("SEDEX Expresso Tech (2 dias úteis)");

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "PIX" | "BOLETO">("CREDIT_CARD");

  // Cartão
  const [cardNumber, setCardNumber] = useState("4532 8492 1092 8492");
  const [cardHolder, setCardHolder] = useState("ALICE COMPRADORA");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [installments, setInstallments] = useState(1);

  // Simulação de Teste de QA: Adulteração de Preço (Price Tampering)
  const [tamperPrice, setTamperPrice] = useState(false);
  const [customTamperedPrice, setCustomTamperedPrice] = useState("1.00");

  const [submitting, setSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    } else if (user) {
      setRecipient(user.name);
      setCardHolder(user.name.toUpperCase());
    }
  }, [user, authLoading]);

  const shippingCost = 0; // Promoção Frete Grátis
  const finalTotal = tamperPrice ? parseFloat(customTamperedPrice) || 1.00 : subtotal + shippingCost;

  const fillQATestData = () => {
    setRecipient(user?.name || "Alice Compradora");
    setZipCode("01311-200");
    setStreet("Av. Paulista, 1500, Bloco B - Apto 82");
    setNeighborhood("Bela Vista");
    setCity("São Paulo");
    setState("SP");
    setCardNumber("5412 7512 3412 8841");
    setCardHolder((user?.name || "ALICE COMPRADORA").toUpperCase());
    setCardExpiry("11/29");
    setCardCvv("741");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);

    if (items.length === 0) {
      setErrorDetails({
        error: "Carrinho Vazio",
        message: "O carrinho está vazio. Adicione produtos antes de prosseguir."
      });
      return;
    }

    try {
      setSubmitting(true);

      // Se o QA ativou a simulação de adulteração, envia o preço adulterado no payload
      const payloadItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: tamperPrice ? parseFloat(customTamperedPrice) || 1.00 : item.product.price,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        imageUrl: item.product.imageUrl
      }));

      const payload = {
        items: payloadItems,
        subtotal: tamperPrice ? parseFloat(customTamperedPrice) || 1.00 : subtotal,
        shippingCost,
        discount: 0,
        totalAmount: finalTotal,
        shippingAddress: {
          recipient,
          zipCode,
          street,
          neighborhood,
          city,
          state
        },
        shippingMethod,
        paymentMethod,
        paymentDetails:
          paymentMethod === "CREDIT_CARD"
            ? {
                brand: "Mastercard",
                last4: cardNumber.replace(/\s/g, "").slice(-4) || "8841",
                installments
              }
            : paymentMethod === "PIX"
            ? {
                status: "PAGO",
                pixKey: "pix@techmarket.com.br"
              }
            : {
                status: "AGUARDANDO_PAGAMENTO",
                barcode: "34191.79001 01043.510047 91020.150008 5 94120000050000"
              }
      };

      const res = await apiFetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status === 201 && data.order) {
        clearCart();
        router.push(`/checkout/success?orderId=${data.order.id}`);
      } else {
        setErrorDetails(data);
      }
    } catch (err: any) {
      setErrorDetails({
        error: "Erro de Conexão",
        message: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-xs">Preparando ambiente de checkout seguro...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Carrinho Vazio</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Adicione itens ao carrinho antes de acessar a finalização de compra.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
        >
          Voltar à Loja
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner de Segurança e Dados QA */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>CHECKOUT CRIPTOGRAFADO DE ALTA SEGURANÇA</span>
          </div>
          <h1 className="text-2xl font-black text-white">Finalização de Pedido</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprador logado: <strong className="text-slate-200">{user?.name}</strong> (@{user?.username})
          </p>
        </div>

        <button
          type="button"
          onClick={fillQATestData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preencher Dados de Teste QA</span>
        </button>
      </div>

      {/* Caixa de Ferramentas de QA: Simulação de Adulteração de Preço */}
      <div className={`p-5 rounded-3xl border transition-all ${
        tamperPrice
          ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
          : "bg-slate-900/60 border-slate-800 text-slate-400"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              tamperPrice ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-500"
            }`}>
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Laboratório de QA: Teste de Integridade de Preço (Price Tampering)</span>
                {tamperPrice && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-slate-950 font-black uppercase">
                    Ataque Ativo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simula um usuário alterando o preço do produto no frontend/inspecionar elemento antes de enviar para a API.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
            <input
              type="checkbox"
              checked={tamperPrice}
              onChange={(e) => setTamperPrice(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-950"
            />
            <span className="text-xs font-semibold text-slate-300">
              {tamperPrice ? "Desativar Adulteração" : "Simular Adulteração de Preço"}
            </span>
          </label>
        </div>

        {tamperPrice && (
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Preço Adulterado para a API:</span>
              <div className="flex items-center gap-1 bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-1 font-mono text-amber-300">
                <span>R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={customTamperedPrice}
                  onChange={(e) => setCustomTamperedPrice(e.target.value)}
                  className="w-20 bg-transparent text-white font-bold outline-none"
                />
              </div>
            </div>
            <div className="text-[11px] text-amber-300/80">
              💡 <strong>Comportamento esperado:</strong> No modo <strong>V1</strong> a API aceita a compra por R$ {customTamperedPrice}. No modo <strong>V2</strong> a API bloqueia com erro 400!
            </div>
          </div>
        )}
      </div>

      {/* Alerta de Erro de Segurança / Resposta da API */}
      {errorDetails && (
        <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs space-y-2 animate-shake">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorDetails.error || "Erro no Pedido"}</span>
          </div>

          <p className="leading-relaxed text-slate-200">
            {errorDetails.message}
          </p>

          {errorDetails.vulnerability && (
            <div className="pt-2 border-t border-rose-500/20 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block font-semibold">Vulnerabilidade Testada:</span>
                <span className="text-amber-300 font-mono">{errorDetails.vulnerability}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Mecanismo de Defesa:</span>
                <span className="text-emerald-400">{errorDetails.protection}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Principal dos Formulários */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Etapa 1: Endereço de Entrega */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/30">
                1
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Endereço de Entrega</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Destinatário Completo:</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Nome de quem vai receber"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CEP:</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="00000-000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Endereço e Número:</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua, Avenida, Número, Bloco/Apto"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bairro:</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cidade:</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado (UF):</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="SP"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white uppercase font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Etapa 2: Forma de Envio */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/30">
                2
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Modalidade de Envio</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setShippingMethod("SEDEX Expresso Tech (2 dias úteis)")}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  shippingMethod.includes("SEDEX")
                    ? "bg-sky-500/10 border-sky-500/60 text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="font-bold">SEDEX Expresso Tech</div>
                  <div className="text-[11px] text-slate-400">Previsão: 2 dias úteis</div>
                </div>
                <span className="text-emerald-400 font-black font-mono">GRÁTIS</span>
              </label>

              <label
                onClick={() => setShippingMethod("PAC Convencional (5 dias úteis)")}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  shippingMethod.includes("PAC")
                    ? "bg-sky-500/10 border-sky-500/60 text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="font-bold">PAC Convencional</div>
                  <div className="text-[11px] text-slate-400">Previsão: 5 dias úteis</div>
                </div>
                <span className="text-emerald-400 font-black font-mono">GRÁTIS</span>
              </label>
            </div>
          </div>

          {/* Etapa 3: Forma de Pagamento */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/30">
                3
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span>Forma de Pagamento</span>
              </h2>
            </div>

            {/* Abas de Pagamento */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "CREDIT_CARD"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "PIX"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("BOLETO")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "BOLETO"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Boleto</span>
              </button>
            </div>

            {/* Conteúdo de Pagamento: Cartão */}
            {paymentMethod === "CREDIT_CARD" && (
              <div className="space-y-4 pt-2">
                {/* Cartão Visual Fictício */}
                <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-sky-950 border border-sky-500/30 p-5 text-white shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-sky-400">TECHCARD</span>
                    <span className="text-xs font-mono font-bold text-slate-400">MASTERCARD</span>
                  </div>
                  <div className="font-mono text-base tracking-widest text-slate-200">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Titular</span>
                      <span className="font-bold text-slate-300 truncate max-w-[170px] block">
                        {cardHolder || "NOME DO CLIENTE"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Validade</span>
                      <span className="font-bold text-slate-300">{cardExpiry || "MM/AA"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Número do Cartão:</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">CVV:</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">Nome Impresso no Cartão:</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="NOME COMO NO CARTAO"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white uppercase focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Validade:</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-300 font-semibold mb-1">Opção de Parcelamento:</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}x de{" "}
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            finalTotal / n
                          )}{" "}
                          sem juros
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo de Pagamento: PIX */}
            {paymentMethod === "PIX" && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Pagamento Instantâneo via PIX</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Após confirmar o pedido, o QR Code e o código Pix Copia e Cola serão gerados. A confirmação é imediata e o pedido segue direto para separação.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aprovação em segundos</span>
                </div>
              </div>
            )}

            {/* Conteúdo de Pagamento: Boleto */}
            {paymentMethod === "BOLETO" && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Boleto Bancário</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  O boleto terá vencimento em até 3 dias úteis. Pode ser pago em qualquer banco ou aplicativo bancário.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Resumo Lateral e Botão Final */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white pb-4 border-b border-slate-800">
            Resumo da Compra ({totalItems} itens)
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between text-xs gap-3">
                <div className="truncate flex-1">
                  <span className="font-semibold text-white truncate block">{product.name}</span>
                  <span className="text-[11px] text-slate-400">
                    Qtd: {quantity} &bull; {product.sellerName}
                  </span>
                </div>
                <span className="font-mono text-emerald-400 font-bold shrink-0">
                  {tamperPrice ? (
                    <span className="text-amber-400 font-black">
                      R$ {parseFloat(customTamperedPrice).toFixed(2)}
                    </span>
                  ) : (
                    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      product.price * quantity
                    )
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Subtotal</span>
              <span className={`font-mono ${tamperPrice ? "text-amber-400 font-bold" : "text-slate-200"}`}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                  tamperPrice ? parseFloat(customTamperedPrice) || 1.00 : subtotal
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Frete</span>
              <span className="text-emerald-400 font-bold">Grátis</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-white block">Total a Pagar</span>
                <span className="text-[10px] text-slate-400">
                  {paymentMethod === "CREDIT_CARD" ? `Em ${installments}x sem juros` : "À vista"}
                </span>
              </div>
              <span className={`text-2xl font-black font-mono ${tamperPrice ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(finalTotal)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50 text-white ${
              tamperPrice
                ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
            }`}
          >
            {submitting ? (
              <span>Processando Pedido...</span>
            ) : (
              <>
                <span>{tamperPrice ? "Disparar Compra com Preço Adulterado" : "Confirmar e Finalizar Pedido"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Transação autorizada com criptografia SSL</span>
          </div>
        </div>
      </form>
    </main>
  );
}
