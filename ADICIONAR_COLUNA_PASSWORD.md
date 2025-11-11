# 🔧 Adicionar Coluna Password no Banco

## ❌ Erro

```
error: column "password" does not exist
```

## ✅ Solução: Executar db:push

O campo `password` foi adicionado no schema, mas **não existe no banco ainda**. Você precisa executar `npm run db:push` para adicionar a coluna.

### Passo a Passo

#### 1️⃣ Configurar DATABASE_URL

No PowerShell, execute:

```powershell
$env:DATABASE_URL="postgresql://mindly_user:JRjyGmHnoE81rxeed1jBV5ZXcxhyc9aI@dpg-d47q51ndiees739i5lh0-a.oregon-postgres.render.com/mindly?sslmode=require"
```

#### 2️⃣ Executar db:push

```powershell
npm run db:push
```

#### 3️⃣ Verificar

Você deve ver mensagens como:

```
✓ Column "password" added to table "users"
✓ Migration completed
```

Ou algo similar indicando que a coluna foi adicionada.

### 4️⃣ Verificar no Banco

Execute o script de verificação:

```powershell
node check-tables.js
```

Ou verifique diretamente no Render PostgreSQL se a coluna `password` existe na tabela `users`.

## 🔍 Verificar se Funcionou

### No Render PostgreSQL:

1. Acesse: https://dashboard.render.com
2. Abra seu banco PostgreSQL
3. Use o **"Postgres GUI"** ou **"psql"** para verificar:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   ```
4. Você deve ver a coluna `password` na lista!

## 🆘 Se Ainda Der Erro

### Erro: "column password already exists"

**Solução:** A coluna já existe! Tudo certo! ✅

### Erro: "relation users does not exist"

**Solução:** Execute `npm run db:push` novamente

### Erro: "ECONNRESET"

**Solução:** Verifique se a URL está correta e se tem `?sslmode=require`

## ✅ Checklist

- [ ] DATABASE_URL configurado com `?sslmode=require`
- [ ] `npm run db:push` executado
- [ ] Mensagem de sucesso apareceu
- [ ] Coluna `password` verificada no banco
- [ ] Servidor reiniciado (deploy automático no Render)
- [ ] Login testado

## 🎯 Após Adicionar a Coluna

1. **Aguarde o deploy automático** no Render (já está em andamento)
2. **Teste fazer um cadastro** - a senha será salva no banco
3. **Teste fazer login** - deve funcionar!

---

**Execute `npm run db:push` e o problema será resolvido!** ✅

