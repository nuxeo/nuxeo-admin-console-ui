import { Component, OnInit } from "@angular/core";
import { HyDialogService } from "@hyland/ui/dialog";
import { ReindexConfirmationModalComponent } from "../../../shared/components/reindex/reindex-confirmation-modal/reindex-confirmation-modal.component";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
})
export class ElasticSearchReindexComponent implements OnInit {
  numberOfDocuments: number = 5000;
  timeInHumanReadableFormat: string = "30 minutes";
  impactMessage: string =
    "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.";

  constructor(private dialogService: HyDialogService) {}

  ngOnInit() {
    this.openDialog();
  }

  openDialog() {
    const hasError = false;
    const isCompleted = false;
    const actionId = "12345";

    let dialogHeight = "320px";
    let dialogWidth = "580px";
    if (hasError) {
      dialogHeight = "280px";
      dialogWidth = "480px";
    } else if (isCompleted) {
      dialogHeight = "320px";
      dialogWidth = "480px";
    }

    const dialogRef = this.dialogService.open(
      ReindexConfirmationModalComponent,
      {
        height: dialogHeight,
        width: dialogWidth,
        disableClose: true,
        data: {
          header: "Example Dialog",
          confirmLabel: "Continue",
          dismissLabel: "Disagree",
          impactMessage: this.impactMessage,
          numberOfDocuments: this.numberOfDocuments,
          timeInHumanReadableFormat: this.timeInHumanReadableFormat,
          confirmationFlag: !hasError && !isCompleted,
          errorFlag: hasError,
          completedFlag: isCompleted,
          actionId: actionId,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
