const { contextBridge: o, ipcRenderer: r } = require("electron");
o.exposeInMainWorld("electronAPI", {
  // File System Operations
  readDirectory: (e) => r.invoke("fs:readDirectory", e),
  readFile: (e) => r.invoke("fs:readFile", e),
  writeFile: (e, i) => r.invoke("fs:writeFile", e, i),
  deleteFile: (e) => r.invoke("fs:deleteFile", e),
  createDirectory: (e) => r.invoke("fs:createDirectory", e),
  // Native Dialogs
  openFolder: () => r.invoke("dialog:openFolder"),
  openFile: () => r.invoke("dialog:openFile"),
  // Platform Info
  platform: process.platform,
  isElectron: !0
});
