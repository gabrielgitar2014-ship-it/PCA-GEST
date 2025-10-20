// A:/Projeto PCA/pca-ges-site-novo/vite.config.ts

import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Garanta que está instalado
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Inclui o plugin Tailwind
  ],
  // NÃO precisa mais da opção 'root', pois o padrão é a raiz do projeto
  resolve: {
    alias: {
      // ✅ Alias '@' agora aponta diretamente para a pasta 'src' na raiz
      "@": path.resolve(__dirname, "./src"), 
    },
  },
  // NÃO precisa de 'envDir' explícito se o .env está na raiz (padrão do Vite)
  build: {
    // O outDir padrão 'dist' na raiz é o correto para Vercel
    outDir: "dist", 
    emptyOutDir: true,
  },
  server: {
    port: 3000, 
    host: true, 
  },
});