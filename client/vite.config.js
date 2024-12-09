import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-redux': 'react-redux/es/index.js',
      'redux-persist': 'redux-persist/es/index.js',
      'flowbite-react': 'flowbite-react/index.js',
    },
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
