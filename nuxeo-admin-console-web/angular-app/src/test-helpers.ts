import "@angular/compiler";
import { beforeAll, beforeEach } from "vitest";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

/**
 * Initializes Angular TestBed environment for Vitest component tests.
 *
 * WORKAROUND: Analog plugin loads before setupFiles, preventing test-setup.ts from running.
 * This function must be called in beforeAll() of each component spec file.
 *
 * @example
 * ```ts
 * import { initializeTestBed } from 'src/test-helpers';
 *
 * describe('MyComponent', () => {
 *   initializeTestBed();
 *
 *   beforeEach(async () => {
 *     await TestBed.configureTestingModule({ ... });
 *   });
 * });
 * ```
 */
export function initializeTestBed() {
  beforeAll(() => {
    try {
      getTestBed().initTestEnvironment(
        BrowserDynamicTestingModule,
        platformBrowserDynamicTesting()
      );
    } catch (e) {
      // Already initialized - ignore
    }
  });

  beforeEach(() => {
    getTestBed().resetTestingModule();
  });
}
