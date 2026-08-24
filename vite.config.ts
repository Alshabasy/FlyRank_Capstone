import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteApiPlugin } from './vite-api-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteApiPlugin()],
  server: {
    // Avoid proxy conflicts; API is handled by viteApiPlugin
  },
})
