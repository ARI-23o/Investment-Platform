import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, "database");

function ensureDbFile(filename, defaultContent = "[]") {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const filePath = path.join(DB_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, "utf8");
  }
  return filePath;
}

const enquiriesFile = ensureDbFile("enquiries.json", "[]");
const usersFile = ensureDbFile("users.json", "[]");
const settingsFile = ensureDbFile("settings.json", "{}");

function readJson(file) {
  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data || "[]");
  } catch (e) {
    return [];
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

export function apiMiddlewarePlugin() {
  return {
    name: "gsp-api-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // Enable CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.writeHead(204);
          res.end();
          return;
        }

        // 1. Enquiries API
        if (pathname === "/api/enquiries") {
          if (req.method === "GET") {
            const list = readJson(enquiriesFile);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(list));
            return;
          }

          if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk; });
            req.on("end", async () => {
              try {
                const newEnquiry = JSON.parse(body);
                if (!newEnquiry.id) newEnquiry.id = "ENQ-" + Date.now();
                if (!newEnquiry.time) newEnquiry.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                const list = readJson(enquiriesFile);
                list.unshift(newEnquiry);
                writeJson(enquiriesFile, list);

                // Auto forward to Google Sheet if configured
                try {
                  const settings = readJson(settingsFile);
                  if (settings.googleSheetWebhook) {
                    const formData = new URLSearchParams();
                    formData.append("timestamp", new Date().toLocaleString());
                    formData.append("type", newEnquiry.type || "Enquiry");
                    formData.append("share", newEnquiry.title || newEnquiry.share || "");
                    formData.append("quantity", newEnquiry.quantity || "");
                    formData.append("fullName", newEnquiry.fullName || newEnquiry.name || "");
                    formData.append("mobile", newEnquiry.mobile || "");
                    formData.append("email", newEnquiry.email || "");
                    formData.append("service", newEnquiry.service || "");
                    formData.append("message", newEnquiry.message || "");
                    formData.append("pan", newEnquiry.pan || "");

                    fetch(settings.googleSheetWebhook, {
                      method: "POST",
                      body: formData.toString(),
                      headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    }).catch(err => console.error("Google sync error:", err));
                  }
                } catch (e) {
                  console.error(e);
                }

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, enquiry: newEnquiry }));
              } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
              }
            });
            return;
          }

          if (req.method === "DELETE") {
            const id = url.searchParams.get("id");
            if (!id || id === "all") {
              writeJson(enquiriesFile, []);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true, message: "Cleared all" }));
            } else {
              let list = readJson(enquiriesFile);
              list = list.filter(item => item.id !== id);
              writeJson(enquiriesFile, list);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true, message: "Deleted item" }));
            }
            return;
          }
        }

        // 2. Users / Registration API
        if (pathname === "/api/users") {
          if (req.method === "GET") {
            const users = readJson(usersFile);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users));
            return;
          }

          if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk; });
            req.on("end", () => {
              try {
                const newUser = JSON.parse(body);
                if (!newUser.id) newUser.id = "USR-" + Date.now();
                const users = readJson(usersFile);
                users.push(newUser);
                writeJson(usersFile, users);

                // Also record Demat account enquiry
                const enquiriesList = readJson(enquiriesFile);
                enquiriesList.unshift({
                  id: "ACC-" + Date.now(),
                  type: "account",
                  title: "Demat & Trading Account Opening",
                  fullName: newUser.name,
                  mobile: newUser.mobile,
                  pan: newUser.pan,
                  email: newUser.email,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  status: "Approved"
                });
                writeJson(enquiriesFile, enquiriesList);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, user: newUser }));
              } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid user data" }));
              }
            });
            return;
          }
        }

        // 3. Settings API (Google Sheet Webhook)
        if (pathname === "/api/settings") {
          if (req.method === "GET") {
            const settings = readJson(settingsFile);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(settings));
            return;
          }

          if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk; });
            req.on("end", () => {
              try {
                const newSettings = JSON.parse(body);
                writeJson(settingsFile, newSettings);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, settings: newSettings }));
              } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid settings" }));
              }
            });
            return;
          }
        }

        next();
      });
    }
  };
}
