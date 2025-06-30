import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/content.tsx',
        background: 'src/background/background.ts',
        popup: 'src/popup/popup.html'
      }
    }
  }
}) 