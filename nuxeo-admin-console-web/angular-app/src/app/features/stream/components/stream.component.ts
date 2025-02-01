import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { STREAM_LABELS } from "../stream.constants";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../store/reducers";

@Component({
  selector: "stream",
  templateUrl: "./stream.component.html",
  styleUrls: ["./stream.component.scss"],
})
export class StreamComponent implements OnInit, OnDestroy {
  pageTitle = STREAM_LABELS.STREAM_PAGE_TITLE;
  records: { type?: string }[] = [];
  recordsAvailable$!: Observable<boolean>;
  fetchRecordsErrorSubscription = new Subscription();
  fetchRecordsSuccessSubscription = new Subscription();
  fetchRecordsSuccess$!: Observable<{ type?: string }[]>;
  fetchRecordsError$!: Observable<unknown>;
  recordCount = 0;
  
  constructor(private store: Store<{ streams: StreamsState }>, private cdRef: ChangeDetectorRef) {
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
