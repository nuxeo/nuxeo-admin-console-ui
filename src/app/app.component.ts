import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "./shared/services/persistence.service";
import { Subscription } from "rxjs";
import { CommonService } from "./shared/services/common.service";
import { WarningComponent } from "./features/warning/warning.component";

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadApp: Boolean = false;
  loadAppSubscription = new Subscription();
  constructor(
    public dialogService: MatDialog,
    public persistenceService: PersistenceService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    const doNotWarn = !!this.persistenceService.get("doNotWarn");
    if (!doNotWarn) {
      this.dialogService.open(WarningComponent, {
        disableClose: true,
      });
      this.loadAppSubscription = this.commonService.loadApp.subscribe(
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