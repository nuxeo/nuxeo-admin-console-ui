import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { authActions } from "../../auth/store/actions";
import { Observable, Subscription } from "rxjs";
import { AuthStateInterface } from "../../auth/types/authState.interface";
import { UserInterface } from "../../shared/types/user.interface";
import { NuxeoJSClientService } from "../../shared/services/nuxeo-js-client.service";
import { Router } from "@angular/router";
import { HEADER_BAR_CONSTANTS } from "./header-bar.constants"
@Component({
  selector: "header-bar",
  templateUrl: "./header-bar.component.html",
  styleUrls: ["./header-bar.component.scss"],
})
export class HeaderBarComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserInterface | null | undefined>;
  currentUserSubscription: Subscription = new Subscription();
  currentUser: UserInterface | null | undefined = undefined;
  displayName: string | undefined;
  readonly BRAND_TITLE = HEADER_BAR_CONSTANTS.BRAND_TITLE
  readonly LOGOUT = HEADER_BAR_CONSTANTS.LOGOUT

  constructor(
    private store: Store<{ auth: AuthStateInterface }>,
    private nuxeoJsClientService: NuxeoJSClientService,
    private router: Router
  ) {
    this.currentUser$ = this.store.pipe(
      select((state: { auth: AuthStateInterface }) => state?.auth?.currentUser)
    );
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.currentUser$.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
        this.setDisplayName();
      }
    );
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  onSignOut(): void {
    this.store.dispatch(authActions.signOut());
  }

  private setDisplayName(): void {
    if (this.currentUser) {
      const { firstName, lastName, username } = this.currentUser.properties;
      if (firstName && lastName) {
        this.displayName = `${firstName} ${lastName}`;
      } else if (firstName) {
        this.displayName = firstName;
      } else {
        this.displayName = username;
      }
    }
  }

  navigateToHome(): void {
    this.router.navigate(["/home"]);
  }
}
