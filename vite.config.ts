import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://freebirdsbackend-v1.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
