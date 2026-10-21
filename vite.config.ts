import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import ui from './vite.js'

// the playground: a styleguide page for editing the shared layer with HMR
const PORT = 3099

export default defineConfig({
  plugins: [vue(), tailwindcss(), ui()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: PORT,
  },
  preview: {
    port: PORT,
  },
})
