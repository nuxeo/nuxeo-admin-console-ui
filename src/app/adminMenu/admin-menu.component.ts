import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { selectCurrentUser } from "../auth/store/reducers";

@Component({
  selector: "admin-menu",
  templateUrl: "./admin-menu.component.html",
})
export class AdminMenuComponent {
  data$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
  });
  constructor(private store: Store) {}
}
