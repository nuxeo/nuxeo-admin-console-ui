import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HyDialogService } from "@hyland/ui/dialog";
import { ReindexConfirmationModalComponent } from "../../../shared/components/reindex/reindex-confirmation-modal/reindex-confirmation-modal.component";
import { ElasticSearchType } from "../elastic-search-reindex.interface";
import { ELASTIC_SEARCH_REINDEX_TYPES } from "../elastic-search-reindex.constants";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit {
  searchTabs: ElasticSearchType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeTab = this.searchTabs[0];
  pageTitle = "";

 // numberOfDocuments: number = 5000;
 // timeInHumanReadableFormat: string = "30 minutes";
  // impactMessage: string =
  //   "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.";

  constructor(
    private dialogService: HyDialogService,
    private elasticSearchReindexService: ElasticSearchReindexService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.openDialog();
    this.elasticSearchReindexService.pageTitle.subscribe((title) => {
      this.pageTitle = title;
      this.cdref.detectChanges();
    });
  }

  onTabChange(event: any): void {
    const tabs = ELASTIC_SEARCH_REINDEX_TYPES.map((type) => type.label);
    this.router.navigate([tabs[event.index]], { relativeTo: this.route });
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
        //  impactMessage: this.impactMessage,
       //   numberOfDocuments: this.numberOfDocuments,
       //   timeInHumanReadableFormat: this.timeInHumanReadableFormat,
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
