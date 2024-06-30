import { defineConfig } from 'vite';
import includeHtml from "vite-include-html-plugin";

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'src/index.html'
      }
    }
  },
  server: {
    open: true
  },
  plugins: [includeHtml()],
});