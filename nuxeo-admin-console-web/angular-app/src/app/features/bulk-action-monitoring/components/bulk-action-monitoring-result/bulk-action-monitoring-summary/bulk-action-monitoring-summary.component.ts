import { CommonService } from "./../../../../../shared/services/common.service";
import { BULK_ACTION_LABELS } from "./../../../bulk-action-monitoring.constants";
import { Component, Input, OnChanges } from "@angular/core";
import { BulkActionInfoSummary } from "../../../bulk-action-monitoring.interface";
import { HyToastService } from "@hyland/ui";
import * as BulkActionMonitoringActions from "../../../store/actions";
import { Store } from "@ngrx/store";
import { BulkActionMonitoringState } from "../../../store/reducers";

@Component({
  selector: "bulk-action-monitoring-summary",
  templateUrl: "./bulk-action-monitoring-summary.component.html",
  styleUrls: ["./bulk-action-monitoring-summary.component.scss"],
})
export class BulkActionMonitoringSummaryComponent implements OnChanges {
  @Input() bulkActionSummary: BulkActionInfoSummary =
    {} as BulkActionInfoSummary;
  statusText = "";
  completedText = "";
  BULK_ACTION_LABELS = BULK_ACTION_LABELS;
  constructor(
    private toastService: HyToastService,
    private store: Store<{ bulkActionMonitoring: BulkActionMonitoringState }>,
    private commonService: CommonService
  ) {}
  ngOnChanges(): void {
    if (this.bulkActionSummary) {
      this.replacePlaceholderValues();
    }
  }
  replacePlaceholderValues(): void {
    this.statusText = BULK_ACTION_LABELS.BULK_ACTION_SUMMARY_TEXT.replace(
      "{commandId}",
      this.bulkActionSummary?.commandId as string
    ).replace("{username}", this.bulkActionSummary?.username as string);
    this.completedText = this.commonService.getPluralizedText(
      this.bulkActionSummary?.errorCount,
      BULK_ACTION_LABELS.COMPLETED_WITH_ERROR.replace(
        "{errorCount}",
        this.bulkActionSummary?.errorCount?.toString()
      )
    );
  }

  getRunningStatusText(): string {
    const statusText = BULK_ACTION_LABELS.RUNNING_STATUS_TEXT.replaceAll(
      "{processed}",
      this.bulkActionSummary?.processed?.toString()
    )
      .replaceAll("{total}", this.bulkActionSummary?.total?.toString())
      .replaceAll(
        "{errorCount}",
        this.bulkActionSummary?.errorCount === 0
          ? BULK_ACTION_LABELS.NO
          : this.bulkActionSummary?.errorCount?.toString()
      );
    const initText = this.commonService.getPluralizedText(
      this.bulkActionSummary?.total,
      statusText
    );
    return initText;
  }

  onRefresh(): void {
    this.toastService.success(BULK_ACTION_LABELS.INFORMATION_UPDATED, {
      canBeDismissed: true,
    });
    this.store.dispatch(
      BulkActionMonitoringActions.performBulkActionMonitor({
        id: this.bulkActionSummary?.commandId,
      })
    );
  }
}
