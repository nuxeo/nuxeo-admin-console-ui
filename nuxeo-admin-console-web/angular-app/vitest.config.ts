/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  plugins: [angular()],
  test: {
    // Enable global test APIs (describe, it, expect) without importing in every file
    // Matches Jasmine/Karma behavior where these were globally available
    globals: true,

    // Use jsdom to simulate browser environment (DOM, localStorage, window, document)
    // Required for Angular component testing and browser API testing
    environment: "jsdom",

    // Run this setup file before all tests to initialize Angular testing environment
    // Configures TestBed, imports zone.js for Angular's change detection
    // MUST run before Analog plugin processes components
    setupFiles: ["src/test-setup.ts"],

    // Only run files matching this pattern - all TypeScript spec files in src/
    // Prevents accidentally running test files from node_modules or dist/
    include: ["src/**/*.spec.ts"],

    // Explicitly exclude these directories from test discovery
    // Prevents scanning unnecessary folders and speeds up test file detection

    // Enable CSS processing in tests (Angular components use SCSS/CSS)
    // Without this, component styles would cause import errors
    css: {
      include: /.+/, // Include all CSS/SCSS files
    },

    // Use worker threads for parallel test execution
    // Alternative: 'forks' (separate processes, more isolation but slower)
    pool: "threads",

    // Limit parallel test execution to 4 concurrent files
    // Prevents resource exhaustion (memory, CPU) on machines with many cores
    // Adjust based on your machine: lower for CI, higher for powerful dev machines
    maxConcurrency: 4,

    // Configure reporters for better error visibility
    // 'verbose' shows detailed test output with clear error messages and stack traces
    // 'default' is the standard reporter, 'verbose' adds more context
    reporters: ["verbose"],

    // Show full diff when assertions fail (like Jasmine)
    // Makes it easier to see what's different between expected and actual values
    // Improves error messages for failed assertions
    outputFile: undefined,

    // Bail after first test failure to fail fast
    // Set to true in CI to stop immediately on failure and save time
    bail: 0, // Set to 1 to stop after first failure

    coverage: {
      // Use V8 coverage provider (faster, more accurate than Istanbul)
      // V8 is built into Node.js, no instrumentation overhead
      provider: "v8",

      // Generate multiple report formats for different use cases:
      reporter: ["text", "html", "lcov", "text-summary"],

      // Output directory for coverage reports
      // Matches Karma's output directory to maintain compatibility with existing tools/scripts
      reportsDirectory: "./coverage/nuxeoadmin",

      // Enforce minimum coverage thresholds - build fails if not met
      // Prevents code quality degradation over time
      // These gates ensure new code is properly tested before merging
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },

      // Exclude files that don't need coverage tracking
      // Improves coverage accuracy by focusing on business logic, not boilerplate
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

    // Maximum time a single test can run before being marked as timeout
    // Prevents hanging tests from blocking CI/CD pipelines
    // 30s is generous for unit tests (typically <100ms), needed for slow integration tests

    // Maximum time beforeEach/afterEach hooks can run
    // Prevents setup/teardown from hanging indefinitely
  },

  resolve: {
    // Create path alias @ -> ./src for cleaner imports
    // Allows: import { Foo } from '@/app/foo' instead of '../../../app/foo'
    // Matches Angular's default tsconfig.json path mapping
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
