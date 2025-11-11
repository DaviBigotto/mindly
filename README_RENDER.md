# 🚀 Deploy no Render - Guia Rápido

## 📝 Resumo em 10 Passos

### 1️⃣ Criar Banco de Dados no Supabase (5 min)
- Acesse: https://supabase.com
- Crie um projeto
- Copie a Connection String
- **Substitua `[YOUR-PASSWORD]` pela senha real**

### 2️⃣ Criar Conta no Render (2 min)
- Acesse: https://render.com
- Faça login com GitHub

### 3️⃣ Criar Web Service (5 min)
- Clique em "New +" → "Web Service"
- Conecte seu repositório GitHub
- Configure:
  - **Build Command**: `NODE_ENV=development npm install && npm run build`
  - **Start Command**: `npm start`
  
  ⚠️ **IMPORTANTE:** Use `NODE_ENV=development` para instalar `vite` e `esbuild` (devDependencies)!

### 4️⃣ Configurar Variáveis de Ambiente (5 min)
Adicione no Render:
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres
SESSION_SECRET=GERAR_VALOR_ALEATORIO
KIWIFY_WEBHOOK_TOKEN=SEUTOKENAQUI
KIWIFY_PRO_STORAGE_MB=2048
KIWIFY_BASIC_STORAGE_MB=256
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/TXmPcok
VITE_KIWIFY_OFFER_MINUTES=30
```

### 5️⃣ Fazer Deploy (10 min)
- Clique em "Create Web Service"
- Aguarde o build completar

### 6️⃣ Criar Tabelas no Banco (2 min)
- No Render, vá em "Shell"
- Execute: `npm run db:push`

### 7️⃣ Configurar Webhook Kiwify (5 min)
- URL: `https://seu-app.onrender.com/api/webhooks/kiwify`
- Token: mesmo de `KIWIFY_WEBHOOK_TOKEN`

### 8️⃣ Testar Aplicação
- Acesse: `https://seu-app.onrender.com`
- Teste login e funcionalidades

---

## 🔧 Gerar SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Checklist

- [ ] Banco criado no Supabase
- [ ] Connection String copiada
- [ ] Conta no Render criada
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy feito
- [ ] Tabelas criadas (`npm run db:push`)
- [ ] Webhook Kiwify configurado
- [ ] App testado

---

## 🆘 Problemas?

- **Build falha?** → Verifique logs
- **Banco não conecta?** → Verifique `DATABASE_URL`
- **App não inicia?** → Verifique logs

---

## 📚 Guias Completos

- **Guia Completo**: `DEPLOY_RENDER_PASSO_A_PASSO.md`
- **Quick Start**: `RENDER_QUICK_START.md`
- **Custos**: `COSTOS.md`

---

## 🎯 Pronto!

Sua aplicação está no ar! 🎉

Acesse: `https://seu-app.onrender.com`

