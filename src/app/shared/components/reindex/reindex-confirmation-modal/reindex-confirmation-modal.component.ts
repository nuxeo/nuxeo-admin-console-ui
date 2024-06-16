import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { HyKeyboardFocusService } from "@hyland/ui/keyboard-focus";
import { ELASTIC_SEARCH_REINDEX_MODAL_EVENT } from "src/app/features/elastic-search-reindex/elastic-search-reindex.constants";
import { CommonService } from "src/app/shared/services/common.service";

@Component({
  selector: "reindex-confirmation-modal",
  templateUrl: "./reindex-confirmation-modal.component.html",
  styleUrls: ["./reindex-confirmation-modal.component.scss"],
})
export class ReindexConfirmationModalComponent implements OnInit {
  constructor(
    public dialogService: MatDialog,
    public commonService: CommonService,
    private _hyKeyboardFocusService: HyKeyboardFocusService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirm(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    if (this.data.type === 2) {
      this.commonService.reindexDialogClosed.emit({
        isClosed: true,
        event: ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isLaunched,
      });
    }
    this.dialogService.closeAll();
  }
}
