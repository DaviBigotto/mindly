# 🗄️ Criar Tabelas no Banco de Dados - Render

## ❌ Problema

As informações de cadastro não estão sendo salvas porque **as tabelas não foram criadas no banco de dados**.

## ✅ Solução: Executar `npm run db:push`

### Passo 1: Acessar o Shell do Render

1. **Acesse o painel do Render:**
   - Vá em: https://dashboard.render.com
   - Faça login

2. **Abra o Web Service:**
   - Clique no seu serviço `mindly-app`

3. **Abrir Shell:**
   - No menu lateral, clique em **"Shell"**
   - Isso abrirá um terminal dentro do servidor

### Passo 2: Executar o Comando

No Shell do Render, execute:

```bash
npm run db:push
```

### Passo 3: Verificar Resultado

Você deve ver mensagens como:

```
✓ Tables created successfully
✓ Migration completed
```

Ou algo similar indicando que as tabelas foram criadas.

### Passo 4: Verificar no Banco de Dados

#### Se usar Supabase:

1. **Acesse o Supabase:**
   - Vá em: https://app.supabase.com
   - Abra seu projeto

2. **Verificar tabelas:**
   - Vá em **"Table Editor"** no menu lateral
   - Você deve ver as seguintes tabelas:
     - ✅ `users`
     - ✅ `journal_entries`
     - ✅ `meditation_categories`
     - ✅ `meditation_sessions`
     - ✅ `meditation_history`
     - ✅ `focus_sessions`
     - ✅ `pro_tracks`
     - ✅ `track_steps`
     - ✅ `user_track_progress`
     - ✅ `premium_sounds`
     - ✅ `kiwify_webhook_logs`
     - ✅ `sessions`

#### Se usar Render PostgreSQL:

1. **Acesse o Render:**
   - Vá no seu banco de dados PostgreSQL
   - Use o **"Connect"** para verificar as tabelas

### Passo 5: Testar Cadastro

1. **Acesse sua aplicação:**
   - Vá em: `https://seu-app.onrender.com`

2. **Fazer cadastro:**
   - Clique em "Criar conta"
   - Preencha os dados
   - Clique em "Quero ser Mindly"

3. **Verificar no banco:**
   - Volte no Supabase (ou Render PostgreSQL)
   - Vá na tabela `users`
   - Você deve ver o usuário cadastrado!

## 🔍 Verificar se Funcionou

### No Supabase:

1. Vá em **"Table Editor"** → **"users"**
2. Você deve ver uma linha com:
   - `id`: um ID único
   - `email`: o email cadastrado
   - `first_name`: o nome
   - `last_name`: o sobrenome
   - `is_pro`: `false`
   - `plan`: `basic`
   - `storage_limit_mb`: `256`

### Verificar Logs no Render:

1. No Render, vá em **"Logs"**
2. Procure por mensagens como:
   - `User synced from frontend: email@exemplo.com`
   - `User created successfully`

## 🆘 Problemas Comuns

### Erro: "relation users does not exist"

**Solução:** Execute `npm run db:push` no Shell do Render

### Erro: "password authentication failed"

**Solução:** Verifique se o `DATABASE_URL` está correto no Render

### Erro: "connect ECONNREFUSED"

**Solução:** 
1. Verifique se o `DATABASE_URL` está correto
2. Verifique se o banco está acessível (Supabase permite conexões externas)

### Tabelas não aparecem

**Solução:**
1. Verifique se `npm run db:push` foi executado com sucesso
2. Verifique os logs para erros
3. Tente executar novamente: `npm run db:push`

## 📝 Comandos Úteis

### Verificar se DATABASE_URL está configurado:

```bash
echo $DATABASE_URL
```

### Testar conexão (se tiver psql):

```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### Ver todas as tabelas:

```bash
# No Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## ✅ Checklist

- [ ] Shell do Render aberto
- [ ] `npm run db:push` executado
- [ ] Mensagem de sucesso apareceu
- [ ] Tabelas verificadas no banco (Supabase ou Render)
- [ ] Teste de cadastro feito
- [ ] Usuário aparece na tabela `users`

## 🎯 Após Criar as Tabelas

1. **Teste fazer um cadastro**
2. **Verifique se o usuário aparece no banco**
3. **Verifique os logs do servidor**
4. **Tente fazer login novamente**

---

**Após executar `npm run db:push`, o cadastro deve funcionar perfeitamente!** ✅

