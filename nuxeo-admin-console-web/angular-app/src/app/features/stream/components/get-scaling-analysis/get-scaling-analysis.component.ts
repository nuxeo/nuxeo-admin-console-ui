import { Component, OnInit } from "@angular/core";
import { ScalingAnalysisState } from "../../store/reducers";
import { delay, Subject, takeUntil } from "rxjs";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { Store } from "@ngrx/store";
import { StreamService } from "../../services/stream.service";
import {
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
export class GetScalingAnalysisComponent implements OnInit {
  scalingAnalysisData: any;
  destroy$: Subject<void> = new Subject<void>();
  readonly GET_SCALING_ANALYSIS_LABELS = GET_SCALING_ANALYSIS_LABELS;
  readonly MAIN_TAB_LABELS = MAIN_TAB_LABELS;
  isDataLoaded = false;
  constructor(
    private sharedService: SharedMethodsService,
    private streamService: StreamService
  ) {}

  ngOnInit() {
    this.isDataLoaded = false; // This flag is used to display a loader while fetching data and to show a 'no data found' (if data is empty) message only after the fetch is complete
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
          this.sharedService.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error as HttpErrorResponse)?.status,
              message: (error as HttpErrorResponse)?.message,
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
}
