import { Component, OnDestroy, OnInit } from "@angular/core";
import { StreamService } from "../../services/stream.service";
import { Subject, takeUntil } from "rxjs";
import { SharedMethodsService } from "../../../../shared/services/shared-methods.service";
import { ERROR_TYPES } from "../../../../features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { HttpErrorResponse } from "@angular/common/http";
import {
  GENERIC_API_LABELS,
  NUXEO_STREAM_PROCESSOR_INFO_LABELS,
} from "../../stream.constants";

@Component({
  selector: "app-nuxeo-stream-processor-info",
  templateUrl: "./nuxeo-stream-processor-info.component.html",
  styleUrls: ["./nuxeo-stream-processor-info.component.scss"],
  standalone: false
})
export class NuxeoStreamProcessorInfoComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  streamProcessorJsonData: unknown;
  isDataLoaded = false; // This flag is used to display a loader while fetching data and to show a 'no data found' (if data is empty) message only after the fetch is complete
  isError = false; // This flag is used to show/hide the error message and retry button in case of an error
  readonly NUXEO_STREAM_PROCESSOR_INFO_LABELS =
    NUXEO_STREAM_PROCESSOR_INFO_LABELS;
  readonly GENERIC_API_LABELS = GENERIC_API_LABELS;
  constructor(
    private streamService: StreamService,
    private sharedService: SharedMethodsService
  ) {}

  ngOnInit(): void {
    this.loadJsonData();
  }

  loadJsonData() {
    this.isDataLoaded = false;
    this.isError = false;
    this.streamService
      .getStreamProcessorInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.streamProcessorJsonData = data;
          this.isDataLoaded = true;
        },
        error: (error) => {
          this.isDataLoaded = true;
          this.isError = true;
          this.showErrorMessage(error);
        },
      });
  }

  showErrorMessage(error: HttpErrorResponse): void {
    this.sharedService.showActionErrorModal({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: (error?.error as HttpErrorResponse)?.status || error.status,
        message: (error?.error as HttpErrorResponse)?.message || error.message,
      },
    });
  }

  isValidData(data: unknown): boolean {
    if (!data) return false;
    if (Object.keys(data).length === 0) return false;
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
