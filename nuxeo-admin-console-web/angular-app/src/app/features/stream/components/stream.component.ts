import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
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
  isFetchingRecords = false;
  isFetchingRecordsSubscription: Subscription = new Subscription();


  constructor(private store: Store<{ streams: StreamsState }>, private cdRef: ChangeDetectorRef, private streamService: StreamService) {
    this.fetchRecordsSuccess$ = this.store.pipe(
      select((state) => state?.streams?.records)
    );

    this.fetchRecordsError$ = this.store.pipe(
      select((state) => state.streams?.error)
    );

  }

  ngOnInit(): void {
    this.fetchRecordsSuccessSubscription = this.fetchRecordsSuccess$.subscribe(
      (data: unknown[]) => {
        if (data?.length > 0) {
          this.streamService.isFetchingRecords.next(false);
          this.records = data as { type?: string }[];
          this.recordCount = this.getRecordCount();
          this.cdRef.detectChanges();
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

    this.isFetchingRecordsSubscription =
      this.streamService.isFetchingRecords.subscribe(
        (status) => {
          this.isFetchingRecords = status;
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
    this.isFetchingRecordsSubscription?.unsubscribe();
  }
}
