import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@capacitor/app": path.resolve(__dirname, "node_modules/@capacitor/app"),
    },
  },
  optimizeDeps: {
    include: ['@capacitor/app']
  },
  build: {
    commonjsOptions: {
      include: [/@capacitor\/app/, /node_modules/],
    },
    rollupOptions: {
      external: [
        '@capacitor/app',
        '@capacitor/core'
      ]
    }
  }
}));