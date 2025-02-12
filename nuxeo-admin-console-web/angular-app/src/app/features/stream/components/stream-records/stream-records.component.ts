import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { StreamService } from "../../services/stream.service";
import { Observable, skip, Subscription } from "rxjs";
import { STREAM_LABELS } from "../../stream.constants";
import { select, Store } from "@ngrx/store";
import { StreamsState } from "../../store/reducers";
import * as StreamActions from "../../store/actions";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackBarComponent } from "../../../..//shared/components/custom-snack-bar/custom-snack-bar.component";

@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"]
})

export class StreamRecordsComponent implements OnInit, OnDestroy {
  @Input() records: { type?: string }[] = [];
  isPauseFetchBtnDisabledSubscription: Subscription = new Subscription();
  STREAM_LABELS = STREAM_LABELS;
  isPauseFetchBtnDisabled = true;
  pauseFetchSuccess$: Observable<any>;
  pauseFetchError$: Observable<unknown>;
  isPauseFetchSuccess: boolean | null = null;
  isPauseFetchSuccessSubscription: Subscription = new Subscription();
  isPauseFetchErrorSubscription: Subscription = new Subscription();

  constructor(private streamService: StreamService,
    private store: Store<{ streams: StreamsState }>,
    private _snackBar: MatSnackBar
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
    this.isPauseFetchSuccessSubscription =
      this.pauseFetchSuccess$.subscribe(
        (status: boolean | null) => {
          this.isPauseFetchSuccess = status;
          this._snackBar.openFromComponent(CustomSnackBarComponent, {
            data: {
              message: STREAM_LABELS.STOPPED_FETCHING_RECORDS,
              panelClass: "success-snack",
            },
            duration: 5000,
            panelClass: ["success-snack"],
          });
          this.streamService.isPauseFetchDisabled.next(true);
          this.streamService.isClearRecordsDisabled.next(false);
          this.streamService.isFetchingRecords.next(false);
          this.store.dispatch(StreamActions.resetPauseFetchState());
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

  ngOnDestroy(): void {
    this.isPauseFetchSuccessSubscription?.unsubscribe();
    this.isPauseFetchErrorSubscription?.unsubscribe();
  }
}
