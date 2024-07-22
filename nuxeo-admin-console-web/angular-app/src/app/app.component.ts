import { NuxeoJSClientService } from './shared/services/nuxeo-js-client.service';
import { Component, OnDestroy, OnInit, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "./shared/services/persistence.service";
import { Subscription, Observable } from "rxjs";
import { CommonService } from "./shared/services/common.service";
import { WarningComponent } from "./features/warning/warning.component";
import { Store, select } from "@ngrx/store";
import { authActions } from "./auth/store/actions";
import { AuthStateInterface } from "./auth/types/authState.interface";
import { UserInterface } from './shared/types/user.interface';
import { APP_CONSTANTS } from './app.constants';

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadApp = false;
  loadAppSubscription = new Subscription();
  currentUser$: Observable<UserInterface | null | undefined>;
  currentUserSubscription: Subscription = new Subscription();
  currentUser: UserInterface | null | undefined = undefined;
  baseUrl: string | null = null;
  readonly UNAUTHORIZED_MESSAGE = APP_CONSTANTS.UNAUTHORIZED_MESSAGE;
  readonly LOGIN_WITH_DIFFERENT_ACCOUNT = APP_CONSTANTS.LOGIN_WITH_DIFFERENT_ACCOUNT;

  constructor(
    public dialogService: MatDialog,
    public persistenceService: PersistenceService,
    public commonService: CommonService,
    private nuxeoJsClientService: NuxeoJSClientService,
    private store: Store<{ auth: AuthStateInterface }>,
    private elementRef: ElementRef
  ) {
    this.currentUser$ = this.store.pipe(select((state: { auth: AuthStateInterface }) => state?.auth?.currentUser));
    this.baseUrl = this.elementRef.nativeElement.getAttribute('baseUrl');
  }

  ngOnInit(): void {
    this.nuxeoJsClientService.initiateJSClient(this.baseUrl);
    this.currentUserSubscription = this.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser?.isAdministrator) {
        const preferenceKey = `doNotWarn-${this.currentUser.id}`;
        const doNotWarn = !!this.persistenceService.get(preferenceKey);
        if (!doNotWarn) {
          this.dialogService.open(WarningComponent, {
            disableClose: true,
          });
          this.loadAppSubscription = this.commonService.loadApp.subscribe(load => {
            this.loadApp = load;
          });
        } else {
          this.loadApp = true;
        }
      }
    });

    this.store.dispatch(authActions.getCurrentUser());
  }

  onSignOut(): void {
    this.store.dispatch(authActions.signOut());
  }

  ngOnDestroy(): void {
    this.loadAppSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }
}