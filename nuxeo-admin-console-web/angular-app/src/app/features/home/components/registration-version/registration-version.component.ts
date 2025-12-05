import { versionInfo } from "./../../../../shared/types/version-info.interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, takeUntil } from "rxjs";
import * as HomeActions from "../../store/actions";
import { HomeState, InstanceState } from "../../store/reducers";
import { HttpErrorResponse } from "@angular/common/http";
import { INSTANCE_INFO_LABELS, INSTANCE_INFO_DATA_LABELS, REGISTRATION_VERSION_LABELS } from "./../../../../features/home/home.constants"; 
import { ERROR_TYPES } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { InstanceInfo } from "../../../../shared/types/instanceInfo.interface";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";

@Component({
  selector: "registration-version",
  templateUrl: "./registration-version.component.html",
  styleUrls: ["./registration-version.component.scss"],
  standalone: false
})
export class RegistrationVersionComponent implements OnInit, OnDestroy {
  versionInfo$: Observable<versionInfo>;
  error$: Observable<HttpErrorResponse | null>;
  versionInformation: versionInfo | null = null;
  REGISTRATION_VERSION_LABELS = REGISTRATION_VERSION_LABELS;
  private destroy$: Subject<void> = new Subject<void>();
  instanceInfo$!: Observable<InstanceInfo | null>;
  instanceInfoFailure$!: Observable<HttpErrorResponse | null>;
  instanceInformation: InstanceInfo | null = null;
  INSTANCE_INFO_LABEL = INSTANCE_INFO_LABELS;
  INSTANCE_INFO_DATA_LABELS = INSTANCE_INFO_DATA_LABELS;
  constructor(
    private store: Store<{ home: HomeState; instanceInfo: InstanceState }>,
    private sharedMethodsService: SharedMethodsService
  ) {
    this.versionInfo$ = this.store.pipe(
      select((state) => state.home?.versionInfo)
    );
    this.error$ = this.store.pipe(select((state) => state.home?.error));

    this.instanceInfo$ = this.store.pipe(
      select((state) => state.instanceInfo?.instanceInfo)
    );
    this.instanceInfoFailure$ = this.store.pipe(
      select((state) => state.instanceInfo?.instanceInfoError)
    );
  }

  ngOnInit(): void {
    this.versionInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: versionInfo) => {
        if (data && Object.keys(data).length > 0) {
          this.versionInformation = data;
        } else {
          this.store.dispatch(HomeActions.fetchversionInfo());
        }
      });
      
    this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      if (error) {
        this.sharedMethodsService.showActionErrorModal({
          type: ERROR_TYPES.SERVER_ERROR,
          details: {
            status: (error?.error as HttpErrorResponse)?.status || error.status,
            message: (error?.error as HttpErrorResponse)?.message || error.message,
          },
        });
      }
    });

    this.instanceInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: InstanceInfo | null) => {
        if (data && Object.keys(data).length > 0) {
          this.instanceInformation = data;
        } else {
          this.store.dispatch(HomeActions.fetchInstanceInfo());
        }
      });

    this.instanceInfoFailure$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: HttpErrorResponse | null) => {
        if (error) {
          this.sharedMethodsService.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error?.error as HttpErrorResponse)?.status || error.status,
              message: (error?.error as HttpErrorResponse)?.message || error.message,
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}