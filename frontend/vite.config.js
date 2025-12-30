/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST;

export default defineConfig({
  plugins: isTest ? [] : [react()],
  esbuild: isTest ? {
    jsxInject: `import React from 'react'`,
    jsx: 'automatic',
  } : undefined,
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    css: false,
    include: ['src/tests/**/*.test.{js,jsx}'],
  },
});
