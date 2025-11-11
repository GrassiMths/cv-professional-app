const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Menu actions
  onMenuNewCV: (callback) => ipcRenderer.on("menu-new-cv", callback),
  onMenuExportPDF: (callback) => ipcRenderer.on("menu-export-pdf", callback),

  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),

  // Platform
  platform: process.platform,

  // App events
  onAppClose: (callback) => ipcRenderer.on("app-close", callback),
});
