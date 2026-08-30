import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteApiPlugin } from './vite-api-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteApiPlugin()],
  server: {
    // Avoid proxy conflicts; API is handled by viteApiPlugin
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase is ~300KB — isolate into its own chunk
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase'
          }
          // Framer Motion is ~150KB
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer'
          }
          // Three.js / R3F / Drei are code-split via React.lazy, but if
          // anything leaks into the main graph, catch it here
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three')
          ) {
            return 'vendor-three'
          }
          // AI SDK (Vercel AI + Google Generative AI)
          if (
            id.includes('node_modules/ai') ||
            id.includes('node_modules/@ai-sdk') ||
            id.includes('node_modules/@google/generative-ai')
          ) {
            return 'vendor-ai'
          }
          // React Icons
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons'
          }
          // Core React ecosystem
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
