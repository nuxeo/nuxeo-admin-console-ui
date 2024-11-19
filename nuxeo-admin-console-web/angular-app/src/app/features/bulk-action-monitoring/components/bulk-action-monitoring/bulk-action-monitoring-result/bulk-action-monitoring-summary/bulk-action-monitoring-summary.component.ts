import { CustomSnackBarComponent } from "./../../../../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { BULK_ACTION_LABELS } from "./../../../../bulk-action-monitoring.constants";
import { BulkActionInfoSummary } from "./../../../../bulk-action-monitoring.interface";
import { Component, Input, OnChanges } from "@angular/core";
import * as BulkActionMonitoringActions from "../../../../store/actions";
import { Store } from "@ngrx/store";
import { BulkActionMonitoringState } from "../../../../store/reducers";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "bulk-action-monitoring-summary",
  templateUrl: "./bulk-action-monitoring-summary.component.html",
  styleUrls: ["./bulk-action-monitoring-summary.component.scss"],
})
export class BulkActionMonitoringSummaryComponent implements OnChanges {
  @Input() bulkActionSummary: BulkActionInfoSummary =
    {} as BulkActionInfoSummary;
  statusText = "";
  nonRunningText = "";
  BULK_ACTION_LABELS = BULK_ACTION_LABELS;

  constructor(
    private store: Store<{ bulkActionMonitoring: BulkActionMonitoringState }>,
    private _snackBar: MatSnackBar
  ) {}

  ngOnChanges(): void {
    if (this.bulkActionSummary) {
      this.replacePlaceholderValues();
    }

    const refreshBtn = document.querySelector(
      "#refreshResultsBtn"
    ) as HTMLElement;
    if (refreshBtn) {
      refreshBtn.focus();
    }
  }
  replacePlaceholderValues(): void {
    this.statusText = BULK_ACTION_LABELS.BULK_ACTION_SUMMARY_TEXT.replace(
      "{commandId}",
      this.bulkActionSummary?.commandId as string
    ).replace("{username}", this.bulkActionSummary?.username as string);
    if (this.bulkActionSummary?.state) {
      const state: string = this.bulkActionSummary?.state;
      this.nonRunningText = BULK_ACTION_LABELS.FULLFILLED_TEXT.replaceAll(
        "{fulfilled}",
        BULK_ACTION_LABELS.STATUS_INFO_TEXT[
          state as keyof typeof BULK_ACTION_LABELS.STATUS_INFO_TEXT
        ].label
      ).replaceAll(
        "{errorCount}",
        this.bulkActionSummary?.errorCount?.toString()
      );
    }
    if (this.bulkActionSummary?.errorCount !== 1 && this.nonRunningText) {
      this.nonRunningText = this.nonRunningText.replaceAll(
        BULK_ACTION_LABELS.ERROR,
        BULK_ACTION_LABELS.ERROR + "s"
      );
    }
  }

  getRunningStatusText(): string {
    let statusText;
    if (this.bulkActionSummary?.state) {
      const state: string = this.bulkActionSummary?.state;
      statusText = BULK_ACTION_LABELS.STATUS_TEXT.replaceAll(
        "{Running}",
        BULK_ACTION_LABELS.STATUS_INFO_TEXT[
          state as keyof typeof BULK_ACTION_LABELS.STATUS_INFO_TEXT
        ].label
      )
        .replaceAll(
          "{processed}",
          this.bulkActionSummary?.processed?.toString()
        )
        .replaceAll("{total}", this.bulkActionSummary?.total?.toString())
        .replaceAll(
          `{errorCount} ${BULK_ACTION_LABELS.ERROR}`,
          `${this.bulkActionSummary?.errorCount?.toString()} ${
            BULK_ACTION_LABELS.ERROR
          }`
        );
    }

    if (this.bulkActionSummary?.errorCount !== 1 && statusText) {
      statusText = statusText?.replaceAll(
        BULK_ACTION_LABELS.ERROR,
        BULK_ACTION_LABELS.ERROR + "s"
      );
    }

    if (this.bulkActionSummary?.total !== 1) {
      statusText = statusText?.replaceAll(
        BULK_ACTION_LABELS.DOCUMENT,
        BULK_ACTION_LABELS.DOCUMENT + "s"
      );
    }

    return statusText || "";
  }

  onRefresh(): void {
    this._snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: BULK_ACTION_LABELS.INFORMATION_UPDATED,
        panelClass: "success-snack",
      },
      duration: 5000,
      panelClass: ["success-snack"],
    });

    this.store.dispatch(
      BulkActionMonitoringActions.performBulkActionMonitor({
        id: this.bulkActionSummary?.commandId,
      })
    );
  }

  getTooltipText(): string {
    return BULK_ACTION_LABELS.STATUS_INFO_TEXT[
      this.bulkActionSummary
        ?.state as keyof typeof BULK_ACTION_LABELS.STATUS_INFO_TEXT
    ]?.tooltip;
  }
}
