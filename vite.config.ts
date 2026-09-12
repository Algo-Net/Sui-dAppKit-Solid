import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";
import tailwind from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Safely replicate __dirname in modern ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwind(),
    solid(), // Routes through 0xc compiler
    dts({
      tsconfigPath: "./tsconfig.json",
      cleanVueFileName: true, // Safely generates types for .tsx entries
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        ui: resolve(__dirname, "src/ui.ts"),
      },
      formats: ["es"], // SolidJS 2 libraries are exclusively ESM-first
      fileName: (format, entryName) => `${entryName}.js`, // Generates index.js and ui.js
    },
    rollupOptions: {
      external: [
        "solid-js",
        "solid-js/web",
        "@mysten/sui",
        "@mysten/dapp-kit-core",
        "tailwindcss",
      ],
      output: {
        format: "esm",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "ui.css") return "ui.css";
          return "[name].[ext]";
        },
      },
    },
  },
});
