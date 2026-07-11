import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true // সার্ভার চালু হলে ব্রাউজার নিজে থেকেই ওপেন হবে
  }
});