import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: "./tests/setupTests.js",
    environment: "jsdom",
    globals: true,
  },
});
