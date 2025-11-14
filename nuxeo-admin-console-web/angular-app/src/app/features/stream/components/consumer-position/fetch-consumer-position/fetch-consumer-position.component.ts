import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  CHANGE_CONSUMER_POSITION_LABELS,
  CONSUMER_THREAD_POOL_LABELS,
  GET_CONSUMER_POSITION_LABELS,
  STREAM_LABELS,
} from "../../../stream.constants";
import { Stream } from "../../../stream.interface";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
} from "../../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { select, Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { SharedMethodsService } from "../../../../../shared/services/shared-methods.service";
import { StreamsState } from "../../../store/reducers";
import {
  ChangeConsumerPositionState,
  ConsumerPositionDetails,
} from "../store/reducers";
import * as StreamActions from "../../../store/actions";
import { MatSelect } from "@angular/material/select";
import * as ConsumerPositionActions from "../store/actions";
import * as ConsumerPositionSelectors from "../store/selectors";

@Component({
  selector: "fetch-consumer-position",
  templateUrl: "./fetch-consumer-position.component.html",
  styleUrls: ["./fetch-consumer-position.component.scss"],
})
export class FetchConsumerPositionComponent implements OnInit, OnDestroy {
  fetchConsumerForm!: FormGroup<any>;
  fetchStreamsSuccess$!: Observable<Stream[]>;
  fetchStreamsError$!: Observable<HttpErrorResponse | null>;
  fetchConsumersSuccess$!: Observable<{ stream: string; consumer: string }[]>;
  fetchConsumersError$!: Observable<HttpErrorResponse | null>;
  selectedConsumer = "";
  private destroy$: Subject<void> = new Subject<void>();
  isFetchConsumerPositionBtnDisabled = false;
  readonly CHANGE_CONSUMER_POSITION_LABELS = CHANGE_CONSUMER_POSITION_LABELS;
  consumers: { stream: string; consumer: string }[] = [];
  streams: Stream[] = [];
  readonly GENERIC_LABELS = GENERIC_LABELS;
  @ViewChild("focusMatSelect")
  focusMatSelect!: MatSelect;
  readonly GET_CONSUMER_POSITION_LABELS = GET_CONSUMER_POSITION_LABELS;
  readonly CONSUMER_THREAD_POOL_LABELS = CONSUMER_THREAD_POOL_LABELS;
  readonly STREAM_LABELS = STREAM_LABELS;
  getConsumerPositionSuccess$!: Observable<ConsumerPositionDetails[]>;
  getConsumerPositionError$!: Observable<HttpErrorResponse | null>;
  getConsumerPositionData: ConsumerPositionDetails[] | null = null;
  constructor(
    private store: Store<{
      streams: StreamsState;
      consumerPosition: ChangeConsumerPositionState;
    }>,
    public dialogService: MatDialog,
    private sharedMethodService: SharedMethodsService,
    private fb: FormBuilder
  ) {
    this.fetchStreamsSuccess$ = this.store.pipe(
      select((state) => state.streams?.streams)
    );

    this.fetchStreamsError$ = this.store.pipe(
      select((state) => state.streams?.streamsError)
    );

    this.fetchConsumersSuccess$ = this.store.pipe(
      select((state) => state.streams?.consumers)
    );

    this.fetchConsumersError$ = this.store.pipe(
      select((state) => state.streams?.consumersError)
    );

    this.getConsumerPositionSuccess$ = this.store.pipe(
      select(ConsumerPositionSelectors.selectFetchConsumerPositionSuccess)
    );
    this.getConsumerPositionError$ = this.store.pipe(
      select(ConsumerPositionSelectors.selectFetchConsumerPositionError)
    );

    this.fetchConsumerForm = this.fb.group({
      stream: ["", Validators.required],
      consumer: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.store
      .select((state) => state?.streams?.streamDataLoaded)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe((loaded) => {
        if (!loaded) {
          // Call FetchStreams API only if streams data not already loaded in streams component; this prevents duplicate API calls
          this.store.dispatch(StreamActions.fetchStreams());
        }
      });

    this.fetchStreamsSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Stream[]) => {
        if (data?.length > 0) {
          this.streams = data;
          this.fetchConsumerForm.patchValue({
            stream: data[0]?.name,
          });
          const params = {
            stream:
              this.fetchConsumerForm?.controls[STREAM_LABELS.STREAM_ID]?.value,
          };
          this.store.dispatch(StreamActions.fetchConsumers({ params }));
        }
      });

    this.fetchStreamsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.isFetchConsumerPositionBtnDisabled = true;
          this.sharedMethodService
            .showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: {
                status: (error?.error as HttpErrorResponse)?.status || error.status ,
                message: (error?.error as HttpErrorResponse)?.message || error.message,
              },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              if (this.focusMatSelect) {
                this.focusMatSelect.focus();
              }
            });
        }
      });

    this.fetchConsumersSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { stream: string; consumer: string }[]) => {
        if (data?.length > 0) {
          this.consumers = data;
          this.selectedConsumer = this.consumers
            ? this.consumers[0]?.consumer
            : "";
          this.fetchConsumerForm.patchValue({
            consumer: this.selectedConsumer,
          });
        }
        this.isFetchConsumerPositionBtnDisabled = !this.selectedConsumer
          ? true
          : false;
      });

    this.fetchConsumersError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.isFetchConsumerPositionBtnDisabled = true;
          this.sharedMethodService
            .showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: {
                status: (error?.error as HttpErrorResponse)?.status || error.status,
                message: (error?.error as HttpErrorResponse)?.message || error.message,
              },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              if (this.focusMatSelect) {
                this.focusMatSelect.focus();
              }
            });
        }
      });

    this.getConsumerPositionSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ConsumerPositionDetails[]) => {
        if (this.isValidData(data)) {
          this.getConsumerPositionData = data;
        }
      });

    this.getConsumerPositionError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.clearRecords();
          this.sharedMethodService
            .showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: {
                status: (error?.error as HttpErrorResponse)?.status || error.status,
                message: (error?.error as HttpErrorResponse)?.message || error.message,
              },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              if (this.focusMatSelect) {
                this.focusMatSelect.focus();
              }
            });
        }
      });
  }

  fetchConsumerPositionDetails() {
    const params = {
      stream: this.fetchConsumerForm.controls[STREAM_LABELS.STREAM_ID]?.value,
      consumer:
        this.fetchConsumerForm.controls[
          CONSUMER_THREAD_POOL_LABELS.CONSUMER_LABEL
        ]?.value,
    };
    this.store.dispatch(
      ConsumerPositionActions.onFetchConsumerPosition({ params })
    );
  }

  onStreamChange(stream: string): void {
    this.fetchConsumerForm.patchValue({
      stream: stream,
    });
    const params = {
      stream: this.fetchConsumerForm.controls[STREAM_LABELS.STREAM_ID]?.value,
    };
    this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  isValidData(data: any): boolean {
    if (!data) return false;
    if (Object.keys(data).length === 0) return false;
    return true;
  }

  clearRecords() {
    this.getConsumerPositionData = [];
    this.store.dispatch(
      ConsumerPositionActions.resetFetchConsumerPositionData()
    );
  }

  ngOnDestroy() {
    this.store.dispatch(
      ConsumerPositionActions.resetFetchConsumerPositionData()
    );
    this.destroy$.next();
    this.destroy$.complete();
  }
}
