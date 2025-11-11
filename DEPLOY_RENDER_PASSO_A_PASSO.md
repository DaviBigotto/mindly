# 🚀 Deploy no Render - Passo a Passo Completo

## 📋 Pré-requisitos

- [x] Código no GitHub (já feito!)
- [ ] Conta no Render (vamos criar)
- [ ] Banco de dados (Supabase ou Render PostgreSQL)

---

## 🗄️ PASSO 1: Criar Banco de Dados

### Opção A: Supabase (Recomendado - 100% Gratuito) ⭐

1. **Acesse o Supabase:**
   - Vá em: https://supabase.com
   - Clique em "Sign Up" ou "Start your project"

2. **Criar novo projeto:**
   - Clique em "New Project"
   - **Nome do projeto**: `mindly-app`
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha o mais próximo (ex: South America - São Paulo)
   - Clique em "Create new project"

3. **Aguardar criação:**
   - Pode levar 2-3 minutos
   - Aguarde até aparecer "Project is ready"

4. **Copiar Connection String:**
   - Vá em **Settings** (⚙️) → **Database**
   - Role até "Connection string"
   - Selecione **"URI"**
   - Copie a string (formato: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
   - **Substitua `[YOUR-PASSWORD]` pela senha que você criou**
   - ✅ **Anote essa URL completa!** Você vai precisar dela no Passo 3

### Opção B: Render PostgreSQL (Gratuito por 90 dias)

1. **Acesse o Render:**
   - Vá em: https://render.com
   - Faça login ou crie uma conta

2. **Criar banco de dados:**
   - Clique em "New +" → "PostgreSQL"
   - **Name**: `mindly-db`
   - **Database**: `mindly`
   - **User**: `mindly_user`
   - **Plan**: Free
   - Clique em "Create Database"

3. **Aguardar criação:**
   - Pode levar alguns minutos

4. **Copiar Connection String:**
   - Vá em "Connections"
   - Copie a **"Internal Database URL"**
   - ✅ **Anote essa URL!** Você vai precisar dela no Passo 3

---

## 🌐 PASSO 2: Criar Conta no Render

1. **Acesse o Render:**
   - Vá em: https://render.com
   - Clique em "Get Started for Free"

2. **Criar conta:**
   - Faça login com GitHub (recomendado) ou email
   - Confirme seu email se necessário

3. **Verificar conta:**
   - Sua conta está criada! ✅

---

## 🔗 PASSO 3: Conectar Repositório GitHub

1. **No painel do Render:**
   - Clique em "New +" → "Web Service"

2. **Conectar repositório:**
   - Se você fez login com GitHub, seus repositórios aparecerão
   - **Selecione o repositório** `mindly-app` (ou o nome que você deu)
   - Clique em "Connect"

3. **Se não aparecer o repositório:**
   - Clique em "Configure account" ou "Connect GitHub"
   - Autorize o Render a acessar seus repositórios
   - Selecione apenas o repositório `mindly-app` ou "All repositories"
   - Clique em "Install"

---

## ⚙️ PASSO 4: Configurar Web Service

### 4.1 Informações Básicas

- **Name**: `mindly-app` (ou outro nome)
- **Environment**: `Node`
- **Region**: Escolha o mais próximo (ex: Oregon, US)
- **Branch**: `main` (ou `master`)
- **Root Directory**: (deixe vazio)

### 4.2 Build & Start Commands

- **Build Command**: 
  ```
  NODE_ENV=development npm install && npm run build
  ```
  
  ⚠️ **IMPORTANTE:** Use `NODE_ENV=development` para garantir que `vite` e `esbuild` (devDependencies) sejam instalados durante o build!
  
  **Alternativa:**
  ```
  npm install --production=false && npm run build
  ```

- **Start Command**: 
  ```
  npm start
  ```

### 4.3 Plan

- **Plan**: `Free` (para começar)

### 4.4 Health Check Path

- **Health Check Path**: `/`

---

## 🔐 PASSO 5: Configurar Variáveis de Ambiente

No painel do Web Service, vá em **"Environment"** e adicione as seguintes variáveis:

### Variáveis Obrigatórias:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `[Cole a Connection String do Passo 1]`
   - ⚠️ **IMPORTANTE:** Se usar Supabase, substitua `[YOUR-PASSWORD]` pela senha real

3. **SESSION_SECRET**
   - Key: `SESSION_SECRET`
   - Value: `[Gere um valor aleatório]`
   - 💡 **Como gerar:**
     - Abra o PowerShell/Terminal
     - Execute: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     - Copie o valor gerado

4. **KIWIFY_WEBHOOK_TOKEN**
   - Key: `KIWIFY_WEBHOOK_TOKEN`
   - Value: `SEUTOKENAQUI` (ou outro token seguro)
   - ⚠️ **IMPORTANTE:** Use o mesmo token no painel da Kiwify

### Variáveis Opcionais (já têm valores padrão):

5. **KIWIFY_PRO_STORAGE_MB**
   - Key: `KIWIFY_PRO_STORAGE_MB`
   - Value: `2048`

6. **KIWIFY_BASIC_STORAGE_MB**
   - Key: `KIWIFY_BASIC_STORAGE_MB`
   - Value: `256`

7. **VITE_KIWIFY_CHECKOUT_URL**
   - Key: `VITE_KIWIFY_CHECKOUT_URL`
   - Value: `https://pay.kiwify.com.br/TXmPcok`

8. **VITE_KIWIFY_OFFER_MINUTES**
   - Key: `VITE_KIWIFY_OFFER_MINUTES`
   - Value: `30`

### 📝 Resumo das Variáveis:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
SESSION_SECRET=valor_aleatorio_gerado
KIWIFY_WEBHOOK_TOKEN=SEUTOKENAQUI
KIWIFY_PRO_STORAGE_MB=2048
KIWIFY_BASIC_STORAGE_MB=256
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/TXmPcok
VITE_KIWIFY_OFFER_MINUTES=30
```

---

## 🚀 PASSO 6: Fazer o Primeiro Deploy

1. **Criar o serviço:**
   - Após configurar tudo, clique em **"Create Web Service"**

2. **Aguardar o build:**
   - O Render vai:
     - Clonar seu repositório
     - Instalar dependências (`npm install`)
     - Fazer o build (`npm run build`)
     - Iniciar o servidor (`npm start`)
   - ⏱️ Isso pode levar **5-10 minutos** na primeira vez

3. **Verificar logs:**
   - Durante o build, você pode ver os logs em tempo real
   - Procure por erros (mensagens em vermelho)

4. **Aguardar conclusão:**
   - Quando aparecer "Your service is live", está pronto! ✅

---

## 🗃️ PASSO 7: Configurar Banco de Dados ⚠️ OBRIGATÓRIO

**⚠️ IMPORTANTE:** Este passo é **OBRIGATÓRIO**! Sem ele, o cadastro não funcionará!

### Opção A: Via Shell do Render (Recomendado)

1. **Abrir Shell:**
   - No painel do Web Service, clique em **"Shell"**
   - Isso abre um terminal dentro do servidor

2. **Executar migração:**
   ```bash
   npm run db:push
   ```

3. **Verificar resultado:**
   - Você deve ver mensagens como "Tables created successfully"
   - Se houver erro, verifique se `DATABASE_URL` está correto

### Opção B: Via Terminal Local

1. **Configurar DATABASE_URL localmente:**
   ```bash
   # PowerShell
   $env:DATABASE_URL="postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres"
   
   # Linux/Mac
   export DATABASE_URL="postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres"
   ```

2. **Executar migração:**
   ```bash
   npm run db:push
   ```

3. **Verificar:**
   - As tabelas devem ser criadas no banco de dados

---

## 🔗 PASSO 8: Configurar Webhook da Kiwify

1. **Acesse o painel da Kiwify:**
   - Faça login na sua conta Kiwify
   - Vá em configurações do produto

2. **Configurar webhook:**
   - **URL do Webhook**: `https://seu-app.onrender.com/api/webhooks/kiwify`
     - ⚠️ Substitua `seu-app` pelo nome do seu serviço no Render
     - Exemplo: `https://mindly-app.onrender.com/api/webhooks/kiwify`
   - **Token**: Use o mesmo valor de `KIWIFY_WEBHOOK_TOKEN`
   - **Eventos**: Selecione os eventos que você quer receber:
     - ✅ Assinatura renovada
     - ✅ Assinatura cancelada
     - ✅ Assinatura atrasada

3. **Salvar configuração:**
   - Clique em "Salvar" ou "Update"

4. **Testar webhook:**
   - Use a interface admin em: `https://seu-app.onrender.com/admin/kiwify`
   - Ou teste manualmente via Kiwify

---

## ✅ PASSO 9: Verificar se Está Funcionando

### 9.1 Acessar a Aplicação

1. **URL da aplicação:**
   - No painel do Render, você verá a URL do seu serviço
   - Formato: `https://mindly-app.onrender.com`
   - Clique na URL para abrir

2. **Verificar se carrega:**
   - A página inicial deve carregar
   - Se aparecer erro, verifique os logs

### 9.2 Testar Funcionalidades

1. **Testar login/cadastro:**
   - Tente criar uma conta
   - Verifique se salva no banco de dados

2. **Testar funcionalidades Pro:**
   - Se tiver acesso Pro, teste as funcionalidades
   - Verifique se está funcionando

3. **Verificar logs:**
   - No painel do Render, vá em "Logs"
   - Procure por erros ou mensagens de sucesso

### 9.3 Verificar Banco de Dados

1. **No Supabase:**
   - Vá em "Table Editor"
   - Você deve ver as tabelas criadas:
     - `users`
     - `journal_entries`
     - `kiwify_webhook_logs`
     - etc.

2. **Verificar dados:**
   - Tente criar um usuário
   - Verifique se aparece na tabela `users`

---

## 🔧 PASSO 10: Troubleshooting

### Problema: Build falha

**Solução:**
1. Verifique os logs no Render
2. Confirme que todas as dependências estão no `package.json`
3. Verifique se o Node.js version está correto

### Problema: Servidor não inicia

**Solução:**
1. Verifique se `DATABASE_URL` está correto
2. Confirme que `dist/index.js` existe após o build
3. Verifique os logs para erros específicos

### Problema: Arquivos estáticos não carregam

**Solução:**
1. Confirme que o build gerou arquivos em `dist/public`
2. Verifique se o caminho em `serveStatic` está correto
3. Confirme que `index.html` existe em `dist/public`

### Problema: Erro de conexão com banco

**Solução:**
1. Verifique se `DATABASE_URL` está correto
2. Confirme que o banco está acessível (não bloqueado por firewall)
3. Verifique se as credenciais estão corretas
4. **Se usar Supabase:** Verifique se a senha foi substituída corretamente

### Problema: App dorme após 15min

**Solução:**
- Isso é normal no plano gratuito do Render
- A primeira requisição após dormir pode demorar ~30s
- Considere usar um serviço de ping (UptimeRobot) para manter ativo

### Problema: Webhook não funciona

**Solução:**
1. Verifique se a URL do webhook está correta
2. Confirme que o token está correto
3. Verifique os logs no Render
4. Teste manualmente via interface admin

---

## 📝 Checklist Final

- [ ] Banco de dados criado (Supabase ou Render)
- [ ] Connection String copiada
- [ ] Conta no Render criada
- [ ] Repositório GitHub conectado
- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build completado com sucesso
- [ ] Tabelas criadas no banco (`npm run db:push`)
- [ ] Webhook da Kiwify configurado
- [ ] Aplicação acessível via URL
- [ ] Funcionalidades testadas
- [ ] Logs verificados (sem erros)

---

## 🎯 Próximos Passos

1. **Configurar domínio próprio (opcional):**
   - No Render, vá em "Settings" → "Custom Domain"
   - Adicione seu domínio

2. **Configurar monitoramento:**
   - Use serviços como UptimeRobot para monitorar a aplicação
   - Configure alertas para downtime

3. **Otimizar performance:**
   - Configure cache se necessário
   - Otimize imagens e assets

4. **Backup do banco de dados:**
   - Configure backup automático no Supabase
   - Ou configure backup manual no Render

---

## 🔗 Links Úteis

- [Render Dashboard](https://dashboard.render.com)
- [Supabase Dashboard](https://app.supabase.com)
- [Documentação Render](https://render.com/docs)
- [Documentação Supabase](https://supabase.com/docs)

---

## 🆘 Precisa de Ajuda?

Se tiver problemas:
1. Verifique os logs no Render
2. Verifique os logs no Supabase
3. Confirme que todas as variáveis de ambiente estão corretas
4. Teste localmente antes de fazer deploy

---

## ✅ Pronto!

Sua aplicação está no ar! 🎉

Acesse: `https://seu-app.onrender.com`

