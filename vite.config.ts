import { defineConfig, } from 'vite'
import mkcert from 'vite-plugin-mkcert'

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

        sourcemap: is_development,
        outDir: 'dist',
        emptyOutDir: true,



        lib: {
            entry: "src/index.ts",
            name: "crs"
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
    ]
})