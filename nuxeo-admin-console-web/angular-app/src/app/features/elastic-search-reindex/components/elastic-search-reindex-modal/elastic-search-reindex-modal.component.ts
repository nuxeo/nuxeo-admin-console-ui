import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_MODAL_EVENT,
} from "../../elastic-search-reindex.constants";
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
    const dialogCloseData = {
      isClosed: true,
      continue: true,
      event: ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed,
    };
    this.dialogRef.close(dialogCloseData);
  }

  close(): void {
    const dialogCloseData = {
      isClosed: true,
      event: this.data.isLaunchedModal
        ? ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isLaunched
        : ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isFailed,
    };
    this.dialogRef.close(dialogCloseData);
  }

  abort(): void {
    const dialogCloseData = {
      isClosed: true,
      continue: false,
      event: ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed,
    };
    this.dialogRef.close(dialogCloseData);
  }

  copyActionId(): void {
    navigator.clipboard.writeText(this.data.commandId).then(() => {
      alert(ELASTIC_SEARCH_LABELS.ACTION_ID_COPIED_ALERT);
    });
  }
}
