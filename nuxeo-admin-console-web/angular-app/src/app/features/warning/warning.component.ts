import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "../../shared/services/persistence.service";
import { CommonService } from "../../shared/services/common.service";
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthStateInterface } from '../../auth/types/authState.interface';
import { UserInterface } from '../../shared/types/user.interface';
import { WARNING_DIALOG_CONSTANTS } from './warning,constants'; 

@Component({
  selector: "warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
})
export class WarningComponent implements OnInit {
  public doNotWarn = false;
  public currentUser$: Observable<UserInterface | null | undefined>;
  public currentUser: UserInterface | null | undefined = undefined;
  public WARNING_LABELS = WARNING_DIALOG_CONSTANTS;

  constructor(
    public dialogService: MatDialog,
    public persistenceService: PersistenceService,
    public commonService: CommonService,
    private store: Store<{ auth: AuthStateInterface }>
  ) {
    this.currentUser$ = this.store.pipe(select((state: { auth: AuthStateInterface }) => state?.auth?.currentUser));
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        const preferenceKey = `doNotWarn-${this.currentUser.id}`;
        const preference = this.persistenceService.get(preferenceKey);
        this.doNotWarn = !!preference && preference === 'true';
      }
    });
  }

  onConfirm(): void {
    if (this.currentUser && this.doNotWarn) {
      const preferenceKey = `doNotWarn-${this.currentUser.id}`;
      this.persistenceService.set(preferenceKey, 'true');
    }
    this.closeDialog();
    this.commonService.loadApp.emit(true);
  }

  closeDialog(): void {
    this.dialogService.closeAll();
  }
}
