import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5605-2404-8000-1024-4b21-7b21-bbe0-3e8c-715f.ngrok-free.app',
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
      }
    }
  }
})

