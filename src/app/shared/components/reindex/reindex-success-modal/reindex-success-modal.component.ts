import { ELASTIC_SEARCH_REINDEX_MODAL_EVENT } from "./../../../../features/elastic-search-reindex/elastic-search-reindex.constants";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { HyKeyboardFocusService } from "@hyland/ui/keyboard-focus";
import { CommonService } from "src/app/shared/services/common.service";

@Component({
  selector: "reindex-success-modal",
  templateUrl: "./reindex-success-modal.component.html",
  styleUrls: ["./reindex-success-modal.component.scss"],
})
export class ReindexSuccessModalComponent implements OnInit {
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

  onAbort(): void {
    this.dialogService.closeAll();
  }

  closeDialog(): void {
    if (this.data.type === 1) {
      this.commonService.reindexDialogClosed.emit({
        isClosed: true,
        event: ELASTIC_SEARCH_REINDEX_MODAL_EVENT.isConfirmed,
      });
    }
    this.dialogService.closeAll();
  }
}
