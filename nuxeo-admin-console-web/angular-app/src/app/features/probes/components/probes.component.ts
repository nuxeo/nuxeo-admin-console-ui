import { PROBES, PROBES_LABELS } from "../../home/home.constants";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { ProbeState, ProbesInfo } from "../store/reducers";
import * as ProbeActions from "../store/actions";
import { ProbeService } from "../services/probes.service";

@Component({
  selector: "probes",
  templateUrl: "./probes.component.html",
  styleUrls: ["./probes.component.scss"],
})
export class ProbesComponent implements OnInit, OnDestroy {
  probesData: ProbesInfo[] = [];
  fetchProbesSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  PROBES_LABELS = PROBES_LABELS;

  constructor(
    private store: Store<{ probes: ProbeState }>,
    private probeService: ProbeService
  ) {
    this.fetchProbes$ = this.store.pipe(
      select((state) => state.probes?.probesInfo)
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

  

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
  }
}
