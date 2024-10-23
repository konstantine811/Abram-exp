import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@translations": path.resolve(__dirname, "./src/translations"),
    },
  },
});
