/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {},
    resolve: {
        alias: [{ find: '@', replacement: '/src' }, { find: '$lib', replacement: '/src/lib' }],
    },
})