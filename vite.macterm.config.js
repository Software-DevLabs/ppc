import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/* dedicated build for the standalone macterm site deploy
   (macterm-001m.vercel.app) — single page, / -> MacTermV2 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-macterm',
    rollupOptions: {
      input: path.resolve(__dirname, './macterm.html'),
    },
  },
})
