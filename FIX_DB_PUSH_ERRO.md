# 🔧 Corrigir Erro ECONNRESET no db:push

## ❌ Problema

Erro `ECONNRESET` ao executar `npm run db:push` com Render PostgreSQL:

```
Error: read ECONNRESET
code: 'ECONNRESET'
```

## ✅ Solução

O Render PostgreSQL **requer SSL** para conexões externas. Adicione `?sslmode=require` na URL.

### Opção 1: Adicionar SSL na URL (Recomendado)

No PowerShell, configure o DATABASE_URL com SSL:

```powershell
$env:DATABASE_URL="postgresql://mindly_user:JRjyGmHnoE81rxeed1jBV5ZXcxhyc9aI@dpg-d47q51ndiees739i5lh0-a.oregon-postgres.render.com/mindly?sslmode=require"
```

**⚠️ IMPORTANTE:** Adicione `?sslmode=require` no final da URL!

### Opção 2: Usar Supabase (Mais Fácil)

O Supabase é mais fácil para conexões externas e **100% gratuito**:

1. **Criar projeto no Supabase:**
   - Acesse: https://app.supabase.com
   - Crie um novo projeto
   - Aguarde a criação (2-3 minutos)

2. **Copiar Connection String:**
   - Settings → Database → Connection string → URI
   - Copie a URL (formato: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
   - **Substitua `[YOUR-PASSWORD]` pela senha real**

3. **Configurar DATABASE_URL:**
   ```powershell
   $env:DATABASE_URL="postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres"
   ```

4. **Atualizar no Render:**
   - Vá em Environment no Render
   - Atualize `DATABASE_URL` com a URL do Supabase
   - Faça um novo deploy

5. **Executar db:push:**
   ```powershell
   npm run db:push
   ```

## 🔍 Verificar se Funcionou

Após executar `npm run db:push`, você deve ver:

```
✓ Tables created successfully
✓ Migration completed
```

## 🆘 Ainda com Erro?

### Erro: "password authentication failed"

**Solução:** Verifique se a senha está correta na URL

### Erro: "connect ECONNREFUSED"

**Solução:** 
- Verifique se a URL está correta
- Verifique se o banco está acessível
- Tente usar Supabase (mais fácil)

### Erro: "SSL connection required"

**Solução:** Adicione `?sslmode=require` na URL

## ✅ Checklist

- [ ] DATABASE_URL configurado com `?sslmode=require` (Render) ou URL do Supabase
- [ ] Senha correta na URL
- [ ] `npm run db:push` executado
- [ ] Mensagem de sucesso apareceu
- [ ] Tabelas verificadas no banco

## 🎯 Recomendação

**Use Supabase** - é mais fácil, gratuito e funciona melhor para conexões externas! ✅

---

**Após corrigir a URL com SSL, o `npm run db:push` deve funcionar!** 🎉

