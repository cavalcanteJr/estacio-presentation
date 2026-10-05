# 🛍️ TechMarket | E-commerce Multi-vendedor & Lab de Segurança

Aplicação web completa e autêntica de marketplace comercial desenvolvida em **Next.js (App Router)** com **Tailwind CSS**, **Node.js (Express)** e **Supabase (PostgreSQL)**.

Criada especialmente para demonstração técnica e prática de segurança em REST APIs (vulnerabilidades em JWT, permissões multiusuário, BOLA/IDOR e BFLA).

---

## 🚀 Como Iniciar a Aplicação

Abra dois terminais na raiz do projeto:

```bash
# Terminal 1: Iniciar o Backend Express (Porta 3000)
npm run backend

# Terminal 2: Iniciar o Frontend Next.js (Porta 3001)
npm run frontend
```

Ou execute ambos em paralelo com um único comando:
```bash
npm run dev
```

---

## 🖥️ Telas e Fluxos do Sistema

| Tela | Rota | Descrição |
| :--- | :--- | :--- |
| **🛍️ Vitrine de Produtos** | [http://localhost:3001](http://localhost:3001) | Catálogo comercial com fotos reais, filtros de categoria, busca e parcelamento. |
| **🔍 Detalhe do Produto** | [http://localhost:3001/products/1](http://localhost:3001/products/1) | Página individual do item com especificações, cálculo de frete por CEP e botões de compra. |
| **🛒 Carrinho de Compras** | [http://localhost:3001/cart](http://localhost:3001/cart) | Carrinho completo com ajuste de quantidades, cupom promocional (`TECH10`) e drawer lateral. |
| **💳 Checkout Criptografado** | [http://localhost:3001/checkout](http://localhost:3001/checkout) | Finalização de compra com endereço, modalidades de frete, cartão de crédito, PIX e boleto. |
| **📦 Meus Pedidos (Cliente)** | [http://localhost:3001/orders](http://localhost:3001/orders) | Histórico de compras da cliente (Alice), timeline de entrega e código de rastreamento. |
| **🏪 Seller Center (Lojista)** | [http://localhost:3001/dashboard](http://localhost:3001/dashboard) | Painel do lojista (João/Maria) com métricas de faturamento, pedidos recebidos e gestão de catálogo. |
| **✏️ Edição de Preço (Alvo BOLA)** | [http://localhost:3001/dashboard/products/:id/edit](http://localhost:3001/dashboard/products/1/edit) | Tela de edição de preço onde o teste de BOLA ocorre de forma realista ao alternar o ID na URL. |
| **👑 Gestão de Lojistas (Admin)** | [http://localhost:3001/admin](http://localhost:3001/admin) | Tabela do Administrador para homologação e aprovação de vendedores e métricas da plataforma. |
| **🔒 Rota Oculta (Backstage)** | [http://localhost:3001/backstage](http://localhost:3001/backstage) | **Painel do Palestrante:** Contém o Toggle Mestre V1 / V2 salvo no backend/Supabase e tabela de aprovação rápida. |
| **📊 Slides da Palestra** | [http://localhost:3000/slides/presentation.html](http://localhost:3000/slides/presentation.html) | Apresentação com cronômetro de 20 minutos e navegação por teclado (`←`, `→`, `Espaço`). |


---

## 👥 Contas Pré-cadastradas para a Demonstração

| Usuário | Senha | Tipo | Status | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `alice` | `123` | `CUSTOMER` | `APPROVED` | Compradora comum (perfil para testar tentativa de virar vendedor/admin) |
| `joao` | `123` | `SELLER` | `APPROVED` | Lojista parceiro (Dono do Produto #1: MacBook Pro R$ 14.999) |
| `maria` | `123` | `SELLER` | `APPROVED` | Lojista parceira concorrente (Dona do Smartphone #2) |
| `admin` | `admin123` | `ADMIN` | `APPROVED` | Administrador geral da plataforma |

---

## 🎯 Roteiro Prático da Demonstração (Live Hacking Realista)

### 1. O Fluxo de Cadastro e Aprovação de Vendedores
1. Acesse `/register` e crie um novo vendedor (ex: `pedro_tech`, senha `123`, tipo **Lojista**).
2. Tente fazer login em `/login` com `pedro_tech`.
   - *Resultado:* O sistema barra o acesso com a mensagem: *"Seu cadastro de vendedor está em análise e precisa ser aprovado pelo Administrador da plataforma."*
3. Abra a rota oculta `/backstage` ou logue como `admin` em `/admin`.
4. Na tabela de lojistas, clique em **Aprovar**.
5. Volte ao `/login` e entre com `pedro_tech`. Login liberado com sucesso!

### 2. A Guerra de Preços (Exploração de BOLA / IDOR)
1. Faça login como **Maria** (`maria` / `123`).
2. Acesse seu painel em `/dashboard` e clique em *Editar Preço* do seu produto (ID #2).
3. Na barra de endereços do navegador, troque o ID para `1` (`/dashboard/products/1/edit`), que pertence ao **João**.
4. A tela carregará a ficha do MacBook do João. Digite o preço de **R$ 1,00** e clique em **Salvar Alterações de Preço**:
   - **Com Toggle em V1 (Vulnerável):** A requisição é aceita com status 200 OK! A Maria derrubou o preço do rival para R$ 1,00.
   - **Com Toggle em V2 (Blindado):** Acesse `/backstage` e vire o switch para V2. Repita o teste. A API responderá com **403 Forbidden - Ownership Check** e a alteração será bloqueada!

### 3. Quebra de Função Administrativa (BFLA)
1. Faça login como **Alice** (`alice` / `123`).
2. Tente acessar diretamente a URL do painel admin: `/admin`.
   - **Com Toggle em V1:** O faturamento confidencial e a lista de lojistas são vazados para a cliente comum.
   - **Com Toggle em V2:** O middleware RBAC bloqueia a Alice com **403 Forbidden**.
