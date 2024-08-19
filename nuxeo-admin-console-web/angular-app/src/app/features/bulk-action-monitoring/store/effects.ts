import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { createEffect } from "@ngrx/effects";
import { Actions, ofType } from "@ngrx/effects";
import { BulkActionMonitoringService } from "../services/bulk-action-monitoring.service";
import * as BulkActionMonitoringActions from "../store/actions";
import { inject } from "@angular/core";
import { BulkActionMonitoringInfo } from "../bulk-action-monitoring.interface";

// TODO: Remove this once testing is complete for different bulk action states for different action IDs
const jsonMap = [
  {
    id: "a703f6r8-7H19-062c-120d-8ea50f1aa6c8",
    filename: "/assets/bulk-state1.json",
  },
  {
    id: "b703q4b8-OH1f-w62c-950d-8ea30f1aa6c8",
    filename: "/assets/bulk-state2.json",
  },
  {
    id: "c703fmb8-7I1f-062c-92ld-8ea20f1aa6c8",
    filename: "/assets/bulk-state3.json",
  },
  {
    id: "d703f2b8-7H1f-962c-250d-8wa50f1ma6c8",
    filename: "/assets/bulk-state4.json",
  },
  {
    id: "e723f4b8-7P1f-062J-950d-82a30f1aa6c8",
    filename: "/assets/bulk-state5.json",
  },
  {
    id: "f723f4b8-7H1f-062c-050d-8ea50effaa6c8",
    filename: "/assets/bulk-state6.json",
  },
  {
    id: "g703f4b8-7H1f-062c-950d-8ea50f1aa6c8",
    filename: "/assets/bulk-state7.json",
  },
];

export const loadPerformBulkActionMonitoringEffect = createEffect(
  (
    actions$ = inject(Actions),
    bulkActionMonitoringService = inject(BulkActionMonitoringService),
    httpClient = inject(HttpClient)
  ) => {
    return actions$.pipe(
      ofType(BulkActionMonitoringActions.performBulkActionMonitor),
      switchMap((action) => {
        // TODO: Remove this once testing is complete for different bulk action states for different action IDs
        const isTestId = jsonMap.some((map) => action.id === map.id);
        if (isTestId) {
          const fileName = jsonMap.find(
            (item) => item.id === action.id
          )?.filename;
          return httpClient.get(fileName as string).pipe(
            map((data) => {
              return BulkActionMonitoringActions.onBulkActionMonitorLaunch({
                bulkActionMonitoringInfo: data as BulkActionMonitoringInfo,
              });
            }),
            catchError((error) => {
              return of(
                BulkActionMonitoringActions.onBulkActionMonitorFailure({
                  error,
                })
              );
            })
          );
        } else {
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
        }
      })
    );
  },
  { functional: true }
);
