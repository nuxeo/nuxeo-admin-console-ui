import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AdminWarningComponent } from "./shared/components/admin-warning/admin-warning.component";
import { PersistenceService } from "./shared/services/persistence.service";
import { Subscription } from "rxjs";
import { AdminCommonService } from "./shared/services/admin-common.service";

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
    private persistenceService: PersistenceService,
    private adminCommonService: AdminCommonService
  ) {}

  ngOnInit(): void {
    const doNotWarn = !!this.persistenceService.get("doNotWarn");
    if (!doNotWarn) {
      this.dialogService.open(AdminWarningComponent, {
        disableClose: true,
      });
      this.loadAppSubscription = this.adminCommonService.loadApp.subscribe(
        (load) => {
          this.loadApp = load;
        }
      );
    } else {
      this.loadApp = true;
    }
  }
  ngOnDestroy(): void {
    this.loadAppSubscription.unsubscribe();
  }
}
