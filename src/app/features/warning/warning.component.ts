import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "../../shared/services/persistence.service";
import { CommonService } from "../../shared/services/common.service";
import { HyKeyboardFocusService } from "@hyland/ui/keyboard-focus";

@Component({
  selector: "warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
})
export class WarningComponent implements OnInit {
  public doNotWarn: boolean = false;

  constructor(
    public dialogService: MatDialog,
    public persistenceService: PersistenceService,
    public commonService: CommonService,
    private _hyKeyboardFocusService: HyKeyboardFocusService
  ) {}

  ngOnInit(): void {
    const preference = this.persistenceService.get("doNotWarn");
    this.doNotWarn = !!preference && preference === "true";
  }

  onConfirm(): void {
    if (this.doNotWarn) {
      this.persistenceService.set("doNotWarn", "true");
    }
    this.closeDialog();
    this.commonService.loadApp.emit(true);
  }

  closeDialog(): void {
    this.dialogService.closeAll();
  }
}
