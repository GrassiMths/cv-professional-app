const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

console.log("🚀 Iniciando build do CV Professional...");

async function buildApp() {
  try {
    // 1. Build do frontend
    console.log("📦 Building frontend...");
    execSync("npm run build", {
      cwd: path.join(__dirname, "../frontend"),
      stdio: "inherit",
    });

    // 2. Verificar se build foi bem sucedido
    const distPath = path.join(__dirname, "../frontend/dist");
    if (!fs.existsSync(distPath)) {
      throw new Error("Build do frontend falhou - pasta dist não encontrada");
    }

    console.log("✅ Frontend buildado com sucesso!");

    // 3. Build do Electron
    console.log("🔨 Building Electron app...");
    execSync("npx electron-builder", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });

    console.log("🎉 Build concluído com sucesso!");
    console.log("📦 App disponível em: dist-electron/");

    // Mostrar arquivos gerados
    const distElectronPath = path.join(__dirname, "../dist-electron");
    if (fs.existsSync(distElectronPath)) {
      const files = fs.readdirSync(distElectronPath);
      console.log("\n📁 Arquivos gerados:");
      files.forEach((file) => {
        console.log(`   📄 ${file}`);
      });
    }
  } catch (error) {
    console.error("❌ Erro no build:", error.message);
    process.exit(1);
  }
}

buildApp();
