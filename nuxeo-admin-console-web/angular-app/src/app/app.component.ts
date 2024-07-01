import { NuxeoJSClientService } from './shared/services/nuxeo-js-client.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "./shared/services/persistence.service";
import { Subscription, Observable } from "rxjs";
import { CommonService } from "./shared/services/common.service";
import { WarningComponent } from "./features/warning/warning.component";
import { Store, select } from "@ngrx/store";
import { authActions } from "./auth/store/actions";
import { AuthStateInterface } from "./auth/types/authState.interface";
import { UserInterface } from './shared/types/user.interface';

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
  constructor(
    public dialogService: MatDialog,
    public persistenceService: PersistenceService,
    public commonService: CommonService,
    private nuxeoJsClientService: NuxeoJSClientService,
    private store: Store<{ auth: AuthStateInterface }>
  ) {
    this.currentUser$ = this.store.pipe(select((state: { auth: AuthStateInterface }) => state.auth.currentUser));
  }

  ngOnInit(): void {
    this.nuxeoJsClientService.initiateJSClient();
    this.currentUserSubscription = this.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
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
  ngOnDestroy(): void {
    this.loadAppSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }
}