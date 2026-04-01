const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure bridge between the React frontend and the native Node.js backend.
// The renderer (React) can call these methods without having direct access to Node.js APIs.
contextBridge.exposeInMainWorld('electronAPI', {
  // File System Operations
  readDirectory: (dirPath) => ipcRenderer.invoke('fs:readDirectory', dirPath),
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),
  deleteFile: (filePath) => ipcRenderer.invoke('fs:deleteFile', filePath),
  createDirectory: (dirPath) => ipcRenderer.invoke('fs:createDirectory', dirPath),

  // Native Dialogs
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  // Platform Info
  platform: process.platform,
  isElectron: true
});
