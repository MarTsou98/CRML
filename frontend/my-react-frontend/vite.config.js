import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // 👈 Makes the dev server accessible over the network
    port: 5173         // 👈 Optional, but you can change the port if needed
  }
})