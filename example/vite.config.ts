import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-dxf-coordinates': path.resolve(__dirname, '../src'),
      // 'react-dxf-coordinates': path.resolve(__dirname, '../dist/index.esm.js'),
    },
  },
  optimizeDeps: {
    exclude: ['react-dxf-coordinates'],
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
})
