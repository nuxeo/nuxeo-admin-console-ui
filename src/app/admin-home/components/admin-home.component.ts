import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AdminWarningComponent } from "src/app/adminWarning/admin-warning.component";


@Component({
  selector: "admin-home",
  templateUrl: "./admin-home.component.html",
})
export class AdminHomeComponent {
  constructor(private dialogService: MatDialog) {}

  ngOnInit() {
    console.log("From Home !");
    this.dialogService.open(AdminWarningComponent, {
      data: 'HELLO',
    });
}
}