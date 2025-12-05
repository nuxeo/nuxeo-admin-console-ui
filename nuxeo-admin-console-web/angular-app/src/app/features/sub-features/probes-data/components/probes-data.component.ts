import { CustomSnackBarComponent } from "./../../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { CommonService } from "../../../../shared/services/common.service";
import { PROBES, PROBES_LABELS } from "../probes-data.constants";
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subject, takeUntil, withLatestFrom } from "rxjs";
import { Store, select } from "@ngrx/store";
import { ProbeState, ProbesInfo } from "../store/reducers";
import * as ProbeActions from "../store/actions";
import { ProbeDataService } from "../services/probes-data.service";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: "probes-data",
  templateUrl: "./probes-data.component.html",
  styleUrls: ["./probes-data.component.scss"],
  standalone: false
})
export class ProbesDataComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() summary = false;
  probesData: MatTableDataSource<ProbesInfo> =
    new MatTableDataSource<ProbesInfo>([]);
  fetchProbes$: Observable<ProbesInfo[]>;
  PROBES_LABELS = PROBES_LABELS;
  columnsToDisplay: string[] = [];
  selectedRowIndex = -1;
  private destroy$: Subject<void> = new Subject<void>();
  defaultColumns = [
    { propertyName: "probe", label: "Probe", summaryOnly: true },
    { propertyName: "success", label: "Success", summaryOnly: true },
    {
      propertyName: "neverExecuted",
      label: "Last Executed",
      summaryOnly: true,
    },
    { propertyName: "information", label: "Information", summaryOnly: true },
    { propertyName: "run", label: "Run", summaryOnly: false },
    {
      propertyName: "successCount",
      label: "Success Count",
      summaryOnly: false,
    },
    {
      propertyName: "failureCount",
      label: "Failure Count",
      summaryOnly: false,
    },
    { propertyName: "time", label: "Time", summaryOnly: false },
    { propertyName: "history", label: "History", summaryOnly: false },
    { propertyName: "actions", label: "Actions", summaryOnly: false },
  ];
  hideTitle = true;
  probeLaunchedSuccess$: Observable<ProbesInfo[]>;
  probeLaunchedError$: Observable<HttpErrorResponse | null>;
  probeLaunched: ProbesInfo = {} as ProbesInfo;
  @ViewChild("paginator") paginator!: MatPaginator;
  isLaunchAllProbeSuccess$: Observable<boolean | undefined>;
  constructor(
    private store: Store<{ probes: ProbeState }>,
    private probeService: ProbeDataService,
    private commonService: CommonService,
    private _snackBar: MatSnackBar
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
    this.isLaunchAllProbeSuccess$ = this.store.pipe(
      select((state) => state.probes?.showLaunchAllSuccessSnackbar)
    );
  }
  ngOnInit(): void {
    this.columnsToDisplay = this.defaultColumns
      .filter((column) => (this.summary ? column.summaryOnly : true))
      .map((column) => column.propertyName);
    this.hideTitle = !this.defaultColumns.some(
      (col) => col.summaryOnly && this.summary
    );

    this.fetchProbes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProbesInfo[]) => {
        if (data?.length !== 0) {
          this.probesData.data = data;
        } else {
          this.store.dispatch(ProbeActions.loadProbesData());
        }
      });

    this.probeLaunchedSuccess$
      .pipe(
        withLatestFrom(this.isLaunchAllProbeSuccess$), //get latest value of isLaunchAllProbeSuccess$
        takeUntil(this.destroy$)
      )
      .subscribe(([data, showLaunchAllSuccessSnackbar]) => {
        if (
          data &&
          data?.length > 0 &&
          Object.entries(this.probeLaunched).length &&
          !showLaunchAllSuccessSnackbar /* Ensure the individual probe launch success snackbar is not shown when the 'Launch All Probes' success snackbar is triggered */
        ) {
          this._snackBar.openFromComponent(CustomSnackBarComponent, {
            data: {
              message: PROBES_LABELS.PROBE_LAUNCHED_SUCCESS.replaceAll(
                "{probeName}",
                this.probeLaunched?.name
              ),
              panelClass: "success-snack",
            },
            duration: 5000,
            panelClass: ["success-snack"],
          });
        }
      });

    this.probeLaunchedError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this._snackBar.openFromComponent(CustomSnackBarComponent, {
            data: {
              message: PROBES_LABELS.PROBE_LAUNCHED_ERROR.replaceAll(
                "{probeName}",
                this.probeLaunched?.name
              ),
              panelClass: "error-snack",
            },
            duration: 5000,
            panelClass: ["error-snack"],
          });
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
    return this.columnsToDisplay.some((column) => column === propertyName);
  }

  viewDetails(): void {
    this.commonService.redirectToProbesDetails();
  }

  launchProbe(probe: ProbesInfo): void {
    this.probeLaunched = probe;
    this.store.dispatch(ProbeActions.launchProbe({ probeName: probe.name }));
  }

  highlightRow(index: number): void {
    this.selectedRowIndex = index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.probesData.paginator = this.paginator;
  }
}
