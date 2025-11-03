import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/Rural-Entrepreneurship-Platform/", // ✅ GitHub Pages base path
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    host: true
  }
})
