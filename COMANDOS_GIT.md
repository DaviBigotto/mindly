# 🚀 Comandos Git - Subir para o GitHub

## ✅ Status Atual

Seu repositório Git já está inicializado! Agora é só fazer commit e push.

## 📋 Comandos (Execute no PowerShell)

### 1. Adicionar todos os arquivos (exceto os ignorados)
```powershell
git add .
```

### 2. Fazer commit
```powershell
git commit -m "Initial commit - Mindly App"
```

### 3. Criar repositório no GitHub
1. Acesse: https://github.com/new
2. Nome: `mindly-app` (ou outro)
3. **NÃO marque** "Initialize with README"
4. Clique em "Create repository"

### 4. Conectar ao GitHub
```powershell
# Substitua SEU_USUARIO pelo seu usuário
git remote add origin https://github.com/SEU_USUARIO/mindly-app.git
```

### 5. Enviar para o GitHub
```powershell
git branch -M main
git push -u origin main
```

## ⚠️ Se pedir senha

Use um **Personal Access Token** (não sua senha):
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Marque a opção `repo`
4. Copie o token e use como senha

## ✅ Verificar

Após o push, acesse seu repositório no GitHub. Você deve ver:
- ✅ Arquivos de código (`.ts`, `.tsx`, `.json`)
- ✅ Pastas `server/`, `client/`, `shared/`
- ❌ **NÃO deve aparecer** `node_modules/`, `dist/`, `.env`

## 🎯 Pronto!

Agora você pode conectar ao Render e fazer o deploy!

