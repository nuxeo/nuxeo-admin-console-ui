import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { STREAM_LABELS } from "../stream.constants";
import { Observable, skip, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../store/reducers";
import { StreamService } from "../services/stream.service";
import { HttpErrorResponse } from "@angular/common/http";
import * as StreamActions from "../store/actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackBarComponent } from "../../../shared/components/custom-snack-bar/custom-snack-bar.component";

@Component({
  selector: "stream",
  templateUrl: "./stream.component.html",
  styleUrls: ["./stream.component.scss"],
})
export class StreamComponent implements OnInit, OnDestroy {
  pageTitle = STREAM_LABELS.STREAM_PAGE_TITLE;
  records: { type?: string }[] = [];
  fetchRecordsErrorSubscription = new Subscription();
  fetchRecordsSuccessSubscription = new Subscription();
  fetchRecordsSuccess$!: Observable<{ type?: string }[]>;
  fetchRecordsError$!: Observable<HttpErrorResponse | null>;
  recordCount = 0;
  clearRecordsDisplaySubscription: Subscription = new Subscription();
  clearRecordsDisplay = false;
  recordsFetchedStatusText = "";
  stopFetchSuccess$: Observable<boolean | null>;
  stopFetchError$: Observable<unknown>;
  isStopFetchSuccess: boolean | null = null;
  isStopFetchSuccessSubscription: Subscription = new Subscription();
  isStopFetchErrorSubscription: Subscription = new Subscription();
  isFetchingRecords = false;
  isFetchingRecordsSubscription: Subscription = new Subscription();

  constructor(private store: Store<{ streams: StreamsState }>,
    private cdRef: ChangeDetectorRef,
    private streamService: StreamService,
    private _snackBar: MatSnackBar,) {

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
    this.isFetchingRecordsSubscription =
      this.streamService.isFetchingRecords.subscribe(
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
              this.recordsFetchedStatusText = this.isFetchingRecords ? STREAM_LABELS.FETCHING_RECORDS : STREAM_LABELS.FETCHED_RECORDS_COUNT.replace('{{ recordCount }}', this.recordCount.toString());
            }
          }
          this.cdRef.detectChanges();
        }
      );


    this.clearRecordsDisplaySubscription =
      this.streamService.clearRecordsDisplay.subscribe(
        (clearStatus) => {
          if (this.records?.length > 0) {
            this.clearRecordsDisplay = clearStatus;
          } else {
            this.clearRecordsDisplay = true;
          }
        }
      );

    this.fetchRecordsSuccessSubscription = this.fetchRecordsSuccess$.subscribe(
      (data: { type?: string }[]) => {
        this.records = data;
        this.recordsFetchedStatusText = this.isFetchingRecords ? STREAM_LABELS.FETCHING_RECORDS : STREAM_LABELS.FETCHED_RECORDS_COUNT.replace('{{ recordCount }}', this.recordCount.toString());
        this.records = data as { type?: string }[];
        this.recordCount = this.getRecordCount();
        this.cdRef.detectChanges();
      }
    );

    this.fetchRecordsErrorSubscription = this.fetchRecordsError$.subscribe(
      (error) => {
        if (error) {
          console.error(error);
          this.streamService.isViewRecordsDisabled.next(false);
          this.streamService.isClearRecordsDisabled.next(false);
          this.streamService.isStopFetchDisabled.next(true);
        }
      }
    );

    this.isStopFetchSuccessSubscription =
      this.stopFetchSuccess$.subscribe(
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

    this.isStopFetchErrorSubscription =
      this.stopFetchError$.subscribe(
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

  ngOnDestroy(): void {
    this.store.dispatch(StreamActions.resetStopFetchState());
    this.store.dispatch(StreamActions.resetFetchStreamsState());
    this.store.dispatch(StreamActions.resetFetchConsumersState());
    this.store.dispatch(StreamActions.resetFetchRecordsState());
    this.streamService.isStopFetchDisabled.next(true);
    this.streamService.isViewRecordsDisabled.next(false);
    this.streamService.isClearRecordsDisabled.next(true);
    this.clearRecordsDisplaySubscription?.unsubscribe();
    this.fetchRecordsSuccessSubscription?.unsubscribe();
    this.fetchRecordsErrorSubscription?.unsubscribe();
    this.isStopFetchSuccessSubscription?.unsubscribe();
    this.isStopFetchErrorSubscription?.unsubscribe();
    this.isFetchingRecordsSubscription?.unsubscribe();
  }
}
