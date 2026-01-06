/**
 * Test Setup for Vitest
 *
 * NOTE: This file is currently NOT USED due to Analog plugin lifecycle issues.
 * The @analogjs/vite-plugin-angular loads BEFORE setupFiles, preventing this from executing.
 *
 * WORKAROUND: All test files must call initializeTestBed() from 'src/test-helpers.ts'
 *
 * See: https://github.com/analogjs/analog/issues/XXX (pending investigation)
 */

// This file is kept for potential future use when Analog plugin lifecycle is fixed
// For now, test initialization is handled by src/test-helpers.ts
