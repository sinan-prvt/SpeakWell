import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The lazily-loaded 3D hero (three.js) is a single ~1 MB chunk by design
  build: { chunkSizeWarningLimit: 1100 },
})
