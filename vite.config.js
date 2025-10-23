// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Módulo do Node.js para lidar com caminhos

export default defineConfig({
  plugins: [
    react(),      // Plugin essencial para suporte ao React (como Fast Refresh)
    tailwindcss(), // Plugin para a integração moderna e simplificada com o Tailwind CSS v4
  ],
  resolve: {
    alias: {
      // Alias para facilitar os imports: '@/' aponta diretamente para a pasta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})