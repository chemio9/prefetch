import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import postcssPresetEnv from 'postcss-preset-env'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv()]
    }
  }
})
