import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_DIR = path.join(__dirname, "database");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const enquiriesFile = path.join(DB_DIR, "enquiries.json");
const usersFile = path.join(DB_DIR, "users.json");
const settingsFile = path.join(DB_DIR, "settings.json");

if (!fs.existsSync(enquiriesFile)) fs.writeFileSync(enquiriesFile, "[]");
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
if (!fs.existsSync(settingsFile)) fs.writeFileSync(settingsFile, "{}");

const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8") || "[]");
const writeJson = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// API Routes
app.get("/api/enquiries", (req, res) => {
  res.json(readJson(enquiriesFile));
});

app.post("/api/enquiries", (req, res) => {
  const enquiry = req.body;
  if (!enquiry.id) enquiry.id = "ENQ-" + Date.now();
  if (!enquiry.time) enquiry.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  const list = readJson(enquiriesFile);
  list.unshift(enquiry);
  writeJson(enquiriesFile, list);
  res.status(201).json({ success: true, enquiry });
});

app.delete("/api/enquiries", (req, res) => {
  const id = req.query.id;
  if (!id || id === "all") {
    writeJson(enquiriesFile, []);
    res.json({ success: true, message: "Cleared all" });
  } else {
    let list = readJson(enquiriesFile);
    list = list.filter(e => e.id !== id);
    writeJson(enquiriesFile, list);
    res.json({ success: true, message: "Deleted" });
  }
});

// Serve frontend build if dist exists
const distDir = path.join(__dirname, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => res.sendFile(path.join(distDir, "index.html")));
}

app.listen(PORT, () => {
  console.log(`GSP Investment Backend API running at http://localhost:${PORT}`);
});
