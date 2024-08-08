import {
  bulkActionMonitoringReducer,
  initialBulkActionMonitoringState,
  BulkActionMonitoringState,
} from "./reducers";
import * as BulkActionMonitoringActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";
import { BulkActionMonitoringInfo } from "../bulk-action-monitoring.interface";

describe("bulkActionMonitoringReducer", () => {
  it("should handle performBulkActionMonitor", () => {
    const action = BulkActionMonitoringActions.performBulkActionMonitor({
      id: "123",
    });
    const state = bulkActionMonitoringReducer(
      initialBulkActionMonitoringState,
      action
    );
    expect(state).toEqual({
      ...initialBulkActionMonitoringState,
      error: null,
    });
  });

  it("should handle onBulkActionMonitorLaunch", () => {
    const bulkActionMonitoringInfo: BulkActionMonitoringInfo = {
      "entity-type": "bulkActionMonitoringInfo",
      commandId: "123",
      state: "running",
      processed: 10,
      skipCount: 0,
      error: false,
      errorCount: 0,
      total: 100,
      action: "bulkAction",
      username: "user1",
      submitted: "2023-01-01T00:00:00Z",
      scrollStart: "2023-01-01T00:00:00Z",
      scrollEnd: "2023-01-01T01:00:00Z",
      processingStart: "2023-01-01T01:00:00Z",
      processingEnd: "2023-01-01T02:00:00Z",
      completed: "2023-01-01T02:00:00Z",
      processingMillis: 3600000,
    };
    const action = BulkActionMonitoringActions.onBulkActionMonitorLaunch({
      bulkActionMonitoringInfo,
    });
    const state = bulkActionMonitoringReducer(
      initialBulkActionMonitoringState,
      action
    );
    expect(state).toEqual({
      ...initialBulkActionMonitoringState,
      bulkActionMonitoringInfo,
    });
  });

  it("should handle onBulkActionMonitorFailure", () => {
    const error: HttpErrorResponse = new HttpErrorResponse({
      error: "test 404 error",
      status: 404,
      statusText: "Not Found",
    });
    const action = BulkActionMonitoringActions.onBulkActionMonitorFailure({
      error,
    });
    const state = bulkActionMonitoringReducer(
      initialBulkActionMonitoringState,
      action
    );
    expect(state).toEqual({
      ...initialBulkActionMonitoringState,
      error,
    });
  });

  it("should handle resetBulkActionMonitorState", () => {
    const modifiedState: BulkActionMonitoringState = {
      bulkActionMonitoringInfo: {
        "entity-type": "bulkActionMonitoringInfo",
        commandId: "123",
        state: "running",
        processed: 10,
        skipCount: 0,
        error: false,
        errorCount: 0,
        total: 100,
        action: "bulkAction",
        username: "user1",
        submitted: "2023-01-01T00:00:00Z",
        scrollStart: "2023-01-01T00:00:00Z",
        scrollEnd: "2023-01-01T01:00:00Z",
        processingStart: "2023-01-01T01:00:00Z",
        processingEnd: "2023-01-01T02:00:00Z",
        completed: "2023-01-01T02:00:00Z",
        processingMillis: 3600000,
      },
      error: new HttpErrorResponse({
        error: "test 404 error",
        status: 404,
        statusText: "Not Found",
      }),
    };
    const action = BulkActionMonitoringActions.resetBulkActionMonitorState();
    const state = bulkActionMonitoringReducer(modifiedState, action);
    expect(state).toEqual(initialBulkActionMonitoringState);
  });
});
