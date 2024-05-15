import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "../../../shared/services/persistence.service";
import { AdminCommonService } from "../../../shared/services/admin-common.service";

@Component({
  selector: "admin-warning",
  templateUrl: "./admin-warning.component.html",
  styleUrls: ["./admin-warning.component.scss"],
})
export class AdminWarningComponent implements OnInit {
  public doNotWarn: boolean = false;

  constructor(
    private dialogService: MatDialog,
    private persistenceService: PersistenceService,
    private adminCommonService: AdminCommonService
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
    this.adminCommonService.loadApp.emit(true);
  }

  closeDialog(): void {
    this.dialogService.closeAll();
  }
}
