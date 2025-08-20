import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-dxf-viewer': path.resolve(__dirname, '../src'),
    },
  },
  optimizeDeps: {
    exclude: ['react-dxf-viewer'],
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
})
