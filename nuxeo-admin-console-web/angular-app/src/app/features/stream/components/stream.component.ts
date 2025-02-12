import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from "@angular/core";
import { STREAM_LABELS } from "../stream.constants";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../store/reducers";
import { StreamService } from "../services/stream.service";
import { HttpErrorResponse } from "@angular/common/http";

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
  isFetchingRecords = false;
  isFetchingRecordsSubscription: Subscription = new Subscription();
  recordsFetchedStatus = "";

  constructor(private store: Store<{ streams: StreamsState }>, private cdRef: ChangeDetectorRef, private streamService: StreamService) {
    this.fetchRecordsSuccess$ = this.store.pipe(
      select((state) => state?.streams?.records)
    );

    this.fetchRecordsError$ = this.store.pipe(
      select((state) => state.streams?.recordsError)
    );

  }

  ngOnInit(): void {

    this.isFetchingRecordsSubscription =
    this.streamService.isFetchingRecords.subscribe(
      (status) => {
        this.isFetchingRecords = status;
        if (this.isFetchingRecords) {
          this.recordsFetchedStatus = STREAM_LABELS.FETCHING_RECORDS;
        } else {
          this.recordsFetchedStatus = "";
        }
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
        if (this.records?.length > 0) {
          this.streamService.isClearRecordsDisabled.next(false);
          this.streamService.isPauseFetchDisabled.next(false);
          this.streamService.isFetchingRecords.next(false);
          this.records = data as { type?: string }[];
          this.recordCount = this.getRecordCount();
          this.cdRef.detectChanges();
        } else {
          this.streamService.isPauseFetchDisabled.next(true);
        }
      }
    );

    this.fetchRecordsErrorSubscription = this.fetchRecordsError$.subscribe(
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );

  }

  getRecordCount(): number {
    return this.records
      .filter((r: { type?: string }) => r?.type === "record")
      .length;

  }

  ngOnDestroy(): void {
    this.fetchRecordsSuccessSubscription?.unsubscribe();
    this.fetchRecordsErrorSubscription?.unsubscribe();
  }
}
