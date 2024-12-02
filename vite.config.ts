import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

const is_development = true;
export default defineConfig({

    build: {
        assetsDir: "assets",
        target: "esnext",
        rollupOptions: {
            output: {
                assetFileNames: "[name].[ext]",
                entryFileNames: "[name].js"
            }
        },

        sourcemap: is_development,
        outDir: 'dist',
        emptyOutDir: true,
    
        lib: {
            entry: "src/lib.ts",
            name: "crs"
        },
    },
    server: {
        host: true,
        port: 2099
    },
    resolve: {
        alias: [{ find: '@', replacement: '/src' }, { find: '$lib', replacement: '/src/lib' }],
    },
    plugins: [
        mkcert(),
    ]
})