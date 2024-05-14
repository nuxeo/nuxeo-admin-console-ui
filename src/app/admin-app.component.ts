import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { authActions } from "./auth/store/actions";
import { MatDialog } from "@angular/material/dialog";
import { AdminWarningComponent } from "./shared/components/admin-warning/admin-warning.component";
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
  constructor(private store: Store, private dialogService: MatDialog, private adminCommonService: AdminCommonService) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.getCurrentUser());
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
