# 🚀 Guia de Deploy e Execução em Docker, Render e Vercel

Este documento detalha como executar o projeto com **Docker**, como publicar o **Backend no Render** e o **Frontend na Vercel**, além das integrações com os **MCPs da Vercel e do Render**.

---

## 🐳 1. Executando Localmente com Docker Compose

O projeto foi configurado com Dockerfiles dedicados para o Backend e o Frontend, orquestrados em rede interna isolada (`estacio-net`).

### Pré-requisitos
- Docker e Docker Compose instalados.
- Arquivo `.env` configurado na raiz com as chaves do Supabase.

### Comandos:
```bash
# Construir as imagens e iniciar os containers em segundo plano
docker compose up --build -d

# Visualizar logs em tempo real
docker compose logs -f

# Parar os serviços
docker compose down
```

### Portas Mapeadas:
- **Frontend (Next.js):** [http://localhost:3001](http://localhost:3001)
- **Backend (Express):** [http://localhost:3000](http://localhost:3000)
- **Healthcheck do Backend:** [http://localhost:3000/health](http://localhost:3000/health)
- **Slides da Apresentação:** [http://localhost:3000/slides/presentation.html](http://localhost:3000/slides/presentation.html)

---

## ☁️ 2. Deploy do Backend no Render (Docker)

O backend possui um `Dockerfile` otimizado em Node 20 Alpine e um manifesto de infraestrutura como código `render.yaml`.

### Opção A: Deploy Automático via Blueprint (`render.yaml`)
1. No painel do [Render](https://dashboard.render.com/), clique em **New > Blueprint**.
2. Conecte seu repositório Git do projeto.
3. O Render detectará automaticamente o arquivo `render.yaml` e provisionará o Web Service Docker.
4. Preencha as variáveis secretas solicitadas:
   - `SUPABASE_URL`: sua URL do Supabase (ex: `https://hqvocafkkhifeqhlsbtq.supabase.co`)
   - `SUPABASE_KEY`: sua `service_role` key do Supabase.

### Opção B: Deploy Manual (Web Service Docker)
1. No Render, clique em **New > Web Service**.
2. Selecione seu repositório Git.
3. Em **Environment**, escolha **Docker**.
4. Defina o **Health Check Path** como `/health`.
5. Em **Environment Variables**, adicione:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `SUPABASE_URL`: sua URL do Supabase
   - `SUPABASE_KEY`: sua chave do Supabase
   - `ALLOWED_ORIGINS`: `*` (ou o domínio do seu frontend na Vercel)
   - `JWT_WEAK_SECRET`: `secret123`
   - `JWT_STRONG_SECRET`: `c9b3a7f802d5e1823901bca93710d9e4823abf104928eab7183021948ba12034`
6. Clique em **Create Web Service**. Ao finalizar, anote a URL pública gerada (ex: `https://estacio-presentation-backend.onrender.com`).

---

## ⚡ 3. Deploy do Frontend na Vercel

O frontend em Next.js 14 está preparado para ler dinamicamente a URL do backend via variável de ambiente.

1. Acesse o painel da [Vercel](https://vercel.com/) e clique em **Add New > Project**.
2. Importe o repositório do projeto.
3. Em **Root Directory**, clique em **Edit** e selecione a pasta:
   ```
   frontend
   ```
4. Em **Environment Variables**, adicione a variável:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://estacio-presentation-backend.onrender.com` *(substitua pela URL real do seu backend no Render)*
5. Clique em **Deploy**.
6. A Vercel compilará a aplicação e disponibilizará o marketplace (ex: `https://estacio-presentation.vercel.app`).

> **Nota sobre CORS:** O backend já está pré-configurado para aceitar automaticamente qualquer subdomínio `*.vercel.app`, além de suporte a credenciais, cookies e preflight OPTIONS (204).

---

## 🤖 4. Configuração dos Servidores MCP (Render e Vercel)

Os MCPs oficiais da **Vercel** e do **Render** foram configurados no arquivo global do Antigravity CLI (`~/.gemini/config/mcp_config.json`):

```json
{
  "mcpServers": {
    "vercel": {
      "serverUrl": "https://mcp.vercel.com"
    },
    "render": {
      "serverUrl": "https://mcp.render.com/mcp"
    }
  }
}
```

Esses servidores permitem que o assistente interaja diretamente com as contas da Vercel e do Render para gerenciar builds, deployments, logs e configurações.
