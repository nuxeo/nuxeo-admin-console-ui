import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { selectCurrentUser } from "../auth/store/reducers";

@Component({
  selector: "admin-header",
  templateUrl: "./admin-header.component.html",
})
export class AdminHeaderComponent {
  data$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
  });
  constructor(private store: Store) {}
}
