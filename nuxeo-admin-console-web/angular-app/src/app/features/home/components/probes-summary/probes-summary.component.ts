import { PROBES, PROBES_LABELS } from "./../../home.constants";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { HomeState, ProbesInfo } from "../../store/reducers";
import * as HomeActions from "../../store/actions";

@Component({
  selector: "probes-summary",
  templateUrl: "./probes-summary.component.html",
  styleUrls: ["./probes-summary.component.scss"],
})
export class ProbesSummaryComponent implements OnInit, OnDestroy {
  probesData: ProbesInfo[] = [];
  fetchProbesSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  isLoading = true;
  // spinnerVisible = false;
  PROBES_LABELS = PROBES_LABELS;
  constructor(private store: Store<{ home: HomeState }>) {
    this.fetchProbes$ = this.store.pipe(
      select((state) => state.home?.probesInfo)
    );
  }

  ngOnInit(): void {
    // this.spinnerVisible = true;
    this.fetchProbesSubscription = this.fetchProbes$.subscribe(
      (data: ProbesInfo[]) => {
        if (data?.length !== 0) {
          setTimeout(() => {
            this.probesData = data;
            this.isLoading = false;
            // this.spinnerVisible = false;
          }, 3000);
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

  getImageSrc(successStatus: string): string {
    switch (String(successStatus).toLowerCase()) {
      case PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE.VALUE:
        return PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE.PATH;
      case PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN.VALUE:
        return PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN.PATH;
      case PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE.VALUE:
        return PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE.PATH;
      default:
        return PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN.PATH;
    }
  }

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
  }
}
