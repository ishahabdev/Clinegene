import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname, "dist");

// Load .env into process.env if available
try {
  const envPath = path.resolve(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || "").trim();
      }
    }
  }
} catch (_) {}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// Lazy load API handlers
let contactHandler = null;
let sendEmailHandler = null;

async function getContactHandler() {
  if (!contactHandler) {
    const mod = await import("./api/contact.js");
    contactHandler = mod.default;
  }
  return contactHandler;
}

async function getSendEmailHandler() {
  if (!sendEmailHandler) {
    const mod = await import("./api/send-email.js");
    sendEmailHandler = mod.default;
  }
  return sendEmailHandler;
}

function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
    return res;
  };
}

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);

  const [pathname] = (req.url || "/").split("?");

  // 1. API routes
  if (pathname === "/api/contact" || pathname === "/api/send-email") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      try {
        const rawBody = Buffer.concat(chunks).toString("utf-8");
        req.body = rawBody ? JSON.parse(rawBody) : {};

        if (pathname === "/api/contact") {
          const handler = await getContactHandler();
          return handler(req, res);
        } else {
          const handler = await getSendEmailHandler();
          return handler(req, res);
        }
      } catch (err) {
        console.error(`[API Error ${pathname}]`, err);
        return res.status(500).json({
          error: err.message || "Internal server error",
        });
      }
    });
    return;
  }

  // 2. Static files & SSG from dist
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Sanitize path against directory traversal
  const safeSuffix = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(DIST_DIR, safeSuffix);

  // Check if direct file exists
  let stat = null;
  try {
    if (fs.existsSync(filePath)) {
      stat = fs.statSync(filePath);
    }
  } catch (_) {}

  // If directory, check for index.html inside
  if (stat && stat.isDirectory()) {
    const nestedIndex = path.join(filePath, "index.html");
    if (fs.existsSync(nestedIndex)) {
      filePath = nestedIndex;
      stat = fs.statSync(nestedIndex);
    } else {
      stat = null;
    }
  }

  // If file doesn't exist, check SSG route/index.html (e.g. /about -> /about/index.html)
  if (!stat || !stat.isFile()) {
    const ssgPath = path.join(DIST_DIR, safeSuffix, "index.html");
    if (fs.existsSync(ssgPath)) {
      filePath = ssgPath;
      stat = fs.statSync(ssgPath);
    }
  }

  // SPA Fallback: serve /dist/index.html
  if (!stat || !stat.isFile()) {
    filePath = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(filePath)) {
      stat = fs.statSync(filePath);
    } else {
      return res.status(404).end("Not Found");
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  res.setHeader("Content-Type", contentType);

  // Cache headers
  if (filePath.includes(`${path.sep}assets${path.sep}`) || filePath.includes(`${path.sep}images${path.sep}`)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  }

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`ClinGene Production Server listening on http://localhost:${PORT}`);
});
