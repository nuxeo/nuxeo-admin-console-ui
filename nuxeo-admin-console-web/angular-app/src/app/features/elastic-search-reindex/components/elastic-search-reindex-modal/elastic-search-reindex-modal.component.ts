import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex.constants";
import { CommonService } from "../../../../shared/services/common.service";
import { HyKeyboardFocusService } from "@hyland/ui/keyboard-focus";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReindexModalData } from "../../elastic-search-reindex.interface";

@Component({
  selector: "elastic-search-reindex-modal",
  templateUrl: "./elastic-search-reindex-modal.component.html",
  styleUrls: ["./elastic-search-reindex-modal.component.scss"],
})
export class ElasticSearchReindexModalComponent {
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  constructor(
    private dialogRef: MatDialogRef<ElasticSearchReindexModalComponent>,
    public commonService: CommonService,
    private _hyKeyboardFocusService: HyKeyboardFocusService,
    @Inject(MAT_DIALOG_DATA) public data: ReindexModalData
  ) {}

  continue(): void {
    this.dialogRef.close({
      continue: true,
      commandId: this.data?.commandId,
    });
  }

  close(): void {
    this.dialogRef.close({
      continue: false,
    });
  }

  copyActionId(): void {
    navigator.clipboard.writeText(this.data.commandId).then(() => {
      alert(ELASTIC_SEARCH_LABELS.ACTION_ID_COPIED_ALERT);
    });
  }

  getNoDocumentsMessage(): string | null {
    return this.data.noMatchingQuery
      ? ELASTIC_SEARCH_LABELS.NO_MATCHING_QUERY
      : ELASTIC_SEARCH_LABELS.NO_DOCUMENTS.replace(
          "<documentID>",
          this.data?.userInput
        );
  }
}
