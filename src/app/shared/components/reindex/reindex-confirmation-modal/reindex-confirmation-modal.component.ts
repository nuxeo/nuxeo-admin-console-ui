import { ELASTIC_SEARCH_REINDEX_MODAL_EVENT } from './../../../../features/elastic-search-reindex/elastic-search-reindex.constants';
import { HyKeyboardFocusService } from '@hyland/ui/keyboard-focus';
import { CommonService } from './../../../services/common.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "reindex-confirmation-modal",
  templateUrl: "./reindex-confirmation-modal.component.html",
  styleUrls: ["./reindex-confirmation-modal.component.scss"],
})
export class ReindexConfirmationModalComponent {
  isConfirmModal = false;
  constructor(
    private dialogRef: MatDialogRef<ReindexConfirmationModalComponent>,
    public commonService: CommonService,
    private _hyKeyboardFocusService: HyKeyboardFocusService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    if (this.data.type === 2) {
      this.commonService.reindexDialogClosed.emit({
        isClosed: true,
        event: ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isLaunched,
      });
    }
    this.dialogRef.close(true);
  }

  abort() {
    this.dialogRef.close(false);
  }

  copyActionId() {
    navigator.clipboard.writeText(this.data.actionId).then(() => {
      alert('Action ID copied to clipboard!');
    });
  }
}
