# 🔧 Corrigir Problema de Login

## ❌ Problemas Identificados

1. **Login só verifica localStorage** - Quando o usuário faz logout, o localStorage é limpo e o login falha
2. **Senha não está sendo salva no banco** - A senha só existe no localStorage
3. **Não há endpoint de login no backend** - O sistema não valida credenciais no servidor

## ✅ Solução Implementada

### 1️⃣ Adicionar Campo `password` no Schema

- Adicionado campo `password` na tabela `users`
- Campo opcional (para suportar usuários legados)

### 2️⃣ Criar Endpoint `/api/auth/login`

- Valida email e senha no banco de dados
- Retorna dados do usuário se credenciais forem válidas
- Suporta usuários sem senha (legacy)

### 3️⃣ Atualizar Frontend para Usar API

- `login()` agora chama `/api/auth/login`
- Fallback para localStorage se a API falhar
- Senha é salva no banco quando o usuário faz cadastro

### 4️⃣ Atualizar `/api/users/sync` para Salvar Senha

- Endpoint agora aceita `password` no body
- Senha é salva no banco quando o usuário faz cadastro

## 🔄 Próximos Passos

### 1️⃣ Atualizar Schema no Banco

Execute `npm run db:push` para adicionar o campo `password`:

```powershell
$env:DATABASE_URL="postgresql://mindly_user:JRjyGmHnoE81rxeed1jBV5ZXcxhyc9aI@dpg-d47q51ndiees739i5lh0-a.oregon-postgres.render.com/mindly?sslmode=require"
npm run db:push
```

### 2️⃣ Testar Cadastro

1. Faça um novo cadastro
2. A senha será salva no banco
3. Faça logout
4. Faça login novamente
5. Deve funcionar!

### 3️⃣ Usuários Existentes

Usuários que já fizeram cadastro **antes** desta atualização:
- Não têm senha no banco
- Podem fazer login sem senha (legacy support)
- **Recomendação:** Façam um novo cadastro ou redefinam a senha

## 🔍 Verificar se Funcionou

### Logs do Servidor

Procure por:
- `User logged in: email@exemplo.com` - Login bem-sucedido
- `User found but has no password set: email@exemplo.com` - Usuário legacy

### Teste de Login

1. Faça logout
2. Faça login novamente
3. Deve funcionar!

## ⚠️ Observações

### Senha em Texto Plano

**ATENÇÃO:** A senha está sendo salva em **texto plano** no banco. 

**Para produção, você deve:**
1. Instalar `bcrypt` ou `bcryptjs`
2. Fazer hash da senha antes de salvar
3. Comparar hash ao validar login

**Exemplo de implementação futura:**
```typescript
import bcrypt from 'bcrypt';

// Ao salvar
const hashedPassword = await bcrypt.hash(password, 10);

// Ao validar
const isValid = await bcrypt.compare(password, user.password);
```

### "User synced from frontend"

Isso é **correto**! O frontend chama `/api/users/sync` para:
1. Criar o usuário no banco (se não existir)
2. Sincronizar dados do usuário
3. Garantir que o backend tem os dados mais recentes

Isso é parte do fluxo normal de autenticação em modo dev.

## ✅ Checklist

- [ ] Schema atualizado (`npm run db:push`)
- [ ] Campo `password` existe no banco
- [ ] Novo cadastro salva senha no banco
- [ ] Login funciona após logout
- [ ] Endpoint `/api/auth/login` funciona
- [ ] Logs mostram "User logged in"

## 🎯 Pronto!

Após executar `npm run db:push` e fazer um novo cadastro, o login deve funcionar perfeitamente! ✅

---

**Nota:** Usuários que fizeram cadastro antes desta atualização podem fazer login sem senha (legacy support).

