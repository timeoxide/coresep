/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            // you can include other reporters, but 'json-summary' is required, json is recommended
            reporter: ['text', 'json-summary', 'json'],
            exclude: [
                "example/**/*",
                "src/models/*",
                "src/abstractions/*"
            ],
            include: ["src/**/*"],
            // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
            reportOnFailure: true,
        }
    },
    resolve: {
        alias: [{ find: '@', replacement: '/src' }, { find: '$lib', replacement: '/src/lib' }],
    },
})