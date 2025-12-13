import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PersistenceService } from "../../shared/services/persistence.service";
import { CommonService } from "../../shared/services/common.service";
import { Store, select } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthStateInterface } from '../../auth/types/authState.interface';
import { UserInterface } from '../../shared/types/user.interface';
import { WARNING_DIALOG_CONSTANTS } from './warning.constants'; 

@Component({
  selector: "warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
  standalone: false
})
export class WarningComponent implements OnInit, OnDestroy {
  dialogService = inject(MatDialog);
  persistenceService = inject(PersistenceService);
  commonService = inject(CommonService);
  private store = inject<
    Store<{
      auth: AuthStateInterface;
    }>
  >(Store);
  public doNotWarn = false;
  public currentUser$: Observable<UserInterface | null | undefined>;
  public currentUser: UserInterface | null | undefined = undefined;
  public WARNING_LABELS = WARNING_DIALOG_CONSTANTS;
  private destroy$: Subject<void> = new Subject<void>();
  constructor() {
    this.currentUser$ = this.store.pipe(select((state: { auth: AuthStateInterface }) => state?.auth?.currentUser));
  }

  ngOnInit(): void {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
