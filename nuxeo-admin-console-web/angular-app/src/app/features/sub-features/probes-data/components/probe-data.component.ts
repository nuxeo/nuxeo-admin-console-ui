import { PROBES, PROBES_LABELS } from "../probes-data.constants";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { ProbeState, ProbesInfo } from "../store/reducers";
import * as ProbeActions from "../store/actions";
import { ProbeDataService } from "../services/probes-data.service";

@Component({
  selector: "probes-data",
  templateUrl: "./probes-data.component.html",
  styleUrls: ["./probes-data.component.scss"],
})
export class ProbesDataComponent implements OnInit, OnDestroy {
  @Input() summary = false; 
  probesData: ProbesInfo[] = [];
  fetchProbesSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  PROBES_LABELS = PROBES_LABELS;
  columnsToDisplay: { propertyName: string; label: string }[] = [];

  defaultColumns = [
    { propertyName: 'probe', label: 'Probe', summaryOnly: true },
    { propertyName: 'success', label: 'Success', summaryOnly: true },
    { propertyName: 'neverExecuted', label: 'Last Executed', summaryOnly: true },
    { propertyName: 'information', label: 'Information', summaryOnly: true },
    { propertyName: 'run', label: 'Run', summaryOnly: false },
    { propertyName: 'successCount', label: 'Success Count', summaryOnly: false },
    { propertyName: 'failureCount', label: 'Failure Count', summaryOnly: false },
    { propertyName: 'time', label: 'Time', summaryOnly: false },
    { propertyName: 'history', label: 'History', summaryOnly: false }
  ];

  hideTitle = true;

  constructor(
    private store: Store<{ probes: ProbeState }>,
    private probeService: ProbeDataService
  ) {
    this.fetchProbes$ = this.store.pipe(select((state) => state.probes?.probesInfo));
  }

  ngOnInit(): void {
    this.columnsToDisplay = this.defaultColumns.filter(column => 
      this.summary ? column.summaryOnly : true
    );

    this.hideTitle = !this.defaultColumns.some(col => col.summaryOnly && this.summary);

    this.fetchProbesSubscription = this.fetchProbes$.subscribe((data: ProbesInfo[]) => {
      if (data?.length !== 0) {
        this.probesData = data;
      } else {
        this.store.dispatch(ProbeActions.loadProbesData());
      }
    });
  }

  deriveProbeDisplayName(probeName: string): string {
    const probe = PROBES.find((probe) => probe.name === probeName);
    return probe ? probe.displayName : probeName;
  }

  determineImageSource(neverExecuted: boolean, successStatus: boolean): string {
    if (neverExecuted) {
      return PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN;
    }
    return successStatus
      ? PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE
      : PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE;
  }

  formatTooltipText(probeStatus: string | boolean): string {
    return this.probeService.formatToTitleCase(probeStatus.toString());
  }

  isColumnVisible(propertyName: string): boolean {
    return this.columnsToDisplay.some(column => column.propertyName === propertyName);
  }

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
  }
}
