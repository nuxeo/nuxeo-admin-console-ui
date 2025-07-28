import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { CONSUMER_THREAD_POOL_LABELS, STREAM_LABELS } from "../stream.constants";
import { filter, Observable, skip, Subject, takeUntil } from "rxjs";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../store/reducers";
import { StreamService } from "../services/stream.service";
import { HttpErrorResponse } from "@angular/common/http";
import * as StreamActions from "../store/actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackBarComponent } from "../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "stream",
  templateUrl: "./stream.component.html",
  styleUrls: ["./stream.component.scss"],
})
export class StreamComponent implements OnInit, OnDestroy {
  pageTitle = STREAM_LABELS.STREAM_PAGE_TITLE;
  CONSUMER_THREAD_POOL_LABELS = CONSUMER_THREAD_POOL_LABELS;
  records: { type?: string }[] = [];
  fetchRecordsSuccess$!: Observable<{ type?: string }[]>;
  fetchRecordsError$!: Observable<HttpErrorResponse | null>;
  recordCount = 0;
  clearRecordsDisplay = false;
  recordsFetchedStatusText = "";
  stopFetchSuccess$: Observable<boolean | null>;
  stopFetchError$: Observable<unknown>;
  isStopFetchSuccess: boolean | null = null;
  isFetchingRecords = false;
  selectedTabIndex = 0;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private store: Store<{ streams: StreamsState }>,
    private cdRef: ChangeDetectorRef,
    private streamService: StreamService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) {

    this.fetchRecordsSuccess$ = this.store.pipe(
      select((state) => state?.streams?.records)
    );

    this.fetchRecordsError$ = this.store.pipe(
      select((state) => state.streams?.recordsError)
    );

    this.stopFetchSuccess$ = this.store.pipe(
      select((state) => state.streams?.isFetchStopped),
      skip(1)
    );

    this.stopFetchError$ = this.store.pipe(
      select((state) => state.streams?.isFetchStoppedError),
      skip(1)
    );
  }

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.updateActiveTab(event.urlAfterRedirects || event.url);
      }); // Update active tab on navigation end
      this.streamService.isFetchingRecords.pipe(takeUntil(this.destroy$)).subscribe(
        (status) => {
          this.isFetchingRecords = status;
          this.streamService.isViewRecordsDisabled.next(this.isFetchingRecords);
          this.streamService.isStopFetchDisabled.next(!this.isFetchingRecords);
          if (this.isFetchingRecords) {
            this.recordsFetchedStatusText = STREAM_LABELS.FETCHING_RECORDS;
          } else {
            if (this.records?.length === 0) {
              this.recordsFetchedStatusText = "";
            } else {
              this.streamService.isClearRecordsDisabled.next(false);
              this.recordsFetchedStatusText =  STREAM_LABELS.FETCHED_RECORDS_COUNT.replace('{{ recordCount }}', this.recordCount.toString());
            }
          }
          this.cdRef.detectChanges();
        }
      );

      this.streamService.clearRecordsDisplay.pipe(takeUntil(this.destroy$)).subscribe(
        (clearStatus) => {
          if (this.records?.length > 0) {
            this.clearRecordsDisplay = clearStatus;
          } else {
            this.clearRecordsDisplay = true;
          }
        }
      );

    this.fetchRecordsSuccess$.pipe(takeUntil(this.destroy$)).subscribe(
      (data: { type?: string }[]) => {
        this.records = data;
        this.recordsFetchedStatusText = this.isFetchingRecords ? STREAM_LABELS.FETCHING_RECORDS : STREAM_LABELS.FETCHED_RECORDS_COUNT.replace('{{ recordCount }}', this.recordCount.toString());
        this.records = data as { type?: string }[];
        this.recordCount = this.getRecordCount();
        this.cdRef.detectChanges();
      }
    );

    this.fetchRecordsError$.pipe(takeUntil(this.destroy$)).subscribe(
      (error) => {
        if (error) {
          console.error(error);
          this.streamService.isViewRecordsDisabled.next(false);
          this.streamService.isClearRecordsDisabled.next(false);
          this.streamService.isStopFetchDisabled.next(true);
        }
      }
    );

      this.stopFetchSuccess$.pipe(takeUntil(this.destroy$)).subscribe(
        (status: boolean | null) => {
          this.isStopFetchSuccess = status;
          this._snackBar.openFromComponent(CustomSnackBarComponent, {
            data: {
              message: STREAM_LABELS.STOPPED_FETCHING_RECORDS,
              panelClass: "success-snack",
            },
            duration: 5000,
            panelClass: ["success-snack"],
          });
          this.streamService.isStopFetchDisabled.next(true);
          this.streamService.isViewRecordsDisabled.next(false);
          this.store.dispatch(StreamActions.resetStopFetchState());
        }
      );

      this.stopFetchError$.pipe(takeUntil(this.destroy$)).subscribe(
        (error: unknown) => {
          this.isStopFetchSuccess = false;
          console.error(error);
        }
      );
  }

  getRecordCount(): number {
    return this.records
      .filter((r: { type?: string }) => r?.type === "record")
      .length;

  }

  onTabChange(value: any): void {
    // Navigate based on the selected tab
    switch (value) {
      case CONSUMER_THREAD_POOL_LABELS.STREAM.ID:
        this.router.navigate([CONSUMER_THREAD_POOL_LABELS.STREAM.LABEL]);
        break;
      case CONSUMER_THREAD_POOL_LABELS.CONSUMER.ID:
        this.router.navigate([CONSUMER_THREAD_POOL_LABELS.CONSUMER.LABEL], {
          relativeTo: this.route,
        });
        break;
      default:
        break;
    }
  }

  updateActiveTab(url: string): void {
    // Update the active tab based on the current URL
    const lastSegment = url?.split("/").pop();
    if (
      lastSegment &&
      lastSegment === CONSUMER_THREAD_POOL_LABELS.CONSUMER.LABEL
    ) {
      this.selectedTabIndex = CONSUMER_THREAD_POOL_LABELS.CONSUMER.ID;
    } else {
      this.selectedTabIndex = CONSUMER_THREAD_POOL_LABELS.STREAM.ID;
    }
  }
  
  ngOnDestroy(): void {
    this.store.dispatch(StreamActions.resetStopFetchState());
    this.store.dispatch(StreamActions.resetFetchStreamsState());
    this.store.dispatch(StreamActions.resetFetchConsumersState());
    this.store.dispatch(StreamActions.resetFetchRecordsState());
    this.streamService.isStopFetchDisabled.next(true);
    this.streamService.isViewRecordsDisabled.next(false);
    this.streamService.isClearRecordsDisabled.next(true);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
