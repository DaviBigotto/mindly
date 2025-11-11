# 🔧 Corrigir Erro: "vite: not found" no Render

## ❌ Problema

Erro durante o build no Render:
```
sh: 1: vite: not found
```

## 🔍 Causa

O `vite` e `esbuild` estão em `devDependencies`, e o Render pode não instalá-los durante o build em produção.

## ✅ Solução

### Opção 1: Atualizar Build Command no Render (Recomendado)

No painel do Render, no Web Service:

1. Vá em **"Settings"** → **"Build & Deploy"**
2. Altere o **Build Command** para:
   ```
   npm install --production=false && npm run build
   ```
3. Clique em **"Save Changes"**
4. Faça um novo deploy

### Opção 2: Usar npm ci (Alternativa)

Se a Opção 1 não funcionar, tente:
```
npm ci --production=false && npm run build
```

### Opção 3: Mover para dependencies (Não recomendado)

Como última opção, você pode mover `vite` e `esbuild` para `dependencies`, mas isso aumenta o tamanho da aplicação em produção.

## 📝 Explicação

O problema ocorre porque o Render define `NODE_ENV=production` por padrão, o que faz o `npm install` instalar apenas as `dependencies`, ignorando as `devDependencies`. 

**Soluções:**
1. **Definir `NODE_ENV=development` durante o install:** Isso força o npm a instalar todas as dependências, incluindo `devDependencies`.
2. **Usar `--production=false`:** Flag explícita para instalar devDependencies mesmo em produção.

Isso é necessário porque `vite` e `esbuild` estão em `devDependencies` mas são essenciais para o build.

## ✅ Verificação

Após atualizar o Build Command:
1. Faça um novo deploy
2. Verifique os logs do build
3. Você deve ver:
   ```
   ✓ vite build completed
   ✓ esbuild completed
   ```

## 🆘 Ainda com Problemas?

Se ainda não funcionar:
1. Verifique se o `package.json` está correto
2. Verifique os logs completos do build
3. Tente limpar o cache do Render (Settings → Clear Build Cache)

---

**Build Command Correto (Opção 1 - Recomendado):**
```
NODE_ENV=development npm install && npm run build
```

**Build Command Correto (Opção 2 - Alternativa):**
```
npm install --production=false && npm run build
```

