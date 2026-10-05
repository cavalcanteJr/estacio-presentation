# 🎙️ Roteiro do Apresentador: Teste de Segurança em REST APIs (20 Minutos)

Este guia foi elaborado para te orientar segundo a segundo durante a apresentação na faculdade, equilibrando conceitos rápidos, analogias do dia a dia e impacto visual na demonstração ao vivo.

---

## ⏱️ Minuto a Minuto

### [00:00 - 03:00] Abertura e O Cenário Real (Slides 1 e 2)
- **O que falar:**
  > "Boa noite, pessoal! Hoje nós vamos falar sobre segurança no que move a web moderna: REST APIs. Quem aqui já desenvolveu uma API que retorna um token JWT no login? Pois é, quase todo mundo. Mas existe um abismo gigantesco entre *autenticar* um usuário e *garantir que ele só faça o que tem permissão*.
  > Hoje nós vamos ver como um e-commerce com vários vendedores pode ir à falência em 5 minutos se não cuidarmos de duas vulnerabilidades do Top 10 da OWASP: BOLA e BFLA."
- **Ação:** Mostre o **Slide 2** apresentando os personagens: Alice (cliente comum), João e Maria (vendedores rivais) e Carlos (Admin).
- **Gancho:** *"Se todos eles recebem um JWT válido... o que impede a Maria de alterar os produtos do João?"*

---

### [03:00 - 06:00] Desmistificando o JWT (Slide 3)
- **O que falar:**
  > "Primeiro mito de mercado que vocês precisam esquecer hoje: JWT NÃO é criptografia! O JWT é dividido em 3 partes separadas por pontos: Header, Payload e Signature.
  > O Payload é apenas Base64URL. Qualquer pessoa que interceptar ou olhar o token no DevTools do navegador consegue ler tudo o que está escrito.
  > A segurança do JWT está na *Assinatura*. Ela garante que ninguém mexeu no conteúdo. Mas o que acontece se o desenvolvedor usar um segredo fraco como `secret123`? O atacante forja um token dizendo que é ADMIN e o servidor aceita!"
- **Ação:** Mostre as cores no **Slide 3** (Header em vermelho, Payload em rosa, Assinatura em azul).

---

### [06:00 - 09:00] Conceito BFLA e BOLA (Slides 4 e 5)
- **O que falar:**
  > "As duas maiores falhas de autorização do mundo real:
  > 1. **BFLA (Broken Function Level Authorization):** O desenvolvedor cria uma rota `/admin/financials`. Ele coloca o middleware de autenticação, então a requisição precisa de um token. Mas ele esquece de checar: *'Esse usuário é admin ou é a Alice compradora?'*
  > 2. **BOLA (Broken Object Level Authorization):** É a vulnerabilidade #1 da OWASP. A rota é `PUT /products/:id/price`. O código simplesmente faz `update product set price = :price where id = :id`. Ele não pergunta se o usuário autenticado é o dono do produto."
- **Ação:** Mostre a comparação lado a lado do código vermelho (vulnerável) vs verde (corrigido) nos **Slides 4 e 5**.

---

### [09:00 - 16:00] Live Hacking ao Vivo! (Slide 6 + REST Client / Postman)
*Dica: Mantenha a API rodando no terminal com `npm start`.*

#### Passo 1: Os Logins (1 min)
- Abra o arquivo `test-requests/requests.http` (ou Postman).
- Execute o login da **Alice** e do **João**.
- Mostre o token retornado no console.

#### Passo 2: O Ataque BFLA (2 min)
- Execute a requisição `GET /api/v1/admin/financials` usando o token da **Alice**.
- **Resultado na tela:** Status 200 OK com as métricas financeiras secretas!
- Comente com os alunos: *"A Alice é uma cliente comum e acabou de ter acesso ao faturamento total da plataforma porque a API só checou se ela estava logada, mas não checou o papel dela."*
- Execute `POST /api/v1/products` com o token da Alice para criar um produto. Mais um sucesso indevido!

#### Passo 3: O Ataque BOLA / IDOR (Guerra de Preços) (2 min)
- Execute `GET /api/v1/products` e mostre o produto #1: **MacBook Pro M3 do João por R$ 14.999,00**.
- Faça login com a vendedora concorrente, **Maria**.
- Execute `PUT /api/v1/products/1/price` com o token da Maria, enviando `{"newPrice": 1.00}`.
- **Resultado na tela:** Sucesso! O preço do notebook do concorrente agora é R$ 1,00.
- Mostre o impacto: *"Imaginem isso em produção durante a Black Friday. O prejuízo seria milionário."*

#### Passo 4: A Correção na Prática (V2) (2 min)
- Execute a mesma tentativa da Maria em `PUT /api/v2/products/1/price`.
- **Resultado:** **403 Forbidden - BOLA Bloqueado!**
- Execute a tentativa da Alice em `GET /api/v2/admin/financials`.
- **Resultado:** **403 Forbidden - BFLA Prevenido por RBAC!**
- Finalize mostrando que quando o João (dono legítimo) altera seu próprio produto na V2, o retorno é **200 OK**.

---

### [16:00 - 18:30] Lições de Ouro (Slide 7)
- **O que falar:**
  > "Para vocês levarem para os projetos e entrevistas de estágio:
  > 1. Autenticação é saber *quem é você*. Autorização é saber *se você pode tocar naquele dado*.
  > 2. No banco de dados, nunca faça queries baseadas apenas no ID do recurso. Sempre amarre `WHERE id = :productId AND seller_id = :userId`.
  > 3. Use segredos criptograficamente fortes para assinar tokens JWT e valide o algoritmo explicitamente no backend."

---

### [18:30 - 20:00] Encerramento e Perguntas
- Abra para 1 ou 2 dúvidas dos alunos.
- Deixe na tela o Slide de encerramento com seus contatos / GitHub.
