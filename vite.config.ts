import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import dts from "vite-plugin-dts";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "fs";
import { resolve } from "path";

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
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        test: "src/test.ts"
      },
      name: "coresep",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "cjs" ? "cjs" : "js"}`,
    },
    rollupOptions: {
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
    mkcert(),
    dts({
      outDir: "./dist/types/",
      insertTypesEntry: true
    }),
  ],
});
