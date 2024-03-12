import { Component, Input } from "@angular/core";
import { AdminUserInterface } from "../shared/types/adminUser.interface";

@Component({
  selector: "admin-warning",
  templateUrl: "./admin-warning.component.html",
})
export class AdminWarningComponent {
  @Input()
  getCurrentUser: AdminUserInterface = {} as AdminUserInterface;

  public currentUser: AdminUserInterface = {} as AdminUserInterface;

  constructor() {}

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser;
  }
}
