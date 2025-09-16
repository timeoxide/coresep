import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "fs";
import { resolve } from "path";
import { nodeExternals } from "rollup-plugin-node-externals";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8")
);
const version = packageJson.version;
config({ path: ".env.version" });
const is_development = true;

export default defineConfig({
  define: {
    __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER),
  },
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        models: "src/models/index.ts",
        abstractions: "src/abstractions/index.ts",
        "vite-plugin-coresep": "src/vite-plugin-coresep.ts",
      },
      name: "coresep",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "cjs" ? "cjs" : "js"}`,
    },
    rollupOptions: {
      external: ["node:fs/promises", "fs-extra", "es-module-lexer", 'vite'],
      output: {
        entryFileNames: "[name].[format].js",
      },
    },

    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 2099,
  },
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@/", replacement: "src/" },
    ],
  },
  plugins: [
    dts({
      outDir: "./dist/types/",
      insertTypesEntry: true,
    }),
    nodeExternals({}),
  ],
});
