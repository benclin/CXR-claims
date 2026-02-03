import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { tokensCSSPlugin } from './vite-plugins/tokens-css'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Allow base path to be overridden via environment variable for Bolt consumption
  // Default to '/CXR-UX/' for GitHub Pages, '/' for Bolt or root deployments
  // Use BASE_PATH env var (not VITE_ prefix since this is config-time, not runtime)
  // Check env var first, then fall back to mode-based default
  const basePath = process.env.BASE_PATH !== undefined 
    ? process.env.BASE_PATH 
    : (mode === 'production' ? '/CXR-UX/' : '/');
  
  return {
  // Only set base path for production builds (GitHub Pages deployment)
  // Local development will work at root path
  // Note: GitHub Pages paths are case-sensitive; match the repo name exactly (CXR-UX).
  // For Bolt consumption, set BASE_PATH=/ to build with root path
  base: basePath,
  plugins: [
    react(),
    tokensCSSPlugin(), // Generate CSS from JSON at build time
  ],
  server: {
    port: 5174,
    strictPort: true, // Fail if port is already in use
    hmr: {
      overlay: true,  // Show errors as overlay
    },
    watch: {
      usePolling: true,  // Enable polling for file changes
      interval: 100,     // Check for changes every 100ms
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@wex/design-tokens/tailwind-preset": path.resolve(__dirname, "./packages/design-tokens/tailwind-preset.js"),
    },
  },
  build: {
    // Increase the warning threshold to silence large chunk warnings
    // (no functional impact; adjust as needed)
    chunkSizeWarningLimit: 1500,
  },
  };
})
