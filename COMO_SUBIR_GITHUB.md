# 📤 Como Subir o Projeto para o GitHub (Passo a Passo)

## ❌ Problema: Limite de 100 Arquivos

Se você tentou fazer upload manual pelo GitHub e recebeu a mensagem:
> "Yowza, that's a lot of files. Try uploading fewer than 100 at a time."

**Isso acontece porque:**
- A pasta `node_modules/` tem MILHARES de arquivos
- Você NÃO precisa subir `node_modules/` (ela será instalada automaticamente)
- O arquivo `.gitignore` já está configurado para ignorar essas pastas

## ✅ Solução: Use Git via Linha de Comando

### Passo 1: Verificar se Git está instalado

Abra o PowerShell (ou Terminal) e execute:
```powershell
git --version
```

Se não estiver instalado, baixe em: https://git-scm.com/downloads

### Passo 2: Navegar até a pasta do projeto

```powershell
cd C:\Users\adria\Downloads\MindlyWebBonus\MindlyWebBonus
```

### Passo 3: Inicializar o Git (se ainda não foi feito)

```powershell
git init
```

### Passo 4: Verificar quais arquivos serão adicionados

```powershell
git status
```

**✅ Você DEVE ver apenas:**
- Arquivos `.ts`, `.tsx`, `.json`, `.md`, `.yaml`, etc.
- Pastas `server/`, `client/`, `shared/`

**❌ Você NÃO DEVE ver:**
- `node_modules/` (deve ser ignorado)
- `dist/` (deve ser ignorado)
- `.env` (deve ser ignorado)

### Passo 5: Adicionar arquivos ao Git

```powershell
git add .
```

### Passo 6: Verificar novamente (importante!)

```powershell
git status
```

**Se ainda aparecer `node_modules/` ou `dist/`:**
```powershell
# Remover do Git (mas manter no disco)
git rm -r --cached node_modules
git rm -r --cached dist

# Adicionar novamente
git add .

# Verificar
git status
```

### Passo 7: Fazer o primeiro commit

```powershell
git commit -m "Initial commit - Mindly App"
```

### Passo 8: Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique no botão **"+"** no canto superior direito
3. Clique em **"New repository"**
4. Preencha:
   - **Repository name**: `mindly-app` (ou outro nome)
   - **Description**: (opcional)
   - **Public** ou **Private** (escolha)
   - **❌ NÃO marque** "Initialize this repository with a README"
   - **❌ NÃO marque** "Add .gitignore"
   - **❌ NÃO marque** "Choose a license"
5. Clique em **"Create repository"**

### Passo 9: Conectar ao repositório do GitHub

```powershell
# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/mindly-app.git

# Exemplo:
# git remote add origin https://github.com/adria/mindly-app.git
```

### Passo 10: Enviar o código para o GitHub

```powershell
# Criar branch main (se necessário)
git branch -M main

# Enviar código
git push -u origin main
```

**Se pedir usuário e senha:**
- **Username**: Seu usuário do GitHub
- **Password**: Use um **Personal Access Token** (não sua senha normal)
  - Como criar: https://github.com/settings/tokens
  - Permissões: `repo` (todas)

## 🔍 Verificar se funcionou

1. Acesse seu repositório no GitHub
2. Você deve ver apenas os arquivos de código
3. **NÃO deve aparecer:**
   - `node_modules/`
   - `dist/`
   - `.env`

## ⚠️ Problemas Comuns

### Erro: "fatal: not a git repository"
**Solução:**
```powershell
git init
```

### Erro: "fatal: remote origin already exists"
**Solução:**
```powershell
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/mindly-app.git
```

### Erro: "fatal: refusing to merge unrelated histories"
**Solução:**
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Erro: "Authentication failed"
**Solução:**
1. Crie um Personal Access Token: https://github.com/settings/tokens
2. Use o token como senha (não sua senha do GitHub)

### Ainda aparecem muitos arquivos
**Solução:** Verifique se o `.gitignore` está na raiz do projeto:
```powershell
# Ver conteúdo do .gitignore
cat .gitignore

# Se node_modules não estiver lá, adicione:
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
```

## 📋 Checklist Final

- [ ] Git instalado
- [ ] Repositório inicializado (`git init`)
- [ ] `.gitignore` verificado (ignora `node_modules/`, `dist/`)
- [ ] `git status` mostra apenas arquivos de código
- [ ] Arquivos adicionados (`git add .`)
- [ ] Commit feito (`git commit`)
- [ ] Repositório criado no GitHub
- [ ] Remote adicionado (`git remote add origin`)
- [ ] Código enviado (`git push`)
- [ ] Verificado no GitHub (sem `node_modules/`)

## 🎯 Após Subir para o GitHub

1. **Conecte ao Render:**
   - Acesse [render.com](https://render.com)
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Siga as instruções do `DEPLOY.md`

## 💡 Dica

**NUNCA faça commit de:**
- ❌ `node_modules/` - Instalado via `npm install`
- ❌ `dist/` - Gerado via `npm run build`
- ❌ `.env` - Variáveis de ambiente (configure no Render)
- ❌ Arquivos temporários
- ❌ Logs

**SEMPRE faça commit de:**
- ✅ Código fonte (`.ts`, `.tsx`, `.js`, `.jsx`)
- ✅ Configurações (`.json`, `.yaml`, `.config.*`)
- ✅ Documentação (`.md`)
- ✅ `package.json` e `package-lock.json`

## 🆘 Precisa de Ajuda?

Se tiver problemas, me avise qual erro está aparecendo!

