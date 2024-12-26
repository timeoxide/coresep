import { defineConfig, } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import dts from 'vite-plugin-dts'

const is_development = true;
export default defineConfig({

    build: {
        assetsDir: "assets",
        target: "modules",
        rollupOptions: {
            input: ["src/index.ts"],
            output: {
                assetFileNames: "[name].[ext]",
                entryFileNames: "[name].js"
            }
        },

        sourcemap: true,
        outDir: 'dist',
        emptyOutDir: true,



        lib: {
            entry: "src/index.ts",
            name: "coresep",
            formats: ['es', 'cjs'],
        },
    },
    server: {
        host: true,
        port: 2099
    },
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
    plugins: [
        mkcert(),
        dts({
            include: ["src/index.ts"],
            // rollupTypes: true,
            tsconfigPath: "./tsconfig.json",
            outDir: "./dist",
            insertTypesEntry: true,

        })
    ]
})