import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { createEffect } from "@ngrx/effects";
import { Actions, ofType } from "@ngrx/effects";
import { BulkActionMonitoringService } from "../services/bulk-action-monitoring.service";
import * as BulkActionMonitoringActions from "../store/actions";
import { inject } from "@angular/core";
export const loadPerformBulkActionMonitoringEffect = createEffect(
  (
    actions$ = inject(Actions),
    bulkActionMonitoringService = inject(BulkActionMonitoringService)
  ) => {
    return actions$.pipe(
      ofType(BulkActionMonitoringActions.performBulkActionMonitor),
      switchMap((action) => {
        return bulkActionMonitoringService
          .performBulkActionMonitoring(action?.id)
          .pipe(
            map((data) => {
              return BulkActionMonitoringActions.onBulkActionMonitorLaunch({
                bulkActionMonitoringInfo: data,
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                BulkActionMonitoringActions.onBulkActionMonitorFailure({
                  error,
                })
              );
            })
          );
      })
    );
  },
  { functional: true }
);
