# 💼 CV Professional - Desktop App

Sistema profissional para criação de currículos elegantes. Transforme seus dados em um currículo profissional em minutos!

---

## 🚀 Características

- ✅ **Interface moderna e intuitiva**
- ✅ **Preview em tempo real**
- ✅ **Exportação para PDF** idêntica ao preview
- ✅ **Modo claro/escuro**
- ✅ **Geolocalização automática**
- ✅ **App desktop** - não precisa de internet
- ✅ **Multiplataforma** (Windows, macOS, Linux)

---

## 📦 Instalação

### 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# Iniciar modo de desenvolvimento
npm run dev
```

### ⚙️ Produção

```bash
# Gerar build do app
npm run build

# Os executáveis estarão em dist-electron/
```

---

## 🎯 Como Usar

1. Preencha suas informações pessoais  
2. Adicione experiências, formação e habilidades  
3. Visualize seu currículo em tempo real  
4. Exporte para PDF com apenas um clique  

---

## 📁 Estrutura do Projeto

```
cv-professional-app/
├── electron/          # App desktop
├── frontend/          # Interface React
├── backend/           # Servidor/API
├── assets/            # Ícones e recursos
└── scripts/           # Scripts de build
```

---

## 🛠 Tecnologias

**Frontend:** React, Vite, TailwindCSS  
**Backend:** Node.js, Express, Puppeteer  
**Desktop:** Electron  
**PDF:** Puppeteer/Chromium  

---

## 👨‍💻 Desenvolvido por

**Matheus Grassi**  
📷 [Instagram](https://instagram.com/) • 💻 [GitHub](https://github.com/)  

> *CV Professional v2.3.0 - Transformando dados em oportunidades!*

---

## 🧹 .gitignore

```
# Dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Build outputs
dist/
dist-electron/
frontend/dist/
backend/dist/

# Environment variables
.env
.env.local

# Logs
.log
npm-debug.log
yarn-debug.log*
yarn-error.log*

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Electron
out/
```

---

## 📦 backend/package.json

```json
{
  "name": "cv-professional-backend",
  "version": "2.3.0",
  "description": "Backend para CV Professional",
  "main": "server-electron.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "electron": "node server-electron.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "cors": "^2.8.5",
    "puppeteer-core": "^19.8.0",
    "dotenv": "^16.0.3"
  }
}
```
