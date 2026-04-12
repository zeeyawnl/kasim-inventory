// This script runs as a FORKED Node.js process (not Electron)
// It starts a Next.js HTTP server using the programmatic API
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dir = process.env.APP_DIR || process.cwd();

console.log(`[Server] Starting Next.js from: ${dir}`);
console.log(`[Server] Port: ${port}`);

const app = next({ dev: false, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  server.listen(port, () => {
    console.log(`[Server] Ready on http://localhost:${port}`);
    // Signal parent process (Electron main) that server is ready
    if (process.send) {
      process.send("ready");
    }
  });

  server.on("error", (err) => {
    console.error("[Server] Error:", err);
    process.exit(1);
  });
});
