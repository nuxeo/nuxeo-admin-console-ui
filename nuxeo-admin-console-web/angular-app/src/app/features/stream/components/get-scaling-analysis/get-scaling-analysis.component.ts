import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { StreamService } from "../../services/stream.service";
import {
  GENERIC_API_LABELS,
  GET_SCALING_ANALYSIS_LABELS,
  MAIN_TAB_LABELS,
} from "../../stream.constants";
import { ERROR_TYPES } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-get-scaling-analysis",
  templateUrl: "./get-scaling-analysis.component.html",
  styleUrls: ["./get-scaling-analysis.component.scss"],
})
export class GetScalingAnalysisComponent implements OnInit, OnDestroy {
  scalingAnalysisData: any;
  destroy$: Subject<void> = new Subject<void>();
  readonly GET_SCALING_ANALYSIS_LABELS = GET_SCALING_ANALYSIS_LABELS;
  readonly MAIN_TAB_LABELS = MAIN_TAB_LABELS;
  isDataLoaded = false;
  isError = false;
  readonly GENERIC_API_LABELS = GENERIC_API_LABELS;
  constructor(
    private sharedService: SharedMethodsService,
    private streamService: StreamService
  ) {}

  ngOnInit() {
    this.loadJsonData();
  }

  loadJsonData() {
    this.isDataLoaded = false; // This flag is used to display a loader while fetching data and to show a 'no data found' (if data is empty) message only after the fetch is complete
    this.isError = false;
    this.streamService
      .getScalingAnalysis()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.scalingAnalysisData = data;
          this.isDataLoaded = true;
        },
        error: (error) => {
          this.isDataLoaded = true;
          this.isError = true;
          this.sharedService.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error.error as HttpErrorResponse)?.status || error.status,
              message: (error.error as HttpErrorResponse)?.message || error.message,
            },
          });
        },
      });
  }

  isValidData(data: any): boolean {
    if (!data) return false;
    if (Object.keys(data).length === 0) return false;
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
