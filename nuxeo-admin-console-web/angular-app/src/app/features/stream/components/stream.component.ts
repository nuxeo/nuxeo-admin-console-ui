import { Component, OnDestroy, OnInit } from "@angular/core";
import { STREAM_LABELS } from "../stream.constants";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../store/reducers";
import { Stream } from "../stream.interface";

@Component({
  selector: "stream",
  templateUrl: "./stream.component.html",
  styleUrls: ["./stream.component.scss"],
})
export class StreamComponent implements OnInit, OnDestroy {
  pageTitle = STREAM_LABELS.STREAM_PAGE_TITLE;
  records: unknown[] = [];
  recordsAvailable$!: Observable<boolean>;
  fetchRecordsErrorSubscription = new Subscription();
  fetchRecordsSuccessSubscription = new Subscription();
  fetchRecordsSuccess$!: Observable<unknown[]>;
  fetchRecordsError$!: Observable<unknown>;
  // fetchStreamsSuccess$: Observable<Stream[]>;
  // fetchStreamsError$: Observable<unknown>;
  constructor(private store: Store<{ stream: StreamsState }>) {

   /* this.fetchStreamsSuccess$ = this.store.pipe(
      select((state) => state.streams?.streams)
    );

    this.fetchStreamsError$ = this.store.pipe(
      select((state) => state.streams?.error)
    ); */

  }

  ngOnInit(): void {
    // this.recordsAvailable$ = this.store.select(
    //   (state) => state?.stream?.records?.length > 0
    // );

    this.fetchRecordsSuccessSubscription = this.fetchRecordsSuccess$.subscribe(
      (data: unknown[]) => {
        if (data?.length > 0) {
          this.records = data;
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

  ngOnDestroy(): void {
    this.fetchRecordsSuccessSubscription?.unsubscribe();
    this.fetchRecordsErrorSubscription?.unsubscribe();
  }
}
