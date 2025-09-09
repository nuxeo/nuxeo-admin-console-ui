import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
} from "./../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import {
  CHANGE_CONSUMER_POSITION_LABELS,
  CONSUMER_THREAD_POOL_LABELS,
  STREAM_LABELS,
} from "../../stream.constants";
import { Stream } from "../../stream.interface";
import { select, Store } from "@ngrx/store";
import { Observable, Subject, take, takeUntil } from "rxjs";
import { StreamsState } from "../../store/reducers";
import * as StreamActions from "../../store/actions";
import * as ConsumerPositionActions from "./store/actions";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SharedMethodsService } from "./../../../../shared/services/shared-methods.service";
import {
  ChangeConsumerPositionState,
  ChangeConsumerPosition,
} from "./store/reducers";
import * as ConsumerPositionSelectors from "./store/selectors";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSelect } from "@angular/material/select";
import { ErrorModalComponent } from "./../../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { GenericModalComponent } from "./../../../sub-features/generic-multi-feature-layout/components/generic-modal/generic-modal.component";
import { GenericModalClosedInfo } from "./../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.interface";
import { ErrorModalClosedInfo } from "../../../../shared/types/common.interface";

@Component({
  selector: "change-consumer-position",
  templateUrl: "./change-consumer-position.component.html",
  styleUrls: ["./change-consumer-position.component.scss"],
})
export class ChangeConsumerPositionComponent implements OnInit, OnDestroy {
  consumerPositionForm: FormGroup;
  GENERIC_LABELS = GENERIC_LABELS;
  STREAM_LABELS = STREAM_LABELS;
  CHANGE_CONSUMER_POSITION_LABELS = CHANGE_CONSUMER_POSITION_LABELS;
  POSITION_LABELS = CHANGE_CONSUMER_POSITION_LABELS.POSITION;
  consumers: { stream: string; consumer: string }[] = [];
  streams: Stream[] = [];
  fetchStreamsSuccess$!: Observable<Stream[]>;
  fetchStreamsError$!: Observable<HttpErrorResponse | null>;
  fetchConsumersSuccess$!: Observable<{ stream: string; consumer: string }[]>;
  fetchConsumersError$!: Observable<HttpErrorResponse | null>;
  changeConsumerPositionError$: Observable<HttpErrorResponse | null>;
  changeConsumerPositionSuccess$!: Observable<ChangeConsumerPosition[]>;
  private destroy$: Subject<void> = new Subject<void>();
  isChangeConsumerPositionDisabled = false;
  selectedConsumer = "";
  consumerPositionData: ChangeConsumerPosition[] = [];
  errorDialogRef:
    | MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>
    | undefined = undefined;
  genericDialogRef:
    | MatDialogRef<GenericModalComponent, GenericModalClosedInfo>
    | undefined = undefined;
  @ViewChild("focusMatSelect")
  focusMatSelect!: MatSelect;
  constructor(
    private fb: FormBuilder,
    private store: Store<{
      streams: StreamsState;
      consumerPosition: ChangeConsumerPositionState;
    }>,
    public dialogService: MatDialog,
    private sharedMethodService: SharedMethodsService
  ) {
    this.consumerPositionForm = this.fb.group({
      stream: ["", Validators.required],
      consumer: ["", Validators.required],
      position: this.fb.group({
        value: [
          CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE,
          Validators.required,
        ],
        offset: [{ value: 0, disabled: true }],
        partition: [{ value: 0, disabled: true }],
        after: [{ value: '', disabled: true }], //date form control
      }),
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

    this.changeConsumerPositionError$ = this.store.pipe(
      select(ConsumerPositionSelectors.selectConsumerPositionError)
    );

    this.changeConsumerPositionSuccess$ = this.store.pipe(
      select(ConsumerPositionSelectors.selectConsumerPositionSuccess)
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
          this.consumerPositionForm.patchValue({
            stream: data[0]?.name,
          });
          const params = {
            stream:
              this.consumerPositionForm?.controls[STREAM_LABELS.STREAM_ID]
                ?.value,
          };
          this.store.dispatch(StreamActions.fetchConsumers({ params }));
        }
      });

    this.fetchStreamsError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.isChangeConsumerPositionDisabled = true;
          this.sharedMethodService
            .showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: {
                status: (error as HttpErrorResponse)?.status,
                message: (error as HttpErrorResponse)?.message,
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
          this.consumerPositionForm.patchValue({
            consumer: this.selectedConsumer,
          });
        }
        this.isChangeConsumerPositionDisabled = !this.selectedConsumer
          ? true
          : false;
      });

    this.fetchConsumersError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.isChangeConsumerPositionDisabled = true;
          this.sharedMethodService
            .showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: {
                status: (error as HttpErrorResponse)?.status,
                message: (error as HttpErrorResponse)?.message,
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

    this.changeConsumerPositionError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.consumerPositionData = [];
          this.sharedMethodService
            .showActionErrorModal({
              type: ERROR_TYPES.SERVER_ERROR,
              details: {
                status: (error as HttpErrorResponse)?.status,
                message: (error as HttpErrorResponse)?.message,
              },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              if (this.focusMatSelect) {
                this.focusMatSelect.focus();
              }
            });
        }
      });

    this.changeConsumerPositionSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (this.isValidData(data)) {
          this.consumerPositionData = data;
          this.sharedMethodService.showSuccessSnackBar(
            CHANGE_CONSUMER_POSITION_LABELS.SUCCESS_SNACKBAR_MESSAGE
          );
        }
      });
  }

  onStreamChange(stream: string): void {
    this.consumerPositionForm.patchValue({
      stream: stream,
    });
    const params = {
      stream:
        this.consumerPositionForm.controls[STREAM_LABELS.STREAM_ID]?.value,
    };
    this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onPositionChange() {
    const consumerForm = <FormGroup>(
      (this.consumerPositionForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.LABEL
      ) as FormGroup)
    );
    const selectedPosition = consumerForm.get(
      CHANGE_CONSUMER_POSITION_LABELS.POSITION.VALUE
    )?.value;

    if (selectedPosition === CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE) {
      consumerForm
        .get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE)
        ?.enable();
      consumerForm
        .get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.PARTITION.VALUE)
        ?.enable();
    } else {
      consumerForm
        .get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE)
        ?.disable();
      consumerForm
        .get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.PARTITION.VALUE)
        ?.disable();
    }

    if (selectedPosition === CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE) {
      consumerForm
        .get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE)
        ?.enable();
    } else {
      consumerForm
        .get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE)
        ?.disable();
    }
  }

  changePosition() {
    let params: any = {
      consumer:
        this.consumerPositionForm.controls[
          CONSUMER_THREAD_POOL_LABELS.CONSUMER.LABEL
        ]?.value,
      stream:
        this.consumerPositionForm.controls[STREAM_LABELS.STREAM_ID]?.value,
    };
    const consumerForm = <FormGroup>(
      (this.consumerPositionForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.LABEL
      ) as FormGroup)
    );
    const selectedConsumerPosition = consumerForm.get(
      CHANGE_CONSUMER_POSITION_LABELS.POSITION.VALUE
    )?.value;

    if (
      selectedConsumerPosition ===
      CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE
    ) {
      const offset = consumerForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE
      )?.value;
      const partition = consumerForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.PARTITION.VALUE
      )?.value;

      params = { ...params, partition, offset };
    }

    if (
      selectedConsumerPosition ===
      CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE
    ) {
      const date = consumerForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE
      )?.value;
      params = { ...params, date: date.toISOString() };
    }

    this.store.dispatch(
      ConsumerPositionActions.onChangeConsumerPosition({
        consumerPosition: selectedConsumerPosition,
        params,
      })
    );
  }

  isValidData(data: any): boolean {
    //display consumer position data container if data is available else hide.
    if (!data) return false;
    if (Object.keys(data).length === 0) return false;
    return true;
  }

  showConfirmationModal(): void {
    const positionName = (
      this.consumerPositionForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.LABEL
      ) as FormGroup
    ).get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.VALUE)?.value;

    const date = (
      this.consumerPositionForm.get(
        CHANGE_CONSUMER_POSITION_LABELS.POSITION.LABEL
      ) as FormGroup
    ).get(CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE)?.value;
    if (
      positionName === CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE &&
      !date
    ) {
      this.sharedMethodService.showErrorSnackBar("Please select a valid date");
      return;
    }

    this.genericDialogRef = this.dialogService.open(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: CHANGE_CONSUMER_POSITION_LABELS.DIALOG_BOX_HEIGHT,
      width: CHANGE_CONSUMER_POSITION_LABELS.DIALOG_BOX_WIDTH,
      autoFocus: false,
      panelClass: "confirmation-dialog-height", // To set the height of the dialog based on the content
      data: {
        operationType: CHANGE_CONSUMER_POSITION_LABELS.OPERATION_TYPE,
        message:
          positionName ===
            CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE ||
          positionName === CHANGE_CONSUMER_POSITION_LABELS.POSITION.END.VALUE
            ? CHANGE_CONSUMER_POSITION_LABELS.BEGINNING_END_CONFIRM_MESSAGE.replace(
                "{positionName}",
                positionName.charAt(0).toUpperCase() + positionName.slice(1)
              )
            : positionName ===
              CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE
            ? CHANGE_CONSUMER_POSITION_LABELS.OFFSET_CONFIRM_MESSAGE
            : CHANGE_CONSUMER_POSITION_LABELS.DATE_CONFIRM_MESSAGE,
        title: CHANGE_CONSUMER_POSITION_LABELS.CONSUMER_POSITION_LABEL,
      },
    });
    this.genericDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data?.continue) {
          this.changePosition();
        }
        if (this.focusMatSelect) {
          this.focusMatSelect.focus();
        }
      });
  }
  
  clearRecords(): void {
    this.consumerPositionData = [];
    this.store.dispatch(ConsumerPositionActions.resetConsumerPositionData());
  }

  ngOnDestroy(): void {
    this.store.dispatch(ConsumerPositionActions.resetConsumerPositionData());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
