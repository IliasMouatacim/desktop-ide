"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  // File System Operations
  readDirectory: (dirPath) => ipcRenderer.invoke("fs:readDirectory", dirPath),
  readFile: (filePath) => ipcRenderer.invoke("fs:readFile", filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke("fs:writeFile", filePath, content),
  deleteFile: (filePath) => ipcRenderer.invoke("fs:deleteFile", filePath),
  createDirectory: (dirPath) => ipcRenderer.invoke("fs:createDirectory", dirPath),
  // Native Dialogs
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  // Platform Info
  platform: process.platform,
  isElectron: true
});
