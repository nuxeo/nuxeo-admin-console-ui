import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { authActions } from '../../auth/store/actions';

@Component({
  selector: "header-bar",
  templateUrl: "./header-bar.component.html",
  styleUrls: ["./header-bar.component.scss"],
})
export class HeaderBarComponent {
  constructor(private store: Store) { }

  onSignOut(): void {
    this.store.dispatch(authActions.signOut());
  }
}
