FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia manifestos de dependências
COPY package*.json ./

# Instala dependências de produção
RUN npm ci --omit=dev || npm install --omit=dev

# Copia código-fonte e apresentações
COPY src/ ./src/
COPY presentation/ ./presentation/

# Variáveis padrão de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expõe porta do backend
EXPOSE 3000

# Healthcheck do container
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["node", "src/server.js"]
