import { Component, Input, HostListener } from "@angular/core";
import { AdminUserInterface } from "../../types/adminUser.interface";
import { MatDialog } from "@angular/material/dialog";
import { AdminCommonService } from "../../services/admin-common.service";

@Component({
  selector: "admin-warning",
  templateUrl: "./admin-warning.component.html",
  styleUrls: ["./admin-warning.component.scss"],
})
export class AdminWarningComponent {
  @Input() getCurrentUser: AdminUserInterface = {} as AdminUserInterface;
  public currentUser: AdminUserInterface = {} as AdminUserInterface;
  public doNotWarn: boolean = false;

  constructor(private dialogService: MatDialog, private adminCommonService: AdminCommonService) {}

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser;
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
