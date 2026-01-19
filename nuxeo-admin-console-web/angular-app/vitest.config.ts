/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  plugins: [angular()],
  test: {
    // Enable global test APIs (describe, it, expect) without imports
    globals: true,

    // Use jsdom to simulate browser environment (DOM, localStorage, window)
    environment: "jsdom",

    // Initialize Angular testing environment before tests
    setupFiles: ["src/test-setup.ts"],

    // Run all TypeScript spec files in src/
    include: ["src/**/*.spec.ts"],

    // Enable CSS/SCSS processing for Angular components
    css: {
      include: /.+/,
    },

    // Use worker threads for parallel test execution
    pool: "threads",

    // Limit parallel execution to prevent resource exhaustion
    maxConcurrency: 4,

    // Use verbose reporter for detailed error messages
    reporters: ["verbose"],

    // Set to 1 to stop after first failure
    bail: 0,

    coverage: {
      // Use V8 coverage provider (built into Node.js)
      provider: "v8",

      // Generate multiple report formats
      reporter: ["text", "html", "lcov", "json-summary", "text-summary"],

      // Coverage reports output directory
      reportsDirectory: "./coverage/admin_console_ui",

      // Enforce 80% minimum coverage thresholds
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },

      // Exclude files that don't need coverage tracking
      exclude: [
        "node_modules/",
        "src/**/*.spec.ts",
        "src/**/*.d.ts",
        "src/test-setup.ts",
        "src/environments/",
        "src/main.ts",
        "src/devtools/",
        "**/*.module.ts",
        "**/*.config.ts",
        "**/*.constants.ts",
        "**/index.ts",
        "**/*.html",
        "**/*.scss",
        "**/*.css",
        "**/*-routing.module.ts",
      ],
    },
  },

  resolve: {
    // Path aliases for cleaner imports: @/app/foo instead of ../../../app/foo
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
