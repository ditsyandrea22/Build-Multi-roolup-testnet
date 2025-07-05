import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add these aliases to handle the safe-global packages
      '@safe-globalThis/safe-apps-provider': '@safe-global/safe-apps-provider',
      '@safe-globalThis/safe-apps-sdk': '@safe-global/safe-apps-sdk'
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: [
        // Explicitly externalize these packages if needed
        '@safe-global/safe-apps-provider',
        '@safe-global/safe-apps-sdk'
      ],
    },
  },
  optimizeDeps: {
    include: [
      '@safe-global/safe-apps-provider',
      '@safe-global/safe-apps-sdk'
    ],
  },
})