import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  type MockedObject,
  vi,
} from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StreamFormComponent } from "./stream-form.component";
import { StoreModule, Store } from "@ngrx/store";
import { ReactiveFormsModule } from "@angular/forms";
import { StreamService } from "../../services/stream.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import * as StreamActions from "../../store/actions";
import { ConsumerThreadPoolState, StreamsState } from "../../store/reducers";
import { STREAM_LABELS, STREAM_MOCK_API_FAILURE } from "../../stream.constants";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { RecordsPayload } from "../../stream.interface";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorModalComponent } from "../../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { ErrorDetails } from "../../../../shared/types/common.interface";
interface StreamServiceMock {
  getStreams: Mock;
  getConsumers: Mock;
  getRecords: Mock;
  startSSEStream: Mock;
  isFetchingRecords: {
    next: Mock;
  };
  isClearRecordsDisabled: BehaviorSubject<boolean>;
  isStopFetchDisabled: BehaviorSubject<boolean>;
  isViewRecordsDisabled: BehaviorSubject<boolean>;
  clearRecordsDisplay: {
    next: Mock;
  };
  streamDisconnected$: Observable<boolean>;
}

describe("StreamFormComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: StreamFormComponent;
  let fixture: ComponentFixture<StreamFormComponent>;
  let store: Store<{
    streams: StreamsState;
    consumerThreadPool: ConsumerThreadPoolState;
  }>;
  let streamServiceMock: StreamServiceMock;
  let storeSpy: MockedObject<
    Store<{
      streams: StreamsState;
      consumerThreadPool: ConsumerThreadPoolState;
    }>
  >;
  const mockError = new HttpErrorResponse({
    error: {
      status: STREAM_MOCK_API_FAILURE.STATUS_CODE,
      message: STREAM_MOCK_API_FAILURE.MESSAGE,
    },
  });
  let streamDisconnectedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    streamDisconnectedSubject = new BehaviorSubject<boolean>(false);
    streamServiceMock = {
      getStreams: vi.fn().mockReturnValue(of([])),
      getConsumers: vi.fn().mockReturnValue(of([])),
      getRecords: vi.fn().mockReturnValue(of([])),
      startSSEStream: vi.fn().mockReturnValue(of({})),
      isFetchingRecords: { next: vi.fn() },
      isClearRecordsDisabled: new BehaviorSubject(false),
      isStopFetchDisabled: new BehaviorSubject(false),
      isViewRecordsDisabled: new BehaviorSubject(false),
      clearRecordsDisplay: { next: vi.fn() },
      streamDisconnected$: streamDisconnectedSubject.asObservable(),
    };
    storeSpy = {
      dispatch: vi.fn().mockName("Store.dispatch"),
      pipe: vi.fn().mockName("Store.pipe"),
    } as any;

    storeSpy.pipe.mockReturnValue(of([]));
    storeSpy.pipe
      .mockReturnValueOnce(of([]))
      .mockReturnValueOnce(of(null))
      .mockReturnValueOnce(of([]))
      .mockReturnValueOnce(of(null));

    await TestBed.configureTestingModule({
      declarations: [StreamFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatDialogModule,
        CommonModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: StreamService, useValue: streamServiceMock },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    component.STREAM_LABELS = STREAM_LABELS;
    component.GENERIC_LABELS = GENERIC_LABELS;
    component.fetchRecordsError$ = of(mockError);
    streamDisconnectedSubject.next(true);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form group with controls", () => {
    expect(component.streamForm.contains("stream")).toBeTruthy();
    expect(component.streamForm.contains("position")).toBeTruthy();
  });

  it("should dispatch fetchStreams action on ngOnInit if no streams are fetched", () => {
    component.fetchStreamsSuccess$ = of([]);
    component.fetchRecordsError$ = of(mockError);
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(StreamActions.fetchStreams());
  });

  it("should dispatch fetchConsumers action when a stream is selected", () => {
    const stream = { name: "stream1" };
    component.streams = [stream];
    component.streamForm.patchValue({ stream: "stream1" });
    component.onStreamChange("stream1");
    expect(store.dispatch).toHaveBeenCalledWith(
      StreamActions.fetchConsumers({ params: { stream: "stream1" } })
    );
    expect(component.isSubmitBtnDisabled).toBe(false);
  });

  it("should update selectedConsumer on consumer option change", () => {
    const selectedValue = "consumer1";
    component.onConsumerOptionChange(selectedValue);
    expect(component.selectedConsumer).toBe(selectedValue);
  });

  it("should call onStreamFormSubmit and dispatch triggerRecordsSSEStream", () => {
    component.isSubmitBtnDisabled = false;
    component.streamForm.patchValue({
      [STREAM_LABELS.STREAM_ID]: "stream1",
      [STREAM_LABELS.REWIND_ID]: "0",
      [STREAM_LABELS.LIMIT_ID]: "1",
      [STREAM_LABELS.TIMEOUT_ID]: "1",
    });

    vi.spyOn(component, "convertTimeout").mockReturnValue("1ms");
    vi.spyOn(component, "getPositionValue");

    component.onStreamFormSubmit();

    expect(component.isSubmitBtnDisabled).toBe(true);
    expect(component.getPositionValue).toHaveBeenCalledWith({
      stream: "stream1",
      rewind: "0",
      limit: "1",
      timeout: "1ms",
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      StreamActions.triggerRecordsSSEStream({
        params: {
          stream: "stream1",
          rewind: "0",
          limit: "1",
          timeout: "1ms",
        },
      })
    );
  });

  it("should dispatch onStopFetch action when onStopFetch is called", () => {
    component.onStopFetch();
    expect(store.dispatch).toHaveBeenCalledWith(StreamActions.onStopFetch());
  });

  it("should dispatch resetFetchRecordsState and clear records on onClearRecords", () => {
    component.onClearRecords();
    expect(store.dispatch).toHaveBeenCalledWith(
      StreamActions.resetFetchRecordsState()
    );
  });

  it("should subscribe to button state observables in ngOnInit", () => {
    fixture.detectChanges();
    expect(component.isClearBtnDisabled).toBe(false);
    expect(component.isStopFetchBtnDisabled).toBe(false);
    expect(component.isSubmitBtnDisabled).toBe(false);
  });

  it("should initialize form with default values", () => {
    expect(component.streamForm.getRawValue()).toEqual({
      stream: "",
      position: component.STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE,
      rewind: "0",
      limit: "1",
      timeout: "0s",
      offset: 0,
      partition: 0,
      selectedConsumer: "",
    });
    expect(component.streamForm.get("offset")?.disabled).toBe(true);
    expect(component.streamForm.get("partition")?.disabled).toBe(true);
    expect(component.streamForm.get("selectedConsumer")?.disabled).toBe(true);
  });

  it("should update selected consumer on change", () => {
    component.onConsumerOptionChange("consumer1");
    expect(component.selectedConsumer).toBe("consumer1");
  });

  it("should update stream on change and dispatch fetchConsumers", () => {
    component.onStreamChange("newStream");
    expect(component.streamForm.value.stream).toBe("newStream");
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      StreamActions.fetchConsumers({ params: { stream: "newStream" } })
    );
  });

  it("should update rewind value and form field", () => {
    component.onRewindValSelect("5");
    expect(component.selectedRewindValue).toBe("5");
    expect(component.streamForm.value.rewind).toBe("5");
  });

  it("should update limit value and form field", () => {
    component.onLimitValSelect("10");
    expect(component.selectedLimitValue).toBe("10");
    expect(component.streamForm.value.limit).toBe("10");
  });

  it("should update timeout value and form field", () => {
    component.onTimeoutValSelect("30s");
    expect(component.selectedTimeoutValue).toBe("30s");
    expect(component.streamForm.value.timeout).toBe("30s");
  });

  it("should call convertTimeout and return correct values", () => {
    expect(component.convertTimeout("1min")).toBe("60s");
    expect(component.convertTimeout("30s")).toBe("30s");
  });

  it("should determine position value correctly", () => {
    const params = {} as RecordsPayload;
    component.streamForm.patchValue({
      position: component.STREAM_LABELS.POSITION_OPTIONS.TAIL.VALUE,
    });
    component.getPositionValue(params);
    expect(params.fromTail).toBe(true);
  });

  it("should dispatch stop fetch action", () => {
    component.onStopFetch();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(StreamActions.onStopFetch());
  });

  it("should dispatch reset fetch records state and update UI on clear records", () => {
    component.onClearRecords();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      StreamActions.resetFetchRecordsState()
    );
    expect(component.isSubmitBtnDisabled).toBe(false);
    expect(component.isClearBtnDisabled).toBe(true);
  });
  it("should properly initialize component values in ngOnInit", () => {
    component.ngOnInit();
    expect(component.rewindValues).toEqual(STREAM_LABELS.REWIND_VALUES);
    expect(component.selectedRewindValue).toBe(STREAM_LABELS.REWIND_VALUES[0]);
    expect(component.limitValues).toEqual(STREAM_LABELS.LIMIT_VALUES);
    expect(component.selectedLimitValue).toBe(STREAM_LABELS.LIMIT_VALUES[0]);
    expect(component.timeoutValues).toEqual(STREAM_LABELS.TIMEOUT_VALUES);
    expect(component.selectedTimeoutValue).toBe(
      STREAM_LABELS.TIMEOUT_VALUES[0]
    );
  });

  it("should enable/disable form controls based on position value changes", () => {
    component.ngOnInit();

    component.streamForm
      .get("position")
      ?.setValue(STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE);
    expect(component.streamForm.get("offset")?.enabled).toBe(true);
    expect(component.streamForm.get("partition")?.enabled).toBe(true);
    expect(component.streamForm.get("selectedConsumer")?.disabled).toBe(true);

    component.streamForm.get("position")?.setValue("consumer");
    expect(component.streamForm.get("offset")?.disabled).toBe(true);
    expect(component.streamForm.get("partition")?.disabled).toBe(true);
    expect(component.streamForm.get("selectedConsumer")?.enabled).toBe(true);

    component.streamForm
      .get("position")
      ?.setValue(STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE);
    expect(component.streamForm.get("offset")?.disabled).toBe(true);
    expect(component.streamForm.get("partition")?.disabled).toBe(true);
    expect(component.streamForm.get("selectedConsumer")?.disabled).toBe(true);
  });

  it("should handle streams data when fetchStreamsSuccess$ emits", () => {
    const mockStreams = [{ name: "stream1" }];
    storeSpy.pipe.mockReturnValue(of(mockStreams));
    component.fetchStreamsSuccess$ = of(mockStreams);
    component.ngOnInit();
    expect(component.streams).toEqual(mockStreams);
    expect(component.streamForm.get("stream")?.value).toBe("stream1");
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      StreamActions.fetchConsumers({ params: { stream: "stream1" } })
    );
  });

  it("should handle empty streams data and dispatch fetchStreams", () => {
    storeSpy.pipe.mockReturnValue(of([]));
    component.fetchStreamsSuccess$ = of([]);
    component.ngOnInit();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      StreamActions.fetchStreams()
    );
  });

  it("should handle consumers data when fetchConsumersSuccess$ emits", () => {
    const mockConsumers = [{ stream: "stream1", consumer: "consumer1" }];
    component.fetchConsumersSuccess$ = of(mockConsumers);
    component.ngOnInit();
    expect(component.consumers).toEqual(mockConsumers);
    expect(component.selectedConsumer).toBe("consumer1");
    expect(component.streamForm.get("selectedConsumer")?.value).toBe(
      "consumer1"
    );
  });

  it("should handle stream error and show error modal when error object is present", () => {
    vi.spyOn(component, "showActionErrorModal");
    component.fetchStreamsError$ = of(mockError);
    component.ngOnInit();
    expect(component.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: mockError.error.status,
        message: mockError.error.message,
      },
    });
  });

  it("should handle stream error and show error modal when error object is not present", () => {
    const mockError = new HttpErrorResponse({
      status: STREAM_MOCK_API_FAILURE.STATUS_CODE,
      statusText: STREAM_MOCK_API_FAILURE.MESSAGE,
    });
    vi.spyOn(component, "showActionErrorModal");
    component.fetchStreamsError$ = of(mockError);
    component.ngOnInit();
    expect(component.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: mockError.status,
        message: mockError.message,
      },
    });
  });

  it("should open error modal dialog with correct configuration", () => {
    const mockError: ErrorDetails = {
      type: ERROR_TYPES.SERVER_ERROR,
      details: {
        status: STREAM_MOCK_API_FAILURE.STATUS_CODE,
        message: STREAM_MOCK_API_FAILURE.MESSAGE,
      },
    };

    const dialogOpenSpy = vi
      .spyOn(component.dialogService, "open")
      .mockReturnValue({} as any);
    component.showActionErrorModal(mockError);

    expect(dialogOpenSpy).toHaveBeenCalledWith(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      autoFocus: false,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error: mockError,
      },
    });
  });

  it("should handle different position values correctly in getPositionValue", () => {
    const tailParams: RecordsPayload = {
      stream: "",
      rewind: "",
      limit: "",
      timeout: "",
    };
    component.streamForm.patchValue({
      position: STREAM_LABELS.POSITION_OPTIONS.TAIL.VALUE,
    });

    component.getPositionValue(tailParams);
    expect(tailParams.fromTail).toBe(true);
    expect(tailParams.fromGroup).toBeUndefined();
    expect(tailParams.fromOffset).toBeUndefined();
    expect(tailParams.partition).toBeUndefined();

    const consumerParams: RecordsPayload = {
      stream: "",
      rewind: "",
      limit: "",
      timeout: "",
    };
    component.streamForm.patchValue({
      position: STREAM_LABELS.POSITION_OPTIONS.CONSUMER.VALUE,
    });
    component.selectedConsumer = "testConsumer";

    component.getPositionValue(consumerParams);
    expect(consumerParams.fromTail).toBeUndefined();
    expect(consumerParams.fromGroup).toBe("testConsumer");
    expect(consumerParams.fromOffset).toBeUndefined();
    expect(consumerParams.partition).toBeUndefined();

    const offsetParams: RecordsPayload = {
      stream: "",
      rewind: "",
      limit: "",
      timeout: "",
    };

    component.streamForm.patchValue({
      position: STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE,
      [STREAM_LABELS.POSITION_OPTIONS.OFFSET.VALUE]: 100,
      [STREAM_LABELS.POSITION_OPTIONS.PARTITITON.VALUE]: 1,
    });

    component.getPositionValue(offsetParams);
    expect(offsetParams.fromTail).toBeUndefined();
    expect(offsetParams.fromGroup).toBeUndefined();
    expect(offsetParams.fromOffset).toBe("100");
    expect(offsetParams.partition).toBe("1");

    const defaultParams: RecordsPayload = {
      stream: "",
      rewind: "",
      limit: "",
      timeout: "",
    };
    component.streamForm.patchValue({
      position: STREAM_LABELS.POSITION_OPTIONS.BEGINNING.VALUE,
    });

    component.getPositionValue(defaultParams);
    expect(defaultParams.fromTail).toBeUndefined();
    expect(defaultParams.fromGroup).toBeUndefined();
    expect(defaultParams.fromOffset).toBeUndefined();
    expect(defaultParams.partition).toBeUndefined();
  });

  it("should NOT show error modal if event stream is disconnected", () => {
    vi.spyOn(component, "showActionErrorModal");
    component.isEventStreamDisconnected = true;
    fixture.detectChanges();
    expect(component.showActionErrorModal).not.toHaveBeenCalled();
  });

  it("should NOT show error modal if there is no error", () => {
    vi.spyOn(component, "showActionErrorModal");
    component.isEventStreamDisconnected = false;
    component.fetchRecordsError$ = of(null);
    fixture.detectChanges();
    expect(component.showActionErrorModal).not.toHaveBeenCalled();
  });

  it("should call showActionErrorModal with correct details when fetchConsumersError$ emits an error with error object", () => {
    vi.spyOn(component, "showActionErrorModal");
    const error = new HttpErrorResponse({
      error: { status: 404, message: "Test error" },
    });
    component.fetchConsumersError$ = of(error);
    component.ngOnInit();
    expect(component.showActionErrorModal).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: error.error.status,
          message: error.error.message,
        },
      })
    );
  });

  it("should call showActionErrorModal with correct details when fetchConsumersError$ emits an error without error object", () => {
    vi.spyOn(component, "showActionErrorModal");
    const error = new HttpErrorResponse({
      status: 404,
      statusText: "Test error",
    });
    component.fetchConsumersError$ = of(error);
    component.ngOnInit();
    expect(component.showActionErrorModal).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: error.status,
          message: error.message,
        },
      })
    );
  });

  it("should NOT call showActionErrorModal if fetchConsumersError$ emits null/undefined", () => {
    vi.spyOn(component, "showActionErrorModal");
    component.fetchConsumersError$ = of(null);
    expect(component.showActionErrorModal).not.toHaveBeenCalled();
  });

  it("should convert timeout values correctly", () => {
    fixture.detectChanges();
    component.STREAM_LABELS.TIMEOUT_VALUES = ["0s"];
    component.STREAM_LABELS.DEFAULT_TIMEOUT_VALUE = "1ms";
    const value = component.convertTimeout("0s");
    expect(value).toBe("1ms");
  });

  it("should unsubscribe from all subscriptions on destroy", () => {
    vi.spyOn((component as any).destroy$, "next");
    vi.spyOn((component as any).destroy$, "complete");
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  it("should unsubscribe from all subscriptions", async () => {
    let unsubscribed = false;
    (component as any).destroy$.subscribe({
      complete: () => {
        unsubscribed = true;
      },
    });
    component.ngOnDestroy();
    expect(unsubscribed).toBe(true);
  });

  it("should dispatch resetStreamErrorState and update service states on ngOnDestroy", () => {
    vi.spyOn(streamServiceMock.isStopFetchDisabled, "next");
    vi.spyOn(streamServiceMock.isViewRecordsDisabled, "next");
    vi.spyOn(streamServiceMock.isClearRecordsDisabled, "next");
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(
      StreamActions.resetStreamErrorState()
    );
    expect(streamServiceMock.isStopFetchDisabled.next).toHaveBeenCalledWith(
      true
    );
    expect(streamServiceMock.isViewRecordsDisabled.next).toHaveBeenCalledWith(
      false
    );
    expect(streamServiceMock.isClearRecordsDisabled.next).toHaveBeenCalledWith(
      true
    );
  });
});
