# 🗄️ Criar Tabelas no Banco de Dados

## ❌ Problema

As informações de cadastro não estão sendo salvas porque **as tabelas não foram criadas no banco de dados**.

## ✅ Solução: Executar `npm run db:push` Localmente (GRATUITA)

**💡 Como o Shell do Render é pago, execute localmente apontando para o banco remoto!**

### Passo 1: Obter DATABASE_URL

#### Se usar Supabase:
1. Acesse: https://app.supabase.com
2. Abra seu projeto
3. Vá em **Settings** → **Database**
4. Em **Connection string**, selecione **"URI"**
5. Copie a URL (formato: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
6. **Substitua `[YOUR-PASSWORD]` pela senha real**

#### Se usar Render PostgreSQL:
1. Acesse: https://dashboard.render.com
2. Abra seu banco de dados PostgreSQL
3. Vá em **"Connections"**
4. Copie a **"External Database URL"**

### Passo 2: Configurar DATABASE_URL Localmente

#### Windows (PowerShell):
```powershell
$env:DATABASE_URL="postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres"
```

#### Linux/Mac:
```bash
export DATABASE_URL="postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres"
```

### Passo 3: Executar db:push

Na pasta do projeto, execute:

```bash
npm run db:push
```

### Passo 4: Verificar Resultado

Você deve ver mensagens como:

```
✓ Tables created successfully
✓ Migration completed
```

### Passo 5: Verificar no Banco de Dados

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

### Passo 6: Testar Cadastro

1. **Acesse sua aplicação:**
   - Vá em: `https://seu-app.onrender.com`

2. **Fazer cadastro:**
   - Clique em "Criar conta"
   - Preencha os dados
   - Clique em "Quero ser Mindly"

3. **Verificar no banco:**
   - Volte no Supabase
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

**Solução:** Execute `npm run db:push` localmente (veja Passo 3)

### Erro: "password authentication failed"

**Solução:** Verifique se a senha no DATABASE_URL está correta

### Erro: "connect ECONNREFUSED"

**Solução:** 
1. Verifique se o DATABASE_URL está correto
2. Se usar Supabase, use a **"URI"** (não a "Connection pooling")
3. Se usar Render, use a **"External Database URL"**

### Tabelas não aparecem

**Solução:**
1. Verifique se `npm run db:push` foi executado com sucesso
2. Verifique os logs para erros
3. Tente executar novamente: `npm run db:push`

## 📝 Comandos Úteis

### Verificar se DATABASE_URL está configurado:

```bash
# Windows (PowerShell)
echo $env:DATABASE_URL

# Linux/Mac
echo $DATABASE_URL
```

### Ver todas as tabelas no Supabase:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## ✅ Checklist

- [ ] DATABASE_URL copiado do Supabase/Render
- [ ] Senha substituída corretamente
- [ ] DATABASE_URL configurado localmente
- [ ] `npm run db:push` executado
- [ ] Mensagem de sucesso apareceu
- [ ] Tabelas verificadas no banco (Supabase)
- [ ] Teste de cadastro feito
- [ ] Usuário aparece na tabela `users`

## 🎯 Após Criar as Tabelas

1. **Teste fazer um cadastro**
2. **Verifique se o usuário aparece no banco**
3. **Verifique os logs do servidor**
4. **Tente fazer login novamente**

---

**📝 Veja o guia completo em: `CRIAR_TABELAS_LOCAL.md`**

**Após executar `npm run db:push` localmente, o cadastro deve funcionar perfeitamente!** ✅
