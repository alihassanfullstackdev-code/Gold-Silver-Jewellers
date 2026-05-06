import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react({
        // Yeh line add karein taake React 17+ ka automatic transform force ho
        jsxRuntime: 'automatic',
      }), 
      tailwindcss()
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // Production build ke liye source maps disable kar dein (optional, but good for speed)
    build: {
      sourcemap: false,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});