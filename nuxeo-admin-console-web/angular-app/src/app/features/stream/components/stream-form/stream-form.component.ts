import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { STREAM_ERROR_MESSAGES, STREAM_LABELS } from "../../stream.constants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as StreamActions from "../../store/actions";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../../store/reducers";
import { Observable, startWith, Subject, Subscription, takeUntil } from "rxjs";
import { RecordsPayload, Stream } from "../../stream.interface";
import { StreamService } from "../../services/stream.service";
import { ERROR_MODAL_LABELS, ERROR_TYPES, GENERIC_LABELS, MODAL_DIMENSIONS } from "./../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ErrorModalComponent } from "src/app/features/sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { ErrorModalClosedInfo, ErrorDetails } from "src/app/shared/types/common.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "stream-form",
  templateUrl: "./stream-form.component.html",
  styleUrls: ["./stream-form.component.scss"]
})

export class StreamFormComponent implements OnInit, OnDestroy {
  STREAM_LABELS = STREAM_LABELS;
  GENERIC_LABELS = GENERIC_LABELS;
  streamForm: FormGroup;
  isSubmitBtnDisabled = false;
  fetchStreamsSuccess$: Observable<Stream[]>;
  fetchStreamsError$: Observable<unknown>;
  fetchConsumersSuccess$: Observable<{ stream: string; consumer: string }[]>;
  fetchConsumersError$: Observable<unknown>;
  fetchRecordsError$: Observable<unknown>;
  streams: Stream[] = [];
  records: unknown[] = [];
  consumers: { stream: string; consumer: string }[] = [];
  fetchStreamsErrorSubscription = new Subscription();
  fetchStreamsSuccessSubscription = new Subscription();
  fetchConsumersErrorSubscription = new Subscription();
  fetchConsumersSuccessSubscription = new Subscription();
  isClearBtnDisabledSubscription = new Subscription();
  isStopFetchBtnDisabledSubscription = new Subscription();
  isViewRecordsDisabledSubscription = new Subscription();
  positionChangeSubscription = new Subscription();
  selectedConsumer = "";
  isClearBtnDisabled = true;
  isStopFetchBtnDisabled = true;
  rewindValues: string[] = [];
  limitValues: string[] = [];
  timeoutValues: string[] = [];
  selectedValue = 1;
  selectedRewindValue = "";
  selectedLimitValue = "";
  selectedTimeoutValue = "";
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  private destroy$ = new Subject<void>();
  isEventStreamDisconnected: boolean = false;
  @ViewChild('focusMatSelect') focusMatSelect!: MatSelect;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ streams: StreamsState }>,
    private streamService: StreamService,
    public dialogService: MatDialog,
    private ngZone: NgZone
  ) {
    this.streamForm = this.fb.group({
      stream: ["", Validators.required],
      position: [STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE, Validators.required],
      rewind: [""],
      limit: [""],
      timeout: [""],
      offset: [{ value: 0, disabled: true }],
      partition: [{ value: 0, disabled: true }],
      selectedConsumer: [{ value: "", disabled: true }]
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

    this.fetchRecordsError$ = this.store.pipe(
      select((state) => state.streams?.recordsError)
    );
  }

  ngOnInit(): void {
    this.rewindValues = STREAM_LABELS.REWIND_VALUES;
    this.selectedRewindValue = this.rewindValues[0];
    this.limitValues = STREAM_LABELS.LIMIT_VALUES;
    this.selectedLimitValue = this.limitValues[0];
    this.timeoutValues = STREAM_LABELS.TIMEOUT_VALUES;
    this.selectedTimeoutValue = this.timeoutValues[0];
    this.streamForm?.get(STREAM_LABELS.REWIND_ID)?.setValue(this.selectedRewindValue);
    this.streamForm?.get(STREAM_LABELS.LIMIT_ID)?.setValue(this.selectedLimitValue);
    this.streamForm?.get(STREAM_LABELS.TIMEOUT_ID)?.setValue(this.selectedTimeoutValue);


    const positionControl = this.streamForm && this.streamForm.get("position");
    if (positionControl) {
      this.positionChangeSubscription = this.streamForm.get("position")!.valueChanges.subscribe((value) => {
        if (value === STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE) {
          this.streamForm.get("offset")?.enable();
          this.streamForm.get("partition")?.enable();
        } else {
          this.streamForm.get("offset")?.disable();
          this.streamForm.get("partition")?.disable();
        }

        if (value === "consumer") {
          this.streamForm.get("selectedConsumer")?.enable();
        } else {
          this.streamForm.get("selectedConsumer")?.disable();
        }
      });
    }

    this.isClearBtnDisabledSubscription = this.streamService.isClearRecordsDisabled.subscribe((isDisabled: boolean) => {
      this.isClearBtnDisabled = isDisabled;
    });
    this.isStopFetchBtnDisabledSubscription = this.streamService.isStopFetchDisabled.subscribe((isDisabled: boolean) => {
      this.isStopFetchBtnDisabled = isDisabled;
    });
    this.isViewRecordsDisabledSubscription = this.streamService.isViewRecordsDisabled.subscribe((isDisabled: boolean) => {
      this.isSubmitBtnDisabled = isDisabled;
    });
    this.fetchStreamsSuccessSubscription = this.fetchStreamsSuccess$.subscribe(
      (data: Stream[]) => {
        if (data?.length > 0) {
          this.streams = data;
          this.streamForm.patchValue({
            stream: data[0]?.name,
          });
          const params = {
            stream: this.streamForm?.controls[STREAM_LABELS.STREAM_ID]?.value,
          };
          this.store.dispatch(StreamActions.fetchConsumers({ params }));
        } else {
          this.store.dispatch(StreamActions.fetchStreams());
        }
      }
    );

    this.fetchStreamsErrorSubscription = this.fetchStreamsError$.subscribe(
      (error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            msg: STREAM_ERROR_MESSAGES.STREAMS_ERROR_MODAL_TITLE,
            value: true,
            details: {
              status: (error as HttpErrorResponse)?.status,
              message: (error as HttpErrorResponse)?.message,
            },
          });
        }
      }
    );

    this.fetchConsumersSuccessSubscription =
      this.fetchConsumersSuccess$.subscribe(
        (data: { stream: string; consumer: string }[]) => {
          if (data?.length > 0) {
            this.consumers = data;
            this.selectedConsumer = this.consumers
              ? this.consumers[0]?.consumer
              : "";
            this.streamForm.patchValue({
              selectedConsumer: this.selectedConsumer
            })
          }
        }
      );

    this.fetchConsumersErrorSubscription = this.fetchConsumersError$.subscribe(
      (error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            value: true,
            msg: STREAM_ERROR_MESSAGES.CONSUMER_ERROR_MODAL_TITLE,
            details: {
              status: (error as HttpErrorResponse)?.status,
              message: (error as HttpErrorResponse)?.message,
            },
          });
        }
      }
    );

    this.streamService.streamDisconnected$?.pipe(takeUntil(this.destroy$)).subscribe((value: boolean) => {
      this.isEventStreamDisconnected = value;
    });

    this.fetchRecordsError$.pipe(takeUntil(this.destroy$)).subscribe(
      (error) => {
        if (error && !this.isEventStreamDisconnected) {
          this.showActionErrorModal({
            type: '',
            details: {
              status: (error as HttpErrorResponse)?.status,
              message: ERROR_MODAL_LABELS.ERROR_SUBHEADING,
            },
          });
        }
      }
    );
  }

  onConsumerOptionChange(selectedValue: string): void {
    this.selectedConsumer = selectedValue;
  }

  onStreamChange(value: string): void {
    this.isSubmitBtnDisabled = false;
    this.streamForm.patchValue({
      stream: value,
    });
    const params = {
      stream: this.streamForm.controls[STREAM_LABELS.STREAM_ID]?.value,
    };
    this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onRewindValSelect(value: string): void {
    this.selectedRewindValue = value;
    this.streamForm.patchValue({
      rewind: value
    });
  }

  onLimitValSelect(value: string): void {
    this.selectedLimitValue = value;
    this.streamForm.patchValue({
      limit: value
    });
  }

  onTimeoutValSelect(value: string): void {
    this.selectedTimeoutValue = value;
    this.streamForm.patchValue({
      timeout: value
    });
  }

  onStreamFormSubmit(): void {
    if (this.streamForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      const params: RecordsPayload = {
        stream: this.streamForm?.get(STREAM_LABELS.STREAM_ID)?.value,
        rewind: this.streamForm?.get(STREAM_LABELS.REWIND_ID)?.value,
        limit: this.streamForm?.get(STREAM_LABELS.LIMIT_ID)?.value,
        timeout: this.convertTimeout(this.streamForm?.get(STREAM_LABELS.TIMEOUT_ID)?.value),
      };
      this.getPositionValue(params);
      this.store.dispatch(StreamActions.triggerRecordsSSEStream({ params }));
    }
  }


  convertTimeout(timeoutVal: string): string {
    if (timeoutVal === STREAM_LABELS.TIMEOUT_VALUES[0]) {
      return STREAM_LABELS.DEFAULT_TIMEOUT_VALUE;
    }
    if (timeoutVal.indexOf(STREAM_LABELS.MINUTE) > -1) {
      return `${(Number(timeoutVal.split(STREAM_LABELS.MINUTE)[0]) * 60)}${STREAM_LABELS.SECOND}`;
    }
    return timeoutVal;
  }

  getPositionValue(params: RecordsPayload): void {
    const positionValue = this.streamForm?.get(STREAM_LABELS.POSITION_ID)?.value;
    if (positionValue === STREAM_LABELS.POSITION_OPTIONS.TAIL.VALUE) {
      params.fromTail = true;
    } else if (positionValue === STREAM_LABELS.POSITION_OPTIONS.CONSUMER.VALUE) {
      params.fromGroup = this.selectedConsumer;
    } else if (positionValue === STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE) {
      params.fromOffset = this.streamForm?.get(STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE)?.value?.toString();
      params.partition = this.streamForm?.get(STREAM_LABELS.POSITION_OPTIONS.PARTITITON.VALUE)?.value?.toString();
    }
  }


  onStopFetch(): void {
    this.store.dispatch(StreamActions.onStopFetch());
  }

  onClearRecords(): void {
    this.store.dispatch(StreamActions.resetFetchRecordsState());
    this.isSubmitBtnDisabled = false;
    this.isClearBtnDisabled = true;
    this.streamService.clearRecordsDisplay.next(true);
    document.getElementById(STREAM_LABELS.STREAM_ID)?.focus();
  }

  showActionErrorModal(error: ErrorDetails): void {
    this.ngZone.run(() => {
      this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
        disableClose: true,
        hasBackdrop: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        autoFocus: false,
        data: {
          error: error,
        },
      });

      this.dialogService.afterAllClosed.subscribe(() => {
        setTimeout(() => {
          this.focusMatSelect.focus(); 
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.fetchStreamsSuccessSubscription?.unsubscribe();
    this.fetchStreamsErrorSubscription?.unsubscribe();
    this.fetchConsumersSuccessSubscription?.unsubscribe();
    this.fetchConsumersErrorSubscription?.unsubscribe();
    this.isClearBtnDisabledSubscription?.unsubscribe();
    this.isStopFetchBtnDisabledSubscription?.unsubscribe();
    this.isViewRecordsDisabledSubscription?.unsubscribe();
    this.positionChangeSubscription?.unsubscribe();
    this.destroy$.next();    
    this.destroy$.complete(); 
  }
}
