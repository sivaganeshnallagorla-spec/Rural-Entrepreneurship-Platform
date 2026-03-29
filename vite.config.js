import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Rural Entrepreneurship Platform',
        short_name: 'RuralPlatform',
        description: 'Connecting farmers with global markets for sustainable rural development.',
        theme_color: '#4caf50',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://via.placeholder.com/192x192.png?text=RP',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://via.placeholder.com/512x512.png?text=RP',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
        }
      }
    },
    chunkSizeWarningLimit: 1200
  },
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    host: true
  }
})
