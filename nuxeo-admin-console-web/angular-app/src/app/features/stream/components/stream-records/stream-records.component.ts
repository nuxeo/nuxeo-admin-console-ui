import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { StreamService } from "../../services/stream.service";
import { distinctUntilChanged, Observable, skip, Subscription } from "rxjs";
import { STREAM_LABELS } from "../../stream.constants";
import { select, Store } from "@ngrx/store";
import { StreamsState } from "../../store/reducers";
@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"]
})

export class StreamRecordsComponent implements OnInit, OnDestroy {
  @Input() records: { type?: string }[] = [];
  @Input() recordCount = 0;
  isFetchingRecords = false;
  isFetchingRecordsSubscription: Subscription = new Subscription();
  isPauseFetchBtnDisabledSubscription: Subscription = new Subscription();
  STREAM_LABELS = STREAM_LABELS;
  isPauseFetchBtnDisabled = true;
  pauseFetchSuccess$: Observable<any>;
  pauseFetchError$: Observable<unknown>;
  isPauseFetchSuccess: boolean | null = null;
  isPauseFetchSuccessSubscription: Subscription = new Subscription();
  isPauseFetchErrorSubscription: Subscription = new Subscription();
  recordsFetchedStatus = '';

  constructor(private streamService: StreamService,
    private store: Store<{ streams: StreamsState }>,
  ) {
    this.pauseFetchSuccess$ = this.store.pipe(
      select((state) => state.streams?.isFetchPaused),
      skip(1)
    );

    this.pauseFetchError$ = this.store.pipe(
      select((state) => state.streams?.isFetchPausedError),
      skip(1)
    );
  }

  ngOnInit(): void {
    this.recordsFetchedStatus = this.STREAM_LABELS.FETCHED_RECORDS_COUNT.replace('{{ recordCount }}', this.recordCount as unknown as string);
    this.isFetchingRecordsSubscription =
      this.streamService.isFetchingRecords.subscribe(
        (status) => {
          this.isFetchingRecords = status;
        }
      );

    this.isPauseFetchSuccessSubscription =
      this.pauseFetchSuccess$.subscribe(
        (status: boolean | null) => {
          this.isPauseFetchSuccess = status;
          this.recordsFetchedStatus = this.STREAM_LABELS.STOPPED_FETCHING_RECORDS
        }
      );

    this.isPauseFetchErrorSubscription =
      this.pauseFetchError$.subscribe(
        (error: unknown) => {
          this.isPauseFetchSuccess = false;
          console.log(error);
        }
      );
  }

  getRecordsStatus(label: string): string {
    if (this.isPauseFetchSuccess) {
      return `${this.STREAM_LABELS.STOPPED_FETCHING_RECORDS}`;
    }
    return label.replace('{{ recordCount }}', this.recordCount as unknown as string);
  }

  ngOnDestroy(): void {
    this.isFetchingRecordsSubscription?.unsubscribe();
    this.isPauseFetchSuccessSubscription?.unsubscribe();
    this.isPauseFetchErrorSubscription?.unsubscribe();
  }
}
