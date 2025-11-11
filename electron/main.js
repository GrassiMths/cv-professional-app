const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const isDev = process.argv.includes("--dev");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../assets/icon.png"),
    show: false,
    titleBarStyle: "default",
  });

  // Carregar o aplicativo
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }

  // Mostrar quando pronto
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (!isDev) {
      startBackendServer();
    }
  });

  createApplicationMenu();
}

function startBackendServer() {
  console.log("🚀 Iniciando servidor backend...");

  backendProcess = spawn("node", ["server-electron.js"], {
    cwd: path.join(__dirname, "../backend"),
    stdio: ["pipe", "pipe", "pipe"],
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on("error", (err) => {
    console.error("❌ Erro ao iniciar backend:", err);
    dialog.showErrorBox("Erro", "Não foi possível iniciar o servidor backend.");
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend finalizado com código: ${code}`);
  });
}

function createApplicationMenu() {
  const template = [
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Novo Currículo",
          accelerator: "Ctrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-cv");
          },
        },
        {
          label: "Exportar PDF",
          accelerator: "Ctrl+E",
          click: () => {
            mainWindow.webContents.send("menu-export-pdf");
          },
        },
        { type: "separator" },
        {
          label: "Sair",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Editar",
      submenu: [
        { role: "undo", label: "Desfazer" },
        { role: "redo", label: "Refazer" },
        { type: "separator" },
        { role: "cut", label: "Recortar" },
        { role: "copy", label: "Copiar" },
        { role: "paste", label: "Colar" },
      ],
    },
    {
      label: "Visualizar",
      submenu: [
        { role: "reload", label: "Recarregar" },
        { role: "forceReload", label: "Forçar Recarregamento" },
        { role: "toggleDevTools", label: "Ferramentas de Desenvolvimento" },
        { type: "separator" },
        { role: "resetZoom", label: "Zoom Normal" },
        { role: "zoomIn", label: "Aumentar Zoom" },
        { role: "zoomOut", label: "Diminuir Zoom" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Tela Cheia" },
      ],
    },
    {
      label: "Ajuda",
      submenu: [
        {
          label: "Sobre",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "Sobre CV Professional",
              message: "CV Professional",
              detail: `Versão: 2.3.0\nDesenvolvido por: Matheus Grassi\n\nSistema profissional para criação de currículos.\nTransforme seus dados em um currículo elegante em minutos!`,
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Eventos do aplicativo
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (backendProcess) {
    console.log("🛑 Finalizando servidor backend...");
    backendProcess.kill();
  }
});

// IPC Handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});
