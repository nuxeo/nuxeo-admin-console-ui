import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  CONSUMER_THREAD_POOL_LABELS,
  STREAM_LABELS,
} from "../../stream.constants";
import { select, Store } from "@ngrx/store";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { Stream } from "../../stream.interface";
import { ConsumerThreadPoolState, StreamsState } from "../../store/reducers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import * as StreamActions from "../../store/actions";
import { ErrorModalComponent } from "../../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import {
  ErrorDetails,
  ErrorModalClosedInfo,
} from "../../../../shared/types/common.interface";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { GenericModalComponent } from "../../../sub-features/generic-multi-feature-layout/components/generic-modal/generic-modal.component";
import { GenericModalClosedInfo } from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.interface";
import { StreamService } from "../../services/stream.service";

@Component({
  selector: "app-consumer-thread-pool",
  templateUrl: "./consumer-thread-pool.component.html",
  styleUrls: ["./consumer-thread-pool.component.scss"],
})
export class ConsumerThreadPoolComponent implements OnInit, OnDestroy  {
  GENERIC_LABELS = GENERIC_LABELS;
  streams: Stream[] = [];
  consumers: { stream: string; consumer: string }[] = [];
  STREAM_LABELS = STREAM_LABELS;
  CONSUMER_THREAD_POOL_LABELS = CONSUMER_THREAD_POOL_LABELS;
  fetchStreamsSuccess$!: Observable<Stream[]>;
  fetchStreamsError$!: Observable<HttpErrorResponse | null>;
  fetchConsumersSuccess$!: Observable<{ stream: string; consumer: string }[]>;
  fetchConsumersError$!: Observable<HttpErrorResponse | null>;
  streamForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  errorDialogRef:
    | MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>
    | undefined = undefined;
  selectedConsumer = "";
  genericDialogRef:
    | MatDialogRef<GenericModalComponent, GenericModalClosedInfo>
    | undefined = undefined;
  @ViewChild("focusMatSelect") focusMatSelect!: MatSelect;
  isStartOrStopConsumerThreadInProgress = false;
  isStartConsumerThreadPoolSuccess$!: Observable<ConsumerThreadPoolState>;
  isStartConsumerThreadPoolFailure$!: Observable<HttpErrorResponse | null>;
  isStopConsumerThreadPoolSuccess$!: Observable<ConsumerThreadPoolState>;
  isStopConsumerThreadPoolFailure$!: Observable<HttpErrorResponse | null>;
  isStartStopConsumerThreadBtnDisabled = false;
  constructor(
    private store: Store<{
      streams: StreamsState;
      consumerThreadPool: ConsumerThreadPoolState;
    }>,
    private fb: FormBuilder,
    public dialogService: MatDialog,
    private streamService: StreamService
  ) {
    this.streamForm = this.fb.group({
      stream: ["", Validators.required],
      consumer: ["", Validators.required],
    });
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

    this.isStartConsumerThreadPoolSuccess$ = this.store.pipe(
      select((state) => state?.consumerThreadPool)
    );

    this.isStartConsumerThreadPoolFailure$ = this.store.pipe(
      select((state) => state?.consumerThreadPool?.isStartConsumerStoppedError)
    );

    this.isStopConsumerThreadPoolSuccess$ = this.store.pipe(
      select((state) => state?.consumerThreadPool)
    );

    this.isStopConsumerThreadPoolFailure$ = this.store.pipe(
      select((state) => state?.consumerThreadPool?.isStopConsumerStoppedError)
    );
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
          this.streamForm.patchValue({
            stream: data[0]?.name,
          });
          const params = {
            stream: this.streamForm?.controls[STREAM_LABELS.STREAM_ID]?.value,
          };
          this.store.dispatch(StreamActions.fetchConsumers({ params }));
        }
      });

    this.fetchStreamsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.isStartStopConsumerThreadBtnDisabled = true;
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error?.error as HttpErrorResponse)?.status || error.status,
              message: (error?.error as HttpErrorResponse)?.message || error.message,
            },
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
          this.streamForm.patchValue({
            consumer: this.selectedConsumer,
          });
        }
        this.isStartStopConsumerThreadBtnDisabled = !this.selectedConsumer
          ? true
          : false;
      });

    this.fetchConsumersError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.isStartStopConsumerThreadBtnDisabled = true;
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error?.error as HttpErrorResponse)?.status || error.status,
              message: (error?.error as HttpErrorResponse)?.message || error.message,
            },
          });
        }
      });

    this.isStartConsumerThreadPoolSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ConsumerThreadPoolState) => {
        if (data) {
          this.isStartOrStopConsumerThreadInProgress =
            data?.isStartStopConsumerPoolProcessRunning;

          if (data?.isStartProcessCompleted) {
            this.streamService.showSuccessMessage(
              CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_SUCCESS_MSG
            );
          }
        }
      });

    this.isStartConsumerThreadPoolFailure$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error?.error as HttpErrorResponse)?.status || error.status,
              message: (error?.error as HttpErrorResponse)?.message || error.message,
            },
          });
        }
      });

    this.isStopConsumerThreadPoolSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ConsumerThreadPoolState) => {
        if (data) {
          this.isStartOrStopConsumerThreadInProgress =
            data?.isStartStopConsumerPoolProcessRunning;
        }

        if (data?.isStopProcessCompleted) {
          this.streamService.showSuccessMessage(
            CONSUMER_THREAD_POOL_LABELS.STOP_CONSUMER_SUCCESS_MSG
          );
        }
      });

    this.isStopConsumerThreadPoolFailure$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: {
              status: (error?.error as HttpErrorResponse)?.status || error.status,
              message: (error?.error as HttpErrorResponse)?.message || error.message,
            },
          });
        }
      });
  }

  onStartStopConsumerThreadPool(operationType: string): void {
    const params = {
      consumer: this.streamForm?.get(CONSUMER_THREAD_POOL_LABELS.CONSUMER_LABEL)
        ?.value,
    };
    if (
      operationType === CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
    ) {
      this.store.dispatch(
        StreamActions.onStartConsumerThreadPoolLaunch({ params })
      );
    } else {
      this.store.dispatch(
        StreamActions.onStopConsumerThreadPoolLaunch({ params })
      );
    }
  }

  showConfirmationModal(operation: string): void {
    if (!this.isStartOrStopConsumerThreadInProgress) {
      const selectedConsumer = this.streamForm?.get(
        CONSUMER_THREAD_POOL_LABELS.CONSUMER_LABEL
      )?.value;
      this.genericDialogRef = this.dialogService.open(GenericModalComponent, {
        disableClose: true,
        hasBackdrop: true,
        height: CONSUMER_THREAD_POOL_LABELS.DIALOG_BOX_HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        autoFocus: false,
        panelClass: "confirmation-dialog-height",
        data: {
          operationType:
            CONSUMER_THREAD_POOL_LABELS.CONSUMER_THREAD_POOL_OPERATION,
          message: CONSUMER_THREAD_POOL_LABELS.CONFIRMATION_MESSAGE.replace(
            "{operation}",
            operation
          )
            .replace(
              "{selectedConsumerName}",
              selectedConsumer.replace("/", "-")
            )
            .replace("{selectedConsumerUrn}", selectedConsumer),
          title:
            CONSUMER_THREAD_POOL_LABELS.CONSUMER_THREAD_POOL_DIALOG_MSG.replace(
              "{operation}",
              operation.charAt(0).toUpperCase() + operation.slice(1)
            ),
        },
      });
      this.genericDialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          if (data?.continue) {
            this.onStartStopConsumerThreadPool(operation);
          }
          if (this.focusMatSelect) {
            this.focusMatSelect.focus();
          }
        });
    } else {
      this.showActionErrorModal(
        {
          type: ERROR_TYPES.SERVER_ERROR,
          details: {
            message:
              CONSUMER_THREAD_POOL_LABELS.CONSUMER_THREAD_POOL_OPERATION_IN_PROGRESS_MSG,
          },
        },
        "error-dialog-height"
      );
    }
  }

  showActionErrorModal(error: ErrorDetails, panelClass?: string): void {
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: panelClass
        ? CONSUMER_THREAD_POOL_LABELS.DIALOG_BOX_HEIGHT
        : MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      autoFocus: false,
      panelClass: panelClass ?? "",
      data: {
        error: error,
      },
    });

    this.errorDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.focusMatSelect) {
          this.focusMatSelect.focus();
        }
      });
  }

  onStreamChange(stream: string): void {
    this.streamForm.patchValue({
      stream: stream,
    });
    const params = {
      stream: this.streamForm.controls[STREAM_LABELS.STREAM_ID]?.value,
    };
    this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(StreamActions.resetConsumerThreadPoolState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
