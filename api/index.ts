import express from "express";
// ✅ Importa os tipos corretos da Vercel
import type { Request, Response } from "express"; // Tipos do Express para rotas internas
import type { VercelRequest, VercelResponse } from "@vercel/node"; // Tipos da Vercel para o handler
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Exemplo de rota simples:
// ✅ Adiciona tipos do Express a req e res
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Olá do Express na Vercel!" });
});

// Se precisar servir o build do frontend:
// A Vercel geralmente lida com isso através das 'routes' no vercel.json,
// mas se precisar de fallback manual via Express:
// Garante que o caminho para 'client/dist' está correto relativo a 'api/'
const clientDistPath = path.join(__dirname, "../../client/dist"); // Ajustado para subir dois níveis
app.use(express.static(clientDistPath));

// Fallback para index.html (SPA routing)
// ✅ Adiciona tipos do Express a req e res
app.get("*", (req: Request, res: Response) => {
  // Garante que o caminho está correto
  res.sendFile(path.join(clientDistPath, "index.html")); 
});

// Handler principal para a Vercel
// ✅ Adiciona os tipos VercelRequest e VercelResponse
export default function handler(req: VercelRequest, res: VercelResponse) {
  // O express() espera os tipos crus do Node, então podemos converter ou usar 'as any'
  // Usar 'as any' é mais simples neste caso, já que os tipos da Vercel são wrappers.
  return app(req as any, res as any); 
}
