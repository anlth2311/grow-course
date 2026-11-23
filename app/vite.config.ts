import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps every asset path relative, so the build runs from any
// folder — a static host, a file share, or inside a SCORM package later.
export default defineConfig({
  base: './',
  plugins: [react()],
});
