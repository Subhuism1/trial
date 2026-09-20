import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // index.html = the invitation, create.html = personal invite-link maker
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        create: resolve(import.meta.dirname, "create.html"),
      },
    },
  },
});
