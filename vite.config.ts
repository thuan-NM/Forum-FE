import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: './postcss.config.cjs', // Hoặc './postcss.config.cjs' nếu sử dụng CommonJS
  },
  plugins: [react()],
  server: {
    port: 5000,
  },
  optimizeDeps: {
    include: [
      "@tiptap/extension-table",
      "@tiptap/extension-table-row",
      "@tiptap/extension-table-header",
      "@tiptap/extension-table-cell",
      "@tiptap/extension-code-block-lowlight",
      "lowlight"
    ],
  },
})
