import { HttpErrorResponse } from "@angular/common/http";
import { BulkActionMonitoringInfo } from "../bulk-action-monitoring.interface";
import * as BulkActionMonitoringActions from "./actions";

describe("BulkActionMonitoringActions", () => {
  describe("performBulkActionMonitor", () => {
    it("should create the action with the correct id", () => {
      const id = "123";
      const action = BulkActionMonitoringActions.performBulkActionMonitor({
        id,
      });
      expect(action.type).toBe("[Admin] Perform Bulk Action Monitor");
      expect(action.id).toBe(id);
    });

    it("should create the action with a null id", () => {
      const id = null;
      const action = BulkActionMonitoringActions.performBulkActionMonitor({
        id,
      });
      expect(action.type).toBe("[Admin] Perform Bulk Action Monitor");
      expect(action.id).toBeNull();
    });
  });

  describe("onBulkActionMonitorLaunch", () => {
    it("should create the action with the correct bulkActionMonitoringInfo", () => {
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
      expect(action.type).toBe("[Admin] On Bulk Action Monitor Launch");
      expect(action.bulkActionMonitoringInfo).toEqual(bulkActionMonitoringInfo);
    });
  });

  describe("onBulkActionMonitorFailure", () => {
    it("should create the action with the correct error", () => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        error: "test 404 error",
        status: 404,
        statusText: "Not Found",
      });
      const action = BulkActionMonitoringActions.onBulkActionMonitorFailure({
        error,
      });
      expect(action.type).toBe("[Admin] On Bulk Action Monitor Failure");
      expect(action.error).toEqual(error);
    });
  });

  describe("resetBulkActionMonitorState", () => {
    it("should create the action", () => {
      const action = BulkActionMonitoringActions.resetBulkActionMonitorState();
      expect(action.type).toBe("[Admin] Reset Bulk Action Monitor State");
    });
  });
});
