# ⚡ Render - Quick Start (Início Rápido)

## 🎯 Resumo Rápido

### 1. Banco de Dados (5 min)
- [ ] Criar no Supabase: https://supabase.com
- [ ] Copiar Connection String
- [ ] Substituir `[YOUR-PASSWORD]` pela senha real

### 2. Render (10 min)
- [ ] Criar conta: https://render.com
- [ ] Novo Web Service
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Deploy!

### 3. Banco de Dados (2 min)
- [ ] Shell do Render: `npm run db:push`

### 4. Kiwify (5 min)
- [ ] Configurar webhook: `https://seu-app.onrender.com/api/webhooks/kiwify`
- [ ] Token: mesmo de `KIWIFY_WEBHOOK_TOKEN`

---

## 📋 Variáveis de Ambiente (Copiar e Colar)

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

**Para gerar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Comandos de Build

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

---

## 🔗 URLs Importantes

- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://app.supabase.com
- **Seu App**: `https://seu-app.onrender.com`
- **Webhook Kiwify**: `https://seu-app.onrender.com/api/webhooks/kiwify`

---

## ✅ Checklist Rápido

- [ ] Banco criado (Supabase)
- [ ] Connection String copiada
- [ ] Render criado
- [ ] Variáveis configuradas
- [ ] Deploy feito
- [ ] `npm run db:push` executado
- [ ] Webhook Kiwify configurado
- [ ] App funcionando!

---

## 🆘 Problemas?

1. **Build falha?** → Verifique logs
2. **Banco não conecta?** → Verifique `DATABASE_URL`
3. **App não inicia?** → Verifique `PORT` e logs
4. **Arquivos não carregam?** → Verifique `dist/public`

---

Veja o guia completo em: `DEPLOY_RENDER_PASSO_A_PASSO.md`

