import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AdminWarningComponent } from "./shared/components/admin-warning/admin-warning.component";
import { PersistenceService } from "./shared/services/persistence.service";

@Component({
  selector: "admin-app-root",
  templateUrl: "./admin-app.component.html",
})
export class AdminAppComponent implements OnInit {
  constructor(
    private dialogService: MatDialog,
    private persistenceService: PersistenceService
  ) {}

  ngOnInit(): void {
    const doNotWarn = !!this.persistenceService.get("doNotWarn");
    if (!doNotWarn) {
      this.dialogService.open(AdminWarningComponent, {
        disableClose: true,
      });
    }
  }
}
