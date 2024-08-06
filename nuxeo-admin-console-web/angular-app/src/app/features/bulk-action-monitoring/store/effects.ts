import { BulkActionMonitoringService } from "./../services/bulk-action-monitoring.service";
import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as BulkActionMonitoringActions from "./actions";

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
                bulkActionMonitoringInfo: data
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
