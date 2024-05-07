import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AdminCommonService } from "../shared/services/admin-common.service";

@Component({
  selector: "admin-warning",
  templateUrl: "./admin-warning.component.html",
  styleUrls: ["./admin-warning.component.css"],
})
export class AdminWarningComponent {
  public doNotWarn: boolean = false;

  constructor(
    private dialogService: MatDialog,
    private adminCommonService: AdminCommonService
  ) {}

  ngOnInit(): void {
    const preference = localStorage.getItem("doNotWarn");
    if (preference === "true") {
      this.doNotWarn = true;
    }
  }

  onConfirm() {
    if (this.doNotWarn) {
      localStorage.setItem("doNotWarn", "true");
    }
    this.closeDialog();
    this.adminCommonService.loadApp.emit(true);
  }

  closeDialog() {
    this.dialogService.closeAll();
  }
}
