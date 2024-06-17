import { ELASTIC_SEARCH_REINDEX_MODAL_EVENT } from '../../../features/elastic-search-reindex/elastic-search-reindex.constants';
import { CommonService } from '../../services/common.service';
import { HyKeyboardFocusService } from "@hyland/ui/keyboard-focus";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "reindex-modal",
  templateUrl: "./reindex-modal.component.html",
  styleUrls: ["./reindex-modal.component.scss"],
})
export class ReindexModalComponent {
  isConfirmModal = false;
  constructor(
    private dialogRef: MatDialogRef<ReindexModalComponent>,
    public commonService: CommonService,
    private _hyKeyboardFocusService: HyKeyboardFocusService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  continue(): void {
    let dialogCloseData = {
      isClosed: true,
      event: ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed,
    };
    this.dialogRef.close(dialogCloseData);
  }

  close(): void {
    let dialogCloseData = {
      isClosed: true,
      event: this.data.isSuccessModal
        ? ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isLaunched
        : ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isFailed,
    };
    this.dialogRef.close(dialogCloseData);
  }

  abort(): void {
    this.dialogRef.close(false);
  }

  copyActionId(): void {
    navigator.clipboard.writeText(this.data.actionId).then(() => {
      alert("Action ID copied to clipboard!");
    });
  }
}
