import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Exemplo de rota simples:
app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do Express na Vercel!" });
});

// Se precisar servir o build do frontend:
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
