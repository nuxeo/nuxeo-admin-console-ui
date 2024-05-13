import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { authActions } from "./auth/store/actions";

@Component({
  selector: "admin-app-root",
  templateUrl: "./admin-app.component.html",
})
export class AdminAppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.getCurrentUser());
  }
}
