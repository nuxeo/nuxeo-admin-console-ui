import { BULK_ACTION_LABELS } from "./../../../../bulk-action-monitoring.constants";
import { BulkActionInfoDetails } from "./../../../../bulk-action-monitoring.interface";
import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: "bulk-action-monitoring-details",
  templateUrl: "./bulk-action-monitoring-details.component.html",
  styleUrls: ["./bulk-action-monitoring-details.component.scss"],
})
export class BulkActionMonitoringDetailsComponent implements OnChanges {
  @Input() bulkActionDetails: BulkActionInfoDetails =
    {} as BulkActionInfoDetails;
  BULK_ACTION_LABELS = BULK_ACTION_LABELS;
  additionalInfoDataSrc: BulkActionInfoDetails[] = [];
  docsProcessedText = "";
  errorsFoundText = "";
  docsSkippedText = "";
  columnsToDisplay: string[] = [];

  ngOnChanges(): void {
    this.additionalInfoDataSrc = [this.bulkActionDetails];
    this.columnsToDisplay = [
      "scrollStart",
      "scrollEnd",
      "processingStart",
      "processingEnd",
      "completed",
      "processingMillis",
    ];
    if (this.bulkActionDetails) {
      this.replacePlaceholderValues();
    }
  }

  replacePlaceholderValues(): void {
    this.docsProcessedText = BULK_ACTION_LABELS.DOCUMENTS_PROCESSED.replaceAll(
      "{noOfDocs}",
      this.bulkActionDetails?.processed?.toString()
    );
    if (this.bulkActionDetails?.processed !== 1) {
      this.docsProcessedText = this.docsProcessedText.replaceAll(
        BULK_ACTION_LABELS.DOCUMENT,
        BULK_ACTION_LABELS.DOCUMENT + "s"
      );
    }

    this.errorsFoundText = BULK_ACTION_LABELS.ERRORS_FOUND.replaceAll(
      "{errorCount}",
      this.bulkActionDetails?.errorCount?.toString()
    );

    if (this.bulkActionDetails?.errorCount !== 1) {
      this.errorsFoundText = this.errorsFoundText.replaceAll(
        BULK_ACTION_LABELS.ERROR,
        BULK_ACTION_LABELS.ERROR + "s"
      );
    }

    this.docsSkippedText = BULK_ACTION_LABELS.DOCUMENTS_SKIPPED.replaceAll(
      "{skipCount}",
      this.bulkActionDetails?.skipCount?.toString()
    );
    if (this.bulkActionDetails?.skipCount !== 1) {
      this.docsSkippedText = this.docsSkippedText.replaceAll(
        BULK_ACTION_LABELS.DOCUMENT,
        BULK_ACTION_LABELS.DOCUMENT + "s"
      );
    }
  }
}
