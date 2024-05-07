import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AdminWarningComponent } from "../../adminWarning/admin-warning.component";

@Component({
  selector: "admin-home",
  templateUrl: "./admin-home.component.html",
})
export class AdminHomeComponent {
  constructor(private dialogService: MatDialog) {}

  ngOnInit() {
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
