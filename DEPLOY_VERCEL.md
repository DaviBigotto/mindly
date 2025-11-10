# 🚀 Deploy no Vercel - Guia Completo

## ⚠️ Importante: Limitações do Vercel

O Vercel é excelente para aplicações, mas tem algumas considerações importantes:

### ✅ Vantagens:
- **Deploy gratuito** e muito rápido
- **SSL automático** e CDN global
- **Deploy automático** via GitHub
- **Serverless Functions** (escala automaticamente)
- **Vercel Postgres** disponível (pago, mas tem tier gratuito limitado)

### ❌ Limitações:
- **Serverless Functions**: Cada requisição é uma função separada (cold start)
- **Sem servidor contínuo**: Express tradicional precisa ser adaptado
- **Timeout**: 10s no plano gratuito, 60s no Pro
- **Sessões**: Session storage com PostgreSQL pode ter problemas (use JWT ou cookies)
- **WebSockets**: Não suportado nativamente

## 📋 Opções de Deploy no Vercel

### Opção 1: Frontend no Vercel + Backend em outro lugar (Recomendado)

**Melhor para:** Aplicações que precisam de servidor contínuo

1. **Frontend no Vercel**: Deploy apenas do cliente React
2. **Backend no Render/Railway**: Deploy do servidor Express

**Vantagens:**
- Frontend rápido e CDN global
- Backend com servidor contínuo
- Melhor para WebSockets e sessões

### Opção 2: Full-stack no Vercel (Serverless)

**Melhor para:** Aplicações que podem ser adaptadas para serverless

Requer adaptações no código para funcionar com Serverless Functions.

## 🔧 Deploy Full-Stack no Vercel

### Passo 1: Instalar dependências necessárias

```bash
npm install serverless-http
npm install --save-dev @vercel/node
```

### Passo 2: Criar arquivo de configuração do Vercel

Já criado: `vercel.json`

### Passo 3: Adaptar o servidor para Vercel

O arquivo `api/index.ts` já foi criado como exemplo. Você precisará:

1. **Adaptar sessões**: Usar cookies em vez de session storage
2. **Remover dependência de servidor HTTP contínuo**
3. **Ajustar rotas para serverless**

### Passo 4: Configurar Vercel Postgres (Opcional)

1. Acesse [vercel.com](https://vercel.com)
2. Vá em seu projeto → "Storage" → "Create Database" → "Postgres"
3. Configure as variáveis de ambiente

### Passo 5: Deploy

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

### Passo 6: Configurar variáveis de ambiente

No painel do Vercel, vá em "Settings" → "Environment Variables" e adicione:

```env
NODE_ENV=production
DATABASE_URL=<sua URL do Vercel Postgres ou externo>
SESSION_SECRET=<gere um valor aleatório>
KIWIFY_WEBHOOK_TOKEN=SEUTOKENAQUI
KIWIFY_PRO_STORAGE_MB=2048
KIWIFY_BASIC_STORAGE_MB=256
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/TXmPcok
VITE_KIWIFY_OFFER_MINUTES=30
```

## 🔄 Alternativa: Frontend no Vercel + Backend no Render

### Passo 1: Deploy do Backend no Render
Siga o guia em `DEPLOY.md` para fazer deploy do backend no Render.

### Passo 2: Configurar Frontend para apontar para o backend

Crie um arquivo `.env.production`:

```env
VITE_API_URL=https://seu-backend.onrender.com
```

### Passo 3: Deploy do Frontend no Vercel

1. Crie um repositório separado para o frontend (ou use monorepo)
2. Configure build:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Passo 4: Configurar CORS no backend

No seu backend Render, adicione CORS para permitir requisições do Vercel:

```typescript
import cors from "cors";

app.use(cors({
  origin: process.env.VERCEL_URL || "https://seu-app.vercel.app",
  credentials: true
}));
```

## 📊 Comparação: Vercel vs Render

| Recurso | Vercel | Render |
|---------|--------|--------|
| **Deploy Frontend** | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐ Bom |
| **Deploy Backend** | ⭐⭐⭐ Requer adaptação | ⭐⭐⭐⭐⭐ Excelente |
| **PostgreSQL** | ⭐⭐ Pago (tier limitado) | ⭐⭐⭐⭐ Gratuito (90 dias) |
| **Serverless** | ⭐⭐⭐⭐⭐ Sim | ⭐⭐ Não |
| **Servidor Contínuo** | ⭐⭐ Não | ⭐⭐⭐⭐⭐ Sim |
| **WebSockets** | ⭐ Não | ⭐⭐⭐⭐⭐ Sim |
| **Sessões** | ⭐⭐ Limitado | ⭐⭐⭐⭐⭐ Completo |
| **Timeout** | ⭐⭐ 10s (free) | ⭐⭐⭐⭐ Sem limite |
| **Cold Start** | ⭐⭐ Sim | ⭐⭐⭐⭐⭐ Não |

## 🎯 Recomendação Final

### Para sua aplicação Mindly:

**Opção Recomendada: Render (Full-Stack)**
- ✅ Servidor contínuo (importante para sessões)
- ✅ PostgreSQL gratuito
- ✅ Sem cold start
- ✅ Suporta WebSockets (se necessário no futuro)
- ✅ Melhor para webhooks da Kiwify

**Alternativa: Vercel (Frontend) + Render (Backend)**
- ✅ Frontend rápido com CDN
- ✅ Backend robusto
- ✅ Melhor dos dois mundos
- ⚠️ Requer configurar CORS
- ⚠️ Duas plataformas para gerenciar

**Não Recomendado: Vercel Full-Stack**
- ❌ Requer refatoração significativa
- ❌ Limitações com sessões
- ❌ Cold start pode afetar performance
- ❌ Timeout de 10s pode ser limitante

## 🔗 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel + Express](https://vercel.com/docs/frameworks/backend/express)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Serverless Express](https://www.npmjs.com/package/serverless-http)

## 💡 Dica

Se você quiser usar Vercel, recomendo a **Opção 1**: Frontend no Vercel + Backend no Render. Isso dá a você:
- Frontend super rápido com CDN global
- Backend robusto com servidor contínuo
- Melhor experiência para seus usuários

