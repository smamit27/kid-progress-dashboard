import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://kid-progress-dashboard.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
