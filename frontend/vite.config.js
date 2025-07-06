import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    host: "0.0.0.0", // necessary for external access (e.g., ngrok)
    port: 3000,
    allowedHosts: [
      "8a0e-223-185-36-78.ngrok-free.app", // ✅ allow this specific host
    ],
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
