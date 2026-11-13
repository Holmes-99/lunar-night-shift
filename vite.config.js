import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// "npm run build" makes the normal site for Netlify.
// "npm run build:single" makes one self-contained HTML file for sharing a preview.
export default defineConfig(({ mode }) => ({
  plugins: mode === "single" ? [viteSingleFile()] : [],
  build: mode === "single" ? { outDir: "dist-single", chunkSizeWarningLimit: 2000 } : { chunkSizeWarningLimit: 2000 }
}));
