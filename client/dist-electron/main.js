const { app: s, BrowserWindow: c, ipcMain: i, dialog: d } = require("electron"), l = require("path"), a = require("fs");
require("electron-squirrel-startup") && s.quit();
let t;
function u() {
  t = new c({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: "Cloud IDE",
    icon: l.join(__dirname, "../public/vite.svg"),
    backgroundColor: "#1e1e2e",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#181825",
      symbolColor: "#cdd6f4",
      height: 36
    },
    webPreferences: {
      preload: l.join(__dirname, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !1
    }
  }), process.env.VITE_DEV_SERVER_URL ? (t.loadURL(process.env.VITE_DEV_SERVER_URL), t.webContents.openDevTools()) : t.loadFile(l.join(__dirname, "../dist/index.html")), t.on("closed", () => {
    t = null;
  });
}
i.handle("fs:readDirectory", async (e, r) => {
  try {
    return a.readdirSync(r, { withFileTypes: !0 }).map((o) => ({
      name: o.name,
      isDirectory: o.isDirectory(),
      path: l.join(r, o.name)
    }));
  } catch (n) {
    return { error: n.message };
  }
});
i.handle("fs:readFile", async (e, r) => {
  try {
    return a.readFileSync(r, "utf-8");
  } catch (n) {
    return { error: n.message };
  }
});
i.handle("fs:writeFile", async (e, r, n) => {
  try {
    return a.writeFileSync(r, n, "utf-8"), { success: !0 };
  } catch (o) {
    return { error: o.message };
  }
});
i.handle("fs:deleteFile", async (e, r) => {
  try {
    return a.unlinkSync(r), { success: !0 };
  } catch (n) {
    return { error: n.message };
  }
});
i.handle("fs:createDirectory", async (e, r) => {
  try {
    return a.mkdirSync(r, { recursive: !0 }), { success: !0 };
  } catch (n) {
    return { error: n.message };
  }
});
i.handle("dialog:openFolder", async () => {
  const e = await d.showOpenDialog(t, {
    properties: ["openDirectory"]
  });
  return e.canceled ? null : e.filePaths[0];
});
i.handle("dialog:openFile", async () => {
  const e = await d.showOpenDialog(t, {
    properties: ["openFile"]
  });
  return e.canceled ? null : e.filePaths[0];
});
s.whenReady().then(u);
s.on("window-all-closed", () => {
  process.platform !== "darwin" && s.quit();
});
s.on("activate", () => {
  c.getAllWindows().length === 0 && u();
});
