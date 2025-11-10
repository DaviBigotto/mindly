# ✅ Checklist para Deploy no Render

## 📋 Antes do Deploy

### 1. Verificações de Código
- [x] `package.json` tem scripts `build` e `start` corretos
- [x] `server/index.ts` lê a porta da variável `PORT`
- [x] `server/vite.ts` serve arquivos estáticos de `dist/public`
- [x] `vite.config.ts` compila para `dist/public`
- [x] `.gitignore` inclui `dist/` e `node_modules/`
- [x] Não há referências hardcoded a localhost

### 2. Variáveis de Ambiente Necessárias
- [ ] `DATABASE_URL` - URL do PostgreSQL (Supabase ou Render)
- [ ] `SESSION_SECRET` - Chave secreta para sessões (gerar aleatório)
- [ ] `KIWIFY_WEBHOOK_TOKEN` - Token do webhook da Kiwify
- [ ] `KIWIFY_PRO_STORAGE_MB` - Limite de armazenamento Pro (padrão: 2048)
- [ ] `KIWIFY_BASIC_STORAGE_MB` - Limite de armazenamento Básico (padrão: 256)
- [ ] `VITE_KIWIFY_CHECKOUT_URL` - URL do checkout da Kiwify
- [ ] `VITE_KIWIFY_OFFER_MINUTES` - Minutos para oferta expirar (padrão: 30)
- [ ] `NODE_ENV=production` - Ambiente de produção

### 3. Banco de Dados
- [ ] Criar PostgreSQL no Supabase OU Render
- [ ] Copiar connection string (DATABASE_URL)
- [ ] Executar `npm run db:push` para criar tabelas

### 4. Configuração do Render
- [ ] Criar conta no Render
- [ ] Conectar repositório GitHub
- [ ] Criar Web Service
- [ ] Configurar variáveis de ambiente
- [ ] Configurar build command: `npm install && npm run build`
- [ ] Configurar start command: `npm start`

## 🚀 Passo a Passo no Render

### Passo 1: Criar Web Service
1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `mindly-app`
   - **Environment**: `Node`
   - **Region**: Escolha o mais próximo
   - **Branch**: `main` (ou sua branch principal)
   - **Root Directory**: (deixe vazio)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Passo 2: Configurar Variáveis de Ambiente
No painel do Web Service, vá em "Environment" e adicione:

```env
NODE_ENV=production
DATABASE_URL=<sua URL do Supabase ou Render>
SESSION_SECRET=<gere um valor aleatório>
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

### Passo 3: Primeiro Deploy
1. Clique em "Create Web Service"
2. Aguarde o build completar (pode levar 5-10 minutos)
3. Verifique os logs para erros

### Passo 4: Configurar Banco de Dados
1. Após o primeiro deploy, vá em "Shell" no Render
2. Execute: `npm run db:push`
3. Isso criará todas as tabelas necessárias

**Alternativa:** Execute localmente antes do deploy:
```bash
export DATABASE_URL="postgresql://..."
npm run db:push
```

### Passo 5: Configurar Webhook da Kiwify
1. No painel da Kiwify, configure o webhook:
   - **URL**: `https://seu-app.onrender.com/api/webhooks/kiwify`
   - **Token**: O mesmo valor de `KIWIFY_WEBHOOK_TOKEN`

## 🔍 Verificações Pós-Deploy

### Testar a Aplicação
- [ ] Acesse a URL do Render (ex: `https://mindly-app.onrender.com`)
- [ ] Verifique se a página inicial carrega
- [ ] Teste login/cadastro
- [ ] Teste funcionalidades Pro (se tiver acesso)
- [ ] Verifique se os webhooks estão funcionando

### Verificar Logs
- [ ] Acesse "Logs" no painel do Render
- [ ] Verifique se não há erros
- [ ] Confirme que o servidor está rodando na porta correta

### Verificar Banco de Dados
- [ ] Teste criar um usuário
- [ ] Verifique se as tabelas foram criadas
- [ ] Teste funcionalidades que usam o banco

## ⚠️ Problemas Comuns

### Build Falha
- Verifique os logs no Render
- Confirme que todas as dependências estão no `package.json`
- Verifique se o Node.js version está correto (Render usa a versão do `package.json`)

### Servidor Não Inicia
- Verifique se `PORT` está sendo lida corretamente
- Confirme que `dist/index.js` existe após o build
- Verifique se `dist/public` existe após o build

### Arquivos Estáticos Não Carregam
- Confirme que o build gerou arquivos em `dist/public`
- Verifique se o caminho em `serveStatic` está correto
- Confirme que `index.html` existe em `dist/public`

### Erro de Conexão com Banco
- Verifique se `DATABASE_URL` está correto
- Confirme que o banco está acessível (não bloqueado por firewall)
- Verifique se as credenciais estão corretas

### App Dorme Após 15min
- Isso é normal no plano gratuito do Render
- A primeira requisição após dormir pode demorar ~30s
- Considere usar um serviço de ping (UptimeRobot) para manter ativo

## 📝 Arquivos Verificados

- ✅ `package.json` - Scripts corretos
- ✅ `server/index.ts` - Lê PORT corretamente
- ✅ `server/vite.ts` - Serve arquivos estáticos corretamente
- ✅ `vite.config.ts` - Compila para dist/public
- ✅ `render.yaml` - Configuração do Render
- ✅ `.gitignore` - Ignora dist e node_modules

## 🎯 Pronto para Deploy!

Se todas as verificações acima estão ok, você está pronto para fazer o deploy no Render!

