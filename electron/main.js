const { app, BrowserWindow, dialog } = require("electron");
const { fork } = require("child_process");
const path = require("path");
const fs = require("fs");
const net = require("net");
const http = require("http");

let mainWindow;
let splashWindow;
let httpServer;
let serverProcess;
const isDev = !app.isPackaged;

// ─── Database Setup ──────────────────────────────────────────────
function ensureDatabase() {
  let dbPath;

  if (isDev) {
    dbPath = path.join(process.cwd(), "prisma", "dev.db");
  } else {
    const userDataDir = path.join(
      process.env.APPDATA || path.join(require("os").homedir(), "AppData", "Roaming"),
      "CityShopCentre"
    );
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }
    dbPath = path.join(userDataDir, "dev.db");

    if (!fs.existsSync(dbPath)) {
      const bundledDb = path.join(process.resourcesPath, "prisma", "dev.db");
      if (fs.existsSync(bundledDb)) {
        fs.copyFileSync(bundledDb, dbPath);
        console.log("[DB] Copied bundled database to:", dbPath);
      }
    }
  }

  process.env.DATABASE_URL = `file:${dbPath}`;
  console.log("[DB] Using:", dbPath);
}

// ─── Port Detection ──────────────────────────────────────────────
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// ─── Splash Screen ───────────────────────────────────────────────
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: { nodeIntegration: false },
  });

  const html = `<html><head><style>
    body { margin:0; display:flex; align-items:center; justify-content:center;
      height:100vh; background:linear-gradient(135deg,#4f46e5,#7c3aed);
      font-family:'Segoe UI',sans-serif; color:white; flex-direction:column;
      border-radius:16px; overflow:hidden; }
    h1 { font-size:28px; font-weight:800; margin-bottom:8px; letter-spacing:1px; }
    p { font-size:14px; opacity:0.8; margin-bottom:24px; }
    .loader { width:40px; height:40px; border:4px solid rgba(255,255,255,0.3);
      border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
  </style></head><body>
    <h1>CITY SHOP CENTRE</h1><p>Starting application...</p><div class="loader"></div>
  </body></html>`;

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
}

// ─── Start Next.js IN-PROCESS (no spawn, no fork, no shell) ─────
function startServer(port) {
  return new Promise((resolve, reject) => {
    const serverPath = isDev
      ? path.join(process.cwd(), ".next", "standalone", "server.js")
      : path.join(process.resourcesPath, "app", ".next", "standalone", "server.js");

    console.log("[Electron] Starting server at:", serverPath);

    if (!fs.existsSync(serverPath)) {
      if (isDev) {
        return reject(new Error("Standalone server not found. Please run 'npm run build' first to generate the .next/standalone directory."));
      }
      return reject(new Error(`Server not found at ${serverPath}`));
    }

    serverProcess = fork(serverPath, [], {
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: port.toString(),
      },
      stdio: "inherit",
    });

    serverProcess.on("error", (err) => {
      console.error("[Electron] Server process error:", err);
      reject(err);
    });

    // Check if server is ready
    const checkServer = () => {
      http.get(`http://localhost:${port}`, (res) => {
        console.log(`[Electron] Server ready on http://localhost:${port}`);
        resolve(port);
      }).on("error", () => {
        setTimeout(checkServer, 200);
      });
    };

    checkServer();
  });
}

// ─── Main Window ─────────────────────────────────────────────────
function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 768,
    minHeight: 600,
    show: false,
    title: "City Shop Centre",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`http://localhost:${port}`);

  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.destroy();
      splashWindow = null;
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ─── App Lifecycle ───────────────────────────────────────────────
app.whenReady().then(async () => {
  try {
    createSplashWindow();
    ensureDatabase();

    const port = await findAvailablePort(3000);
    console.log("[Electron] Using port:", port);

    await startServer(port);
    createWindow(port);
  } catch (err) {
    console.error("[Electron] Startup error:", err);
    dialog.showErrorBox(
      "City Shop Centre — Startup Error",
      `The application failed to start.\n\n${err.message}\n\nPlease try restarting.`
    );
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (httpServer) httpServer.close();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (serverProcess) serverProcess.kill();
  if (httpServer) httpServer.close();
});
