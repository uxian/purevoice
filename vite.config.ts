import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true, // Listen on all local IPs
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ml5': ['ml5'],
          'vendor-tone': ['tone'],
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB since ml5 is huge
  }
})
