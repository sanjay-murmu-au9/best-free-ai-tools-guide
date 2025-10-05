import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/best-free-ai-tools-guide/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})