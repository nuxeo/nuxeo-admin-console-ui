import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { authActions } from "./auth/store/actions";
import { MatDialog } from "@angular/material/dialog";
import { AdminWarningComponent } from "./adminWarning/admin-warning.component";

@Component({
  selector: "admin-app-root",
  templateUrl: "./admin-app.component.html",
})
export class AdminAppComponent implements OnInit {
  constructor(private store: Store, private dialogService: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.getCurrentUser());
    console.log("From Home !");
    const preference = localStorage.getItem("doNotWarn");
    if (preference === "true") {
      console.log("warning check");
    } else {
      this.dialogService.open(AdminWarningComponent, {
        disableClose: true, // Disable closing on clicking outside
      });
    }
  }
}
