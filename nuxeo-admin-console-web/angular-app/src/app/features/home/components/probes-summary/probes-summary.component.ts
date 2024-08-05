import { PROBES, PROBES_LABELS } from "./../../home.constants";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { HomeState, ProbesInfo } from "../../store/reducers";
import * as HomeActions from "../../store/actions";
import { HomeService } from "../../services/home.service";
@Component({
  selector: "probes-summary",
  templateUrl: "./probes-summary.component.html",
  styleUrls: ["./probes-summary.component.scss"],
})
export class ProbesSummaryComponent implements OnInit, OnDestroy {
  probesData: ProbesInfo[] = [];
  fetchProbesSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  PROBES_LABELS = PROBES_LABELS;
  constructor(
    private store: Store<{ home: HomeState }>,
    private homeService: HomeService
  ) {
    this.fetchProbes$ = this.store.pipe(
      select((state) => state.home?.probesInfo)
    );
  }

  ngOnInit(): void {
    this.fetchProbesSubscription = this.fetchProbes$.subscribe(
      (data: ProbesInfo[]) => {
        if (data?.length !== 0) {
          this.probesData = data;
        } else {
          this.store.dispatch(HomeActions.fetchProbesInfo());
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
    return this.homeService.convertoTitleCase(probeStatus.toString());
  }

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
  }
}
