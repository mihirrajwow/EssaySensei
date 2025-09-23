import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4400,
    strictPort: true,
    open: false
  },
  preview: {
    port: 4400,
    strictPort: true
  }
})
