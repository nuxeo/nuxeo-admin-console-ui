import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPerformBulkActionMonitoringEffect } from "./effects";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import * as BulkActionMonitoringActions from "./actions";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { BulkActionMonitoringService } from "../services/bulk-action-monitoring.service";
describe("ElasticSearch Reindex Effects", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  const bulkActionMonitoringServiceSpy = {
    performBulkActionMonitoring: vi
      .fn()
      .mockName("BulkActionMonitoringService.performBulkActionMonitoring"),
  } as unknown as BulkActionMonitoringService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideMockStore(),
        {
          provide: BulkActionMonitoringService,
          useValue: bulkActionMonitoringServiceSpy,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it("should return onBulkActionMonitorFailure on failure", async () => {
    const effect = TestBed.runInInjectionContext(
      () => loadPerformBulkActionMonitoringEffect
    );
    const id = "805c8feb-308c-48df-b74f-d09b4758f778";
    const error = {
      status: "404",
      message: "Page not found !",
    };
    (bulkActionMonitoringServiceSpy.performBulkActionMonitoring as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => new HttpErrorResponse({ error }))
    );
    const outcome = BulkActionMonitoringActions.onBulkActionMonitorFailure({
      error: new HttpErrorResponse({ error }),
    });
    const actionsMock$ = of(
      BulkActionMonitoringActions.performBulkActionMonitor({ id })
    );
    effect(actionsMock$, bulkActionMonitoringServiceSpy).subscribe(
      (result: unknown) => {
        expect(result).toEqual(outcome);
      }
    );
  });
});
