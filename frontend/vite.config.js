import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Force restart for resolution
export default defineConfig({
  plugins: [react(), tailwindcss()],
})

