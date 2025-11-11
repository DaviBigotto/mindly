# 🔍 Verificar se o Banco de Dados está Funcionando

## ❌ Problema

As informações de cadastro não estão sendo salvas no banco de dados.

## 🔍 Possíveis Causas

1. **Tabelas não foram criadas** - `npm run db:push` não foi executado
2. **DATABASE_URL incorreto** - Variável de ambiente não configurada
3. **Conexão com banco falhando** - Erro de conexão não está sendo logado
4. **Erro ao salvar usuário** - Erro silencioso no código

## ✅ Solução Passo a Passo

### Passo 1: Verificar se as Tabelas Existem

No Render, abra o **Shell** e execute:

```bash
npm run db:push
```

Isso deve criar todas as tabelas necessárias:
- `users`
- `journal_entries`
- `meditation_categories`
- `meditation_sessions`
- `meditation_history`
- `focus_sessions`
- `pro_tracks`
- `track_steps`
- `user_track_progress`
- `premium_sounds`
- `kiwify_webhook_logs`
- `sessions`

### Passo 2: Verificar DATABASE_URL

No Render, vá em **Environment** e verifique:

1. **DATABASE_URL** está configurado?
2. Se usar Supabase, a URL está correta?
3. A senha foi substituída corretamente?

**Formato esperado:**
```
postgresql://postgres:SENHA@db.xxx.supabase.co:5432/postgres
```

### Passo 3: Verificar Logs do Servidor

No Render, vá em **Logs** e procure por:

1. **Erros de conexão:**
   ```
   Error: connect ECONNREFUSED
   Error: password authentication failed
   ```

2. **Erros ao criar usuário:**
   ```
   Error: relation "users" does not exist
   Error: duplicate key value violates unique constraint
   ```

3. **Mensagens de sucesso:**
   ```
   User created successfully
   User updated successfully
   ```

### Passo 4: Testar Conexão com Banco

No Shell do Render, execute:

```bash
# Verificar se DATABASE_URL está configurado
echo $DATABASE_URL

# Testar conexão (se tiver psql instalado)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### Passo 5: Verificar se Usuários Estão Sendo Criados

No Supabase (ou banco de dados), verifique:

1. Acesse o **Table Editor**
2. Vá na tabela `users`
3. Veja se há usuários cadastrados
4. Se não houver, as tabelas podem não ter sido criadas

## 🔧 Comandos Úteis

### Criar Tabelas no Banco

```bash
# No Shell do Render
npm run db:push
```

### Verificar Tabelas Existentes

```bash
# No Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Verificar Usuários

```bash
# No Supabase SQL Editor
SELECT * FROM users;
```

## 🆘 Troubleshooting

### Erro: "relation users does not exist"

**Solução:** Execute `npm run db:push` no Shell do Render

### Erro: "password authentication failed"

**Solução:** Verifique se a senha no DATABASE_URL está correta

### Erro: "connect ECONNREFUSED"

**Solução:** Verifique se o DATABASE_URL está correto e se o banco está acessível

### Usuários não aparecem no banco

**Possíveis causas:**
1. Tabelas não foram criadas
2. Erro ao salvar (verificar logs)
3. Frontend não está enviando dados corretamente

## 📝 Checklist

- [ ] DATABASE_URL configurado no Render
- [ ] `npm run db:push` executado
- [ ] Tabelas criadas no banco
- [ ] Logs verificados (sem erros)
- [ ] Teste de cadastro feito
- [ ] Usuário aparece no banco de dados

## 🎯 Próximos Passos

1. **Execute `npm run db:push` no Shell do Render**
2. **Verifique os logs do servidor**
3. **Teste fazer um cadastro**
4. **Verifique se o usuário aparece no banco**

---

**Após executar `npm run db:push`, o cadastro deve funcionar!** ✅

