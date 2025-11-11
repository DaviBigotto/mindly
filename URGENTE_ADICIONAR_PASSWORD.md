# ⚠️ URGENTE: Adicionar Coluna Password no Banco

## ❌ Erro Atual

```
error: column "password" does not exist
```

## ✅ Solução Imediata

Execute `npm run db:push` para adicionar a coluna `password` na tabela `users`.

### Passo 1: Configurar DATABASE_URL

No PowerShell, execute:

```powershell
$env:DATABASE_URL="postgresql://mindly_user:JRjyGmHnoE81rxeed1jBV5ZXcxhyc9aI@dpg-d47q51ndiees739i5lh0-a.oregon-postgres.render.com/mindly?sslmode=require"
```

### Passo 2: Executar db:push

```powershell
npm run db:push
```

### Passo 3: Verificar

Você deve ver mensagens como:

```
✓ Column "password" added to table "users"
✓ Migration completed
```

## 🔍 Verificar se Funcionou

Execute o script de verificação:

```powershell
node check-tables.js
```

Ou verifique diretamente no banco se a coluna existe.

## 🎯 Após Adicionar a Coluna

1. O servidor no Render vai reiniciar automaticamente
2. O erro vai desaparecer
3. O login vai funcionar!

---

**Execute `npm run db:push` AGORA para resolver o erro!** ⚡

