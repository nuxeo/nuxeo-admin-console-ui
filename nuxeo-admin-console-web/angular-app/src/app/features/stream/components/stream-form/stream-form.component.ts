import {
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { STREAM_LABELS } from "../../stream.constants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as StreamActions from "../../store/actions";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../../store/reducers";
import { Observable, Subscription } from "rxjs";
import { Stream } from "../../stream.interface";
import { StreamService } from "../../services/stream.service";
import { GENERIC_LABELS } from "./../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

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

  constructor(
    private fb: FormBuilder,
    private store: Store<{ streams: StreamsState }>,
    private streamService: StreamService
  ) {
    this.streamForm = this.fb.group({
      stream: ["", Validators.required],
      position: ["beginning", Validators.required],
      rewind: [""],
      limit: [""],
      timeout: [""],
      offset: [0],
      partition: [0]
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
  }

  ngOnInit(): void {
    this.rewindValues = STREAM_LABELS.REWIND_VALUES;
    this.selectedRewindValue = this.rewindValues[0];
    this.limitValues = STREAM_LABELS.LIMIT_VALUES;
    this.selectedLimitValue = this.limitValues[0];
    this.timeoutValues = STREAM_LABELS.TIMEOUT_VALUES;
    this.selectedTimeoutValue = this.timeoutValues[0];

    this.streamForm.get('rewind')?.setValue(this.selectedRewindValue);
    this.streamForm.get('limit')?.setValue(this.selectedLimitValue);
    this.streamForm.get('timeout')?.setValue(this.selectedTimeoutValue);
    // this.streamForm.get('offset')?.setValue("1");
    // this.streamForm.get('partition')?.setValue("1");



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
            stream: this.streamForm?.controls["stream"]?.value,
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
          console.log(error);
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
          //  this.streamForm.get("position")?.setValue(this.selectedConsumer);
          }
        }
      );

    this.fetchConsumersErrorSubscription = this.fetchConsumersError$.subscribe(
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }

  onConsumerOptionChange(selectedValue: string): void {
    this.selectedConsumer = selectedValue;
   // this.streamForm.get("position")?.setValue(selectedValue);
  }

  onStreamChange(value: string): void {
    this.isSubmitBtnDisabled = false;
    this.streamForm.patchValue({
      stream: value,
    });
    const params = {
      stream: this.streamForm.controls["stream"]?.value,
    };
    this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onRewindValSelect(value: string): void {
    this.selectedRewindValue = value;
    this.streamForm.patchValue({
      rewind: value
    });
    const params = {
      stream: this.streamForm.controls["rewind"]?.value,
    };
    //  this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onLimitValSelect(value: string): void {
    this.selectedLimitValue = value;
    this.streamForm.patchValue({
      limit: value
    });
    const params = {
      stream: this.streamForm.controls["limit"]?.value,
    };
    //  this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onTimeoutValSelect(value: string): void {
    this.selectedTimeoutValue = value;
    this.streamForm.patchValue({
      timeout: value
    });
    const params = {
      stream: this.streamForm.controls["timeout"]?.value,
    };
    //  this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onStreamFormSubmit(): void {
    if (this.streamForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      const params = {
        stream: this.streamForm?.get("stream")?.value,
        fromGroup: this.streamForm?.get("position")?.value,
        rewind: this.streamForm?.get("rewind")?.value,
        limit: this.streamForm?.get("limit")?.value,
        timeout: this.streamForm?.get("timeout")?.value,
        offset: this.streamForm?.get("offset")?.value,
        partition: this.streamForm?.get("partition")?.value,

      };

      console.log("Form values :::: ", params);
      this.store.dispatch(StreamActions.triggerRecordsSSEStream({ params }));
      this.streamService.isFetchingRecords.next(true);
      this.streamService.isStopFetchDisabled.next(false);
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
    document.getElementById("stream")?.focus();
  }


  ngOnDestroy(): void {
    this.store.dispatch(StreamActions.resetFetchStreamsState());
    this.store.dispatch(StreamActions.resetFetchConsumersState());
    this.store.dispatch(StreamActions.resetFetchRecordsState());
    this.store.dispatch(StreamActions.resetStopFetchState());
    this.fetchStreamsSuccessSubscription?.unsubscribe();
    this.fetchStreamsErrorSubscription?.unsubscribe();
    this.fetchConsumersSuccessSubscription?.unsubscribe();
    this.fetchConsumersErrorSubscription?.unsubscribe();
    this.isClearBtnDisabledSubscription?.unsubscribe();
    this.isStopFetchBtnDisabledSubscription?.unsubscribe();
    this.isViewRecordsDisabledSubscription?.unsubscribe();
  }
}
