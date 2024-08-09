import { createReducer, on } from "@ngrx/store";
import * as BulkActionMonitoringActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface BulkActionMonitoringState {
  bulkActionMonitoringInfo: {
    "entity-type": string | null;
    commandId: string | null;
    state: string | null;
    processed: number;
    skipCount: number;
    error: boolean;
    errorCount: number;
    total: number;
    action: string | null;
    username: string | null;
    submitted: string | null;
    scrollStart: string | null;
    scrollEnd: string | null;
    processingStart: string | null;
    processingEnd: string | null;
    completed: string | null;
    processingMillis: number;
  };
  error: HttpErrorResponse | null;
}

export const initialBulkActionMonitoringState: BulkActionMonitoringState = {
  bulkActionMonitoringInfo: {
    "entity-type": null,
    commandId: null,
    state: null,
    processed: -1,
    skipCount: -1,
    error: false,
    errorCount: -1,
    total: -1,
    action: null,
    username: null,
    submitted: null,
    scrollStart: null,
    scrollEnd: null,
    processingStart: null,
    processingEnd: null,
    completed: null,
    processingMillis: -1,
  },
  error: null,
};

export const bulkActionMonitoringReducer = createReducer(
  initialBulkActionMonitoringState,
  on(BulkActionMonitoringActions.performBulkActionMonitor, (state) => ({
    ...state,
    error: null,
  })),
  on(
    BulkActionMonitoringActions.onBulkActionMonitorLaunch,
    (state, { bulkActionMonitoringInfo }) => ({
      ...state,
      bulkActionMonitoringInfo
    })
  ),
  on(
    BulkActionMonitoringActions.onBulkActionMonitorFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  ),
  on(BulkActionMonitoringActions.resetBulkActionMonitorState, (state) => ({
    ...state,
    bulkActionMonitoringInfo: initialBulkActionMonitoringState.bulkActionMonitoringInfo,
    error: null,
  }))
);
