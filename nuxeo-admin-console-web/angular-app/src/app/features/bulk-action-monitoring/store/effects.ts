import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { createEffect } from '@ngrx/effects';
import { Actions, ofType } from '@ngrx/effects';
import { BulkActionMonitoringService } from '../services/bulk-action-monitoring.service';
import * as BulkActionMonitoringActions from '../store/actions';
import { inject } from '@angular/core';
import { BulkActionMonitoringInfo } from '../bulk-action-monitoring.interface';

export const loadPerformBulkActionMonitoringEffect = createEffect(
  (
    actions$ = inject(Actions),
    bulkActionMonitoringService = inject(BulkActionMonitoringService),
    httpClient = inject(HttpClient)
  ) => {
    return actions$.pipe(
      ofType(BulkActionMonitoringActions.performBulkActionMonitor),
      switchMap((action) => {
        if (action.id === 'b703f4b8-7H1f-062c-950d-8ea50f1aa6c8') {
          return httpClient.get('/assets/bulk-state.json').pipe(
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
