import { CommonService } from "./../../../../../shared/services/common.service";
import { Component, Input, OnChanges } from "@angular/core";
import { BulkActionInfoDetails } from "../../../bulk-action-monitoring.interface";
import { BULK_ACTION_LABELS } from "../../../bulk-action-monitoring.constants";

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
  constructor(private commonService: CommonService) {}
  ngOnChanges(): void {
    this.additionalInfoDataSrc = [this.bulkActionDetails];
    if (this.bulkActionDetails) {
      this.replacePlaceholderValues();
    }
  }

  replacePlaceholderValues(): void {
    this.docsProcessedText = this.commonService.getPluralizedText(
      this.bulkActionDetails?.processed,
      BULK_ACTION_LABELS.DOCUMENTS_PROCESSED.replace(
        "{noOfDocs}",
        this.bulkActionDetails?.processed?.toString()
      )
    );
    this.errorsFoundText = this.commonService.getPluralizedText(
      this.bulkActionDetails?.errorCount,
      BULK_ACTION_LABELS.ERRORS_FOUND.replace(
        "{errorCount}",
        this.bulkActionDetails?.errorCount?.toString()
      )
    );
    this.docsSkippedText = this.commonService.getPluralizedText(
      this.bulkActionDetails?.skipCount,
      BULK_ACTION_LABELS.DOCUMENTS_SKIPPED.replace(
        "{skipCount}",
        this.bulkActionDetails?.skipCount?.toString()
      )
    );
  }
}
