import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  vercel: {
    rewrites: [{ source: "/(.*)", destination: "/" }],
  },
});
