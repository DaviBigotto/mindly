# 🚀 Como Subir o Projeto para o GitHub

## ❌ NÃO Faça Upload Manual!

O GitHub tem limite de 100 arquivos por upload manual. **Não faça upload pela interface web do GitHub!**

## ✅ Use Git via Linha de Comando

### Passo 1: Verificar se o Git está instalado
```bash
git --version
```

Se não estiver instalado, baixe em: https://git-scm.com/downloads

### Passo 2: Verificar o .gitignore
O arquivo `.gitignore` já está configurado para ignorar:
- `node_modules/` (não precisa subir - são milhares de arquivos)
- `dist/` (arquivos compilados - gerados no build)
- `.env` (variáveis de ambiente - não devem ser commitadas)

### Passo 3: Inicializar o repositório Git
Abra o terminal na pasta do projeto e execute:

```bash
# Navegue até a pasta do projeto
cd MindlyWebBonus

# Inicialize o Git (se ainda não foi feito)
git init

# Verifique o status (veja quais arquivos serão adicionados)
git status
```

### Passo 4: Adicionar arquivos ao Git
```bash
# Adicione todos os arquivos (exceto os ignorados pelo .gitignore)
git add .

# Verifique novamente o status
git status
```

**⚠️ IMPORTANTE:** Você deve ver apenas arquivos de código (`.ts`, `.tsx`, `.json`, `.md`, etc), NÃO deve ver:
- `node_modules/`
- `dist/`
- `.env`

### Passo 5: Fazer o primeiro commit
```bash
git commit -m "Initial commit - Mindly App"
```

### Passo 6: Conectar ao repositório do GitHub
```bash
# Substitua SEU_USUARIO pelo seu usuário do GitHub
# Substitua NOME_DO_REPOSITORIO pelo nome que você quer dar
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# Exemplo:
# git remote add origin https://github.com/adria/mindly-app.git
```

### Passo 7: Criar o repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New" (ou o botão "+" no canto superior direito)
3. Escolha "New repository"
4. Dê um nome (ex: `mindly-app`)
5. **NÃO** marque "Initialize this repository with a README"
6. Clique em "Create repository"

### Passo 8: Enviar o código para o GitHub
```bash
# Envie o código para o GitHub
git push -u origin main

# Se der erro de branch, tente:
git branch -M main
git push -u origin main
```

## 📋 Checklist

- [ ] Git instalado
- [ ] Repositório inicializado (`git init`)
- [ ] `.gitignore` verificado (não inclui `node_modules/`, `dist/`)
- [ ] Arquivos adicionados (`git add .`)
- [ ] Commit feito (`git commit`)
- [ ] Repositório criado no GitHub
- [ ] Remote adicionado (`git remote add origin`)
- [ ] Código enviado (`git push`)

## ⚠️ Problemas Comuns

### Erro: "fatal: not a git repository"
**Solução:** Execute `git init` na pasta do projeto

### Erro: "fatal: remote origin already exists"
**Solução:** 
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
```

### Erro: "fatal: refusing to merge unrelated histories"
**Solução:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Muitos arquivos sendo adicionados (node_modules, dist)
**Solução:** Verifique se o `.gitignore` está correto e execute:
```bash
git rm -r --cached node_modules
git rm -r --cached dist
git add .
git commit -m "Remove node_modules and dist from git"
```

## 🎯 Após Subir para o GitHub

1. **Conecte ao Render:**
   - Acesse [render.com](https://render.com)
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Siga as instruções do `DEPLOY.md`

2. **Configure as variáveis de ambiente no Render**

3. **Configure o banco de dados**

4. **Execute `npm run db:push`**

## 📝 Arquivos que NÃO devem ser commitados

- ❌ `node_modules/` - Dependências (são instaladas via `npm install`)
- ❌ `dist/` - Arquivos compilados (são gerados via `npm run build`)
- ❌ `.env` - Variáveis de ambiente (configure no Render)
- ❌ `*.log` - Logs
- ❌ `.DS_Store` - Arquivos do macOS
- ❌ Arquivos temporários

## ✅ Arquivos que DEVEM ser commitados

- ✅ `package.json` - Dependências do projeto
- ✅ `package-lock.json` - Lock das dependências
- ✅ `server/` - Código do servidor
- ✅ `client/` - Código do cliente
- ✅ `shared/` - Código compartilhado
- ✅ `vite.config.ts` - Configuração do Vite
- ✅ `tsconfig.json` - Configuração do TypeScript
- ✅ `.gitignore` - Arquivos a ignorar
- ✅ `render.yaml` - Configuração do Render (opcional)
- ✅ `DEPLOY.md` - Documentação
- ✅ `README.md` - Documentação

## 🔍 Verificar o que será commitado

Antes de fazer commit, verifique:
```bash
git status
```

Isso mostra todos os arquivos que serão adicionados. Se ver `node_modules/` ou `dist/`, o `.gitignore` não está funcionando corretamente.

