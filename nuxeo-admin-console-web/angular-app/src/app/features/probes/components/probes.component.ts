import { PROBES, PROBES_LABELS } from "../../home/home.constants";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { ProbeState, ProbesInfo } from "../store/reducers";
import * as ProbeActions from "../store/actions";
import { ProbeService } from "../services/probes.service";
import { HyToastService } from "@hyland/ui";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "probes",
  templateUrl: "./probes.component.html",
  styleUrls: ["./probes.component.scss"],
})
export class ProbesComponent implements OnInit, OnDestroy {
  probesData: ProbesInfo[] = [];
  fetchProbesSubscription = new Subscription();
  probeLaunchedSuccessSubscription = new Subscription();
  probeLaunchedErrorSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  probeLaunchedSuccess$: Observable<ProbesInfo[]>;
  probeLaunchedError$: Observable<HttpErrorResponse | null>;
  PROBES_LABELS = PROBES_LABELS;
  probeLaunched: ProbesInfo = {} as ProbesInfo;

  constructor(
    private store: Store<{ probes: ProbeState }>,
    private probeService: ProbeService,
    private toastService: HyToastService
  ) {
    this.fetchProbes$ = this.store.pipe(
      select((state) => state.probes?.probesInfo)
    );
    this.probeLaunchedSuccess$ = this.store.pipe(
      select((state) => state.probes?.probesInfo)
    );
    this.probeLaunchedError$ = this.store.pipe(
      select((state) => state.probes?.error)
    );
  }

  ngOnInit(): void {
    this.fetchProbesSubscription = this.fetchProbes$.subscribe(
      (data: ProbesInfo[]) => {
        if (data?.length !== 0) {
          this.probesData = data;
        } else {
          this.store.dispatch(ProbeActions.fetchProbesInfo());
        }
      }
    );

    this.probeLaunchedSuccessSubscription =
      this.probeLaunchedSuccess$.subscribe((data) => {
        if (data && data?.length > 0 && Object.entries(this.probeLaunched).length > 0) {
          this.toastService.success(
            PROBES_LABELS.PROBE_LAUNCHED_SUCCESS.replaceAll(
              "{probeName}",
              this.probeLaunched?.name
            ),
            {
              canBeDismissed: true,
            }
          );
        }
      });

    this.probeLaunchedErrorSubscription = this.probeLaunchedError$.subscribe(
      (error) => {
        if (error) {
          this.toastService.error(
            PROBES_LABELS.PROBE_LAUNCHED_ERROR.replaceAll(
              "{probeName}",
              this.probeLaunched?.name
            ),
            {
              canBeDismissed: true,
            }
          );
        }
      }
    );
  }

  getProbeDisplayName(probeName: string): string {
    const probe = PROBES.find((probe) => probe.name === probeName);
    return probe ? probe.displayName : probeName;
  }

  getImageSrc(neverExecuted: boolean, successStatus: boolean): string {
    if (neverExecuted) {
      return PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN;
    }
    return successStatus
      ? PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE
      : PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE;
  }

  getTooltipAltText(probeStatus: string | boolean): string {
    return this.probeService.convertoTitleCase(probeStatus.toString());
  }

  launchProbe(probe: ProbesInfo): void {
    this.probeLaunched = probe;
    this.store.dispatch(ProbeActions.launchProbe({ probeName: probe.name }));
  }

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
    this.probeLaunchedSuccessSubscription?.unsubscribe();
    this.probeLaunchedErrorSubscription?.unsubscribe();
  }
}
