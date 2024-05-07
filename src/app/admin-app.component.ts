import { AdminWarningComponent } from "./adminWarning/admin-warning.component";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AdminCommonService } from "./shared/services/admin-common.service";
import { Subscription } from "rxjs";

@Component({
  selector: "admin-app-root",
  templateUrl: "./admin-app.component.html",
  styleUrls: ["./admin-app.component.scss"],
})
export class AdminAppComponent implements OnInit, OnDestroy {
  loadApp: Boolean = false;
  loadAppSubscription = new Subscription();
  constructor(
    private dialogService: MatDialog,
    private adminCommonService: AdminCommonService
  ) {}

  ngOnInit() {
    const preference = localStorage.getItem("doNotWarn");
    if (preference === "true") {
      this.loadApp = true;
    } else {
      this.dialogService.open(AdminWarningComponent, {
        disableClose: true, // Disable closing on clicking outside
      });
      this.loadAppSubscription =
        this.adminCommonService.loadApp.subscribe((load) => {
          this.loadApp = load;
        });
    }
  }

  ngOnDestroy(): void {
    this.loadAppSubscription.unsubscribe();
  }
}
