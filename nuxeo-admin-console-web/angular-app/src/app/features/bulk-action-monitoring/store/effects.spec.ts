import { loadPerformBulkActionMonitoringEffect } from "./effects";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import * as BulkActionMonitoringActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";
import { BulkActionMonitoringService } from "../services/bulk-action-monitoring.service";

describe("ElasticSearch Reindex Effects", () => {
  const bulkActionMonitoringServiceSpy = jasmine.createSpyObj(
    "BulkActionMonitoringService",
    ["performBulkActionMonitoring"]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: BulkActionMonitoringService,
          useValue: bulkActionMonitoringServiceSpy,
        },
      ],
    });
  });

  it("should return onBulkActionMonitorFailure on failure", (done) => {
    const effect = TestBed.runInInjectionContext(
      () => loadPerformBulkActionMonitoringEffect
    );
    const id = "805c8feb-308c-48df-b74f-d09b4758f778";
    const error = {
      status: "404",
      message: "Page not found !",
    };
    bulkActionMonitoringServiceSpy.performBulkActionMonitoring.and.returnValue(
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
        done();
      }
    );
  });
});
