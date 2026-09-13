import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [solid()],
  test: {
    environment: "jsdom", // Replicates a web browser window inside Node.js
    globals: true, // Allows using 'describe', 'it', 'expect' without explicit imports
    setupFiles: [], // You can add global test helpers here if needed
    deps: {
      optimizer: {
        web: {
          include: ["solid-js"],
        },
      },
    },
  },
});
