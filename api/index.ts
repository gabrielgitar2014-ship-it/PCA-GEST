import express from "express";
// Importa os tipos da Vercel para o handler principal
import type { VercelRequest, VercelResponse } from "@vercel/node"; 
// Não precisamos mais dos tipos específicos do Express aqui
// import type { Request, Response } from "express"; 
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Exemplo de rota simples:
// ✅ Usa 'any' para req e res aqui para evitar conflitos de tipo internos
app.get("/api/hello", (req: any, res: any) => { 
  res.json({ message: "Olá do Express na Vercel!" });
});

// Servir o build do frontend:
const clientDistPath = path.join(__dirname, "../../client/dist"); // Caminho ajustado
app.use(express.static(clientDistPath));

// Fallback para index.html (SPA routing)
// ✅ Usa 'any' para req e res aqui
app.get("*", (req: any, res: any) => { 
  res.sendFile(path.join(clientDistPath, "index.html")); 
});

// Handler principal para a Vercel (mantém os tipos corretos da Vercel)
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Passa req e res para a instância do Express
  return app(req as any, res as any); 
}
