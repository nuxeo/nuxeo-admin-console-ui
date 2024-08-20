import {
  BulkActionMonitoringInfo,
  BulkActionInfoSummary,
  BulkActionInfoDetails,
} from "./../../../bulk-action-monitoring.interface";
import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: "bulk-action-monitoring-result",
  templateUrl: "./bulk-action-monitoring-result.component.html",
  styleUrls: ["./bulk-action-monitoring-result.component.scss"],
})
export class BulkActionMonitoringResultComponent implements OnChanges {
  @Input() resultData = {} as BulkActionMonitoringInfo;
  bulkActionSummary: BulkActionInfoSummary = {} as BulkActionInfoSummary;
  bulkActionDetails: BulkActionInfoDetails = {} as BulkActionInfoDetails;
  ngOnChanges(): void {
    this.extractDetailsFromResult();
  }

  extractDetailsFromResult(): void {
    const { action, username, state, submitted, total, commandId } =
      this.resultData;
    const {
      skipCount,
      error,
      scrollStart,
      scrollEnd,
      processed,
      processingStart,
      processingEnd,
      completed,
      processingMillis,
      errorCount,
    } = this.resultData;

    this.bulkActionSummary = {
      action,
      username,
      state,
      errorCount,
      submitted,
      total,
      commandId,
      processed,
    };

    this.bulkActionDetails = {
      skipCount,
      processed,
      error,
      errorCount,
      scrollStart,
      scrollEnd,
      processingStart,
      processingEnd,
      completed,
      processingMillis,
    };
  }
}
