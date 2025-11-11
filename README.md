# 🧾 Currify - Desktop App

Sistema profissional para criação de currículos elegantes.  
Transforme seus dados em um currículo profissional em minutos com o **Currify**!

---

## 🚀 **Características**

- ✅ **Interface moderna e intuitiva**  
- ✅ **Preview em tempo real**  
- ✅ **Exportação para PDF** idêntica ao preview  
- ✅ **Modo claro/escuro**  
- ✅ **Geolocalização automática**  
- ✅ **App desktop** – não precisa de internet  
- ✅ **Multiplataforma** (Windows, macOS, Linux)

---

## 📦 **Instalação**

### 🧩 Desenvolvimento

```bash
# Instalar dependências principais
npm install

# Instalar dependências do frontend
cd frontend && npm install

# Instalar dependências do backend
cd ../backend && npm install

# Voltar para a raiz do projeto
cd ..
🚧 Desenvolvimento Local
bash
Copiar código
npm run dev
🏗️ Produção
bash
Copiar código
# Build do app
npm run build

# Os executáveis estarão em:
dist-electron/
🎯 Como Usar
Preencha suas informações pessoais

Adicione experiências, formação e habilidades

Visualize o resultado em tempo real

Exporte para PDF com um clique

📁 Estrutura do Projeto
bash
Copiar código
currify/
├── electron/          # App desktop (Electron)
├── frontend/          # Interface React (Vite + Tailwind)
├── backend/           # Servidor/API (Node.js + Express)
├── assets/            # Ícones e recursos visuais
└── scripts/           # Scripts de build e automação
🛠️ Tecnologias Utilizadas
Frontend: React, Vite, TailwindCSS

Backend: Node.js, Express, Puppeteer

Desktop: Electron

PDF Renderer: Puppeteer/Chromium

👨‍💻 Desenvolvido por
Matheus Grassi
📸 Instagram • 💻 GitHub

Currify v2.3.0 – Transformando dados em oportunidades!

🧹 .gitignore
bash
Copiar código
# Dependências
node_modules/
frontend/node_modules/
backend/node_modules/

# Builds
dist/
dist-electron/
frontend/dist/
backend/dist/

# Variáveis de ambiente
.env
.env.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Arquivos do sistema
.DS_Store
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Electron
out/
📦 backend/package.json
json
Copiar código
{
  "name": "currify-backend",
  "version": "2.3.0",
  "description": "Backend para Currify",
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
