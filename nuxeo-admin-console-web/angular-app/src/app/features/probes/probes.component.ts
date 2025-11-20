import { PROBES_LABELS } from "../sub-features/probes-data/probes-data.constants";
import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subject, Subscription, takeUntil } from "rxjs";
import {
  ProbesInfo,
  ProbeState,
} from "../sub-features/probes-data/store/reducers";
import { HttpErrorResponse } from "@angular/common/http";
import { resetLaunchAllProbesState } from "../sub-features/probes-data/store/actions";
import { SharedMethodsService } from "../../shared/services/shared-methods.service";
import { Actions, ofType } from "@ngrx/effects";
import * as ProbeActions from "../sub-features/probes-data/store/actions";

@Component({
  selector: "probes",
  templateUrl: "./probes.component.html",
  styleUrls: ["./probes.component.scss"],
})
export class ProbesComponent {
  PROBES_LABELS = PROBES_LABELS;
  fetchProbesSubscription = new Subscription();
  launchAllProbesError$: Observable<HttpErrorResponse | null>;
  isLaunchingAllProbesSuccess = false;
  destroy$: Subject<void> = new Subject<void>();
  isCheckAllProbesBtnDisabled!: boolean;
  probesData$: Observable<ProbesInfo[] | null>;
  constructor(
    private store: Store<{ probes: ProbeState }>,
    private sharedMethodsService: SharedMethodsService,
    private actions$: Actions
  ) {
    this.launchAllProbesError$ = this.store.select(
      (state) => state.probes?.launchAllProbeError
    );

    this.probesData$ = this.store.select((state) => state.probes?.probesInfo);
  }

  ngOnInit() {
    this.actions$
      .pipe(
        ofType(ProbeActions.launchAllProbesSuccess),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.sharedMethodsService.showSuccessSnackBar(
          PROBES_LABELS.LAUNCH_ALL_PROBES.SUCCESS_MESSAGE
        );
      });

    this.launchAllProbesError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.sharedMethodsService.showErrorSnackBar(
            PROBES_LABELS.LAUNCH_ALL_PROBES.ERROR_MESSAGE
          );
        }
      });

    this.probesData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (!data || data.length === 0) {
        this.isCheckAllProbesBtnDisabled = true;
      } else {
        this.isCheckAllProbesBtnDisabled = false;
      }
    });
  }

  launchAllProbes() {
    this.store.dispatch(ProbeActions.launchAllProbes());
  }

  ngOnDestroy() {
    this.store.dispatch(resetLaunchAllProbesState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
