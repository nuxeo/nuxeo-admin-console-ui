import { Component } from "@angular/core";
import { BulkActionMonitoringInfo } from "../../bulk-action-monitoring.interface";
import { BULK_ACTION_LABELS } from "../../bulk-action-monitoring.constants";

@Component({
  selector: "bulk-action-monitoring",
  templateUrl: "./bulk-action-monitoring.component.html",
  styleUrls: ["./bulk-action-monitoring.component.scss"],
})
export class BulkActionMonitoringComponent {
  bulkActionResponse: BulkActionMonitoringInfo | null = {} as BulkActionMonitoringInfo;
  pageTitle = BULK_ACTION_LABELS.BULK_ACTION_TITLE;
  setBulkActionResponse(data: BulkActionMonitoringInfo | null): void {
    this.bulkActionResponse = data;
  }
}
