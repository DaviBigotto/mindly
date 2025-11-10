# Guia de Deploy - Mindly App

## 🚀 Deploy no Render (Recomendado)

### Passo 1: Preparar o repositório
1. Crie um repositório no GitHub
2. Faça push do código:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/mindly-app.git
git push -u origin main
```

### Passo 2: Criar banco de dados

**Opção A: Supabase (Recomendado - 100% Gratuito para sempre) ⭐**
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Configure:
   - **Name**: `mindly-app`
   - **Database Password**: (crie uma senha forte)
   - **Region**: Escolha o mais próximo (ex: South America - São Paulo)
4. Aguarde a criação (pode levar 2-3 minutos)
5. Vá em "Settings" → "Database"
6. Em "Connection string", copie a **URI** (será usado como `DATABASE_URL`)
   - Formato: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`
7. ✅ **Gratuito para sempre** com 500 MB de armazenamento

**Opção B: Render PostgreSQL (Gratuito por 90 dias, depois $7/mês)**
1. Acesse [render.com](https://render.com) e crie uma conta
2. Vá em "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `mindly-db`
   - **Database**: `mindly`
   - **User**: `mindly_user`
   - **Plan**: Free
4. Aguarde a criação (pode levar alguns minutos)
5. Vá em "Connections" e copie a **Internal Database URL** (será usado como `DATABASE_URL`)
6. ⚠️ **Gratuito por 90 dias**, depois $7/mês

**💡 Recomendação:** Use **Supabase** para ter PostgreSQL 100% gratuito para sempre!

### Passo 3: Criar Web Service
1. Vá em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `mindly-app`
   - **Environment**: Node
   - **Region**: Escolha o mais próximo
   - **Branch**: `main`
   - **Root Directory**: (deixe vazio)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Passo 4: Configurar variáveis de ambiente
No painel do Web Service, vá em "Environment" e adicione:

```env
NODE_ENV=production
DATABASE_URL=<URL do banco criado no Passo 2 (Supabase ou Render)>
SESSION_SECRET=<gere um valor aleatório>
KIWIFY_WEBHOOK_TOKEN=SEUTOKENAQUI
KIWIFY_PRO_STORAGE_MB=2048
KIWIFY_BASIC_STORAGE_MB=256
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/TXmPcok
VITE_KIWIFY_OFFER_MINUTES=30
```

**💡 Nota sobre custos:**
- **Render Web Service**: ✅ Gratuito para sempre
- **Supabase PostgreSQL**: ✅ Gratuito para sempre (500 MB)
- **Render PostgreSQL**: ⚠️ Gratuito por 90 dias, depois $7/mês

Veja `COSTOS.md` para mais detalhes sobre custos e opções.

**Para gerar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Passo 5: Configurar o banco de dados
1. Após o primeiro deploy, acesse o shell do serviço (no Render, vá em "Shell")
2. Execute:
```bash
npm run db:push
```
3. Isso criará todas as tabelas necessárias no banco de dados

**Alternativa:** Você também pode executar localmente antes do deploy:
```bash
# Configure DATABASE_URL localmente apontando para o banco do Render
export DATABASE_URL="postgresql://..."
npm run db:push
```

### Passo 6: Configurar webhook da Kiwify
1. No painel da Kiwify, configure o webhook:
   - **URL**: `https://seu-app.onrender.com/api/webhooks/kiwify`
   - **Token**: O mesmo valor de `KIWIFY_WEBHOOK_TOKEN`

## 🔧 Deploy no Railway

### Passo 1: Criar projeto
1. Acesse [railway.app](https://railway.app)
2. Crie uma conta
3. Clique em "New Project" → "Deploy from GitHub repo"

### Passo 2: Adicionar PostgreSQL
1. No projeto, clique em "New" → "Database" → "PostgreSQL"
2. Railway criará automaticamente a variável `DATABASE_URL`

### Passo 3: Configurar variáveis de ambiente
No painel do projeto, vá em "Variables" e adicione todas as variáveis do Passo 4 do Render.

### Passo 4: Deploy
O Railway fará o deploy automaticamente quando você fizer push no GitHub.

## 📝 Notas importantes

### 💰 Plano Gratuito do Render - O que é GRÁTIS:

#### ✅ Web Service (Backend + Frontend):
- **Gratuito** para sempre
- **750 horas/mês** de CPU (suficiente para rodar 24/7)
- **512 MB RAM**
- **SSL gratuito** incluído
- **Deploy automático** via GitHub
- **Limitação**: Serviços dormem após 15min de inatividade (primeira requisição pode demorar ~30s para "acordar")

#### ✅ PostgreSQL Database:
- **Gratuito por 90 dias** (trial)
- **1 GB de armazenamento**
- Após 90 dias: **$7/mês** para continuar usando
- **Backup automático** incluído

#### 💡 Alternativas para PostgreSQL após 90 dias:
1. **Supabase** (já está usando): PostgreSQL gratuito com 500 MB
2. **Neon** (neon.tech): PostgreSQL serverless gratuito com 3 GB
3. **Railway**: PostgreSQL com créditos gratuitos
4. **Render pago**: $7/mês para PostgreSQL

### Limitações do plano gratuito:
- **Render**: Serviços dormem após 15min de inatividade (primeira requisição pode demorar)
- **Railway**: $5 crédito/mês (pode durar ~1 mês dependendo do uso)
- **Fly.io**: 3 VMs compartilhadas (pode ser lento)

### 💰 Resumo de Custos:

**Render (Plano Gratuito):**
- ✅ Web Service: **GRÁTIS** para sempre
- ✅ PostgreSQL: **GRÁTIS** por 90 dias, depois **$7/mês**
- ✅ Total após 90 dias: **$7/mês** (apenas banco de dados)

**Render (Alternativa Grátis):**
- ✅ Web Service: **GRÁTIS** para sempre
- ✅ PostgreSQL no Supabase: **GRÁTIS** para sempre (500 MB)
- ✅ Total: **$0/mês** (100% gratuito)

### Melhorias para produção:
1. **Domínio próprio**: Configure um domínio personalizado
2. **SSL**: Render e Railway já incluem SSL gratuito
3. **Monitoramento**: Configure logs e alertas
4. **Backup**: Configure backup automático do banco de dados

### Troubleshooting:
- **Erro de conexão com banco**: Verifique se `DATABASE_URL` está correto
- **Build falha**: Verifique os logs no painel da plataforma
- **App dorme**: No Render, considere usar um serviço de "ping" para manter ativo

## 🚀 Deploy no Vercel

O Vercel é uma excelente opção, mas tem limitações para aplicações Express tradicionais. Veja o guia completo em `DEPLOY_VERCEL.md`.

**Resumo:**
- ✅ **Melhor para frontend**: Deploy rápido com CDN global
- ⚠️ **Backend**: Requer adaptações para serverless ou use Vercel (frontend) + Render (backend)
- 📝 **Recomendação**: Use Render para full-stack ou Vercel apenas para frontend

## 💰 Custos e Opções Gratuitas

Veja o arquivo `COSTOS.md` para uma análise detalhada de custos e opções 100% gratuitas.

**Resumo:**
- ✅ **100% Gratuito**: Render (Web Service) + Supabase (PostgreSQL) = $0/mês
- ⚠️ **Quase Gratuito**: Render (Full-Stack) = $7/mês após 90 dias
- 💵 **Créditos**: Railway = $5 crédito/mês

## 🔗 Links úteis
- [Documentação Render](https://render.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Railway](https://docs.railway.app)
- [Documentação Fly.io](https://fly.io/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Guia Vercel Completo](./DEPLOY_VERCEL.md)
- [Análise de Custos](./COSTOS.md)

