import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConsumerThreadPoolComponent } from "./consumer-thread-pool.component";
import { ConsumerThreadPoolState, StreamsState } from "../../store/reducers";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import * as StreamActions from "../../store/actions";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ErrorModalComponent } from "../../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import {
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "./../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ErrorDetails } from "../../../../shared/types/common.interface";
import {
  CONSUMER_THREAD_POOL_LABELS,
  STREAM_LABELS,
} from "../../stream.constants";
import { StreamService } from "../../services/stream.service";

describe("ConsumerThreadPoolComponent", () => {
  let component: ConsumerThreadPoolComponent;
  let fixture: ComponentFixture<ConsumerThreadPoolComponent>;
  let storeSpy: jasmine.SpyObj<
    Store<{
      streams: StreamsState;
      consumerThreadPool: ConsumerThreadPoolState;
    }>
  >;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let streamServiceSpy: jasmine.SpyObj<StreamService>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["dispatch", "pipe", "select"]);
    storeSpy.select.and.returnValue(of({ streamDataLoaded: true }));
    storeSpy.pipe.and.returnValue(of([]));
    streamServiceSpy = jasmine.createSpyObj("StreamService", [
      "showSuccessMessage",
    ]);

    matDialogSpy = jasmine.createSpyObj("MatDialog", ["open", "closeAll"]);
    httpClientSpy = jasmine.createSpyObj("HttpClient", [
      "get",
      "post",
      "put",
      "delete",
    ]);
    matSnackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open", "dismiss"]);

    TestBed.configureTestingModule({
      declarations: [ConsumerThreadPoolComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: StreamService, useValue: streamServiceSpy },
      ],
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerThreadPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("onStartStopConsumerThreadPool", () => {
    it("should dispatch onStartConsumerThreadPoolLaunch when operationType is CONSUMER_THREAD_POOL_START", () => {
      const consumerValue = "mock-consumer";
      component.streamForm.get("consumer")?.setValue(consumerValue);
      component.onStartStopConsumerThreadPool(
        component.CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
      );
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: StreamActions.onStartConsumerThreadPoolLaunch.type,
          params: { consumer: consumerValue },
        })
      );
    });

    it("should dispatch onStopConsumerThreadPoolLaunch when operationType is CONSUMER_THREAD_POOL_STOP", () => {
      const consumerValue = "mock-consumer";
      component.streamForm.get("consumer")?.setValue(consumerValue);
      component.onStartStopConsumerThreadPool(
        component.CONSUMER_THREAD_POOL_LABELS.STOP_CONSUMER_THREAD_POOL
      );
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: StreamActions.onStopConsumerThreadPoolLaunch.type,
          params: { consumer: consumerValue },
        })
      );
    });
  });

  describe("onStreamChange", () => {
    it("should patch the stream value in the form and dispatch fetchConsumers with correct params", () => {
      const streamValue = "mock-stream";
      component.streamForm.get("stream")?.setValue("");
      component.onStreamChange(streamValue);
      expect(component.streamForm.get("stream")?.value).toBe(streamValue);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: StreamActions.fetchConsumers.type,
          params: { stream: streamValue },
        })
      );
    });

    it("should use STREAM_LABELS.STREAM_ID as form control key for params", () => {
      const streamName = "mock-stream";
      component.streamForm.patchValue({ stream: streamName });
      component.onStreamChange(streamName);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: StreamActions.fetchConsumers.type,
          params: { stream: streamName },
        })
      );
    });

    it("should not throw if streamForm.controls[STREAM_LABELS.STREAM_ID] is undefined", () => {
      component.streamForm.removeControl(component.STREAM_LABELS.STREAM_ID);
      expect(() => component.onStreamChange("mock-stream")).not.toThrow();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: StreamActions.fetchConsumers.type,
          params: { stream: undefined },
        })
      );
    });
  });

  describe("showConfirmationModal", () => {
    beforeEach(() => {
      component.streamForm
        .get(component.CONSUMER_THREAD_POOL_LABELS.CONSUMER_LABEL)
        ?.setValue("consumer/urn");
      component.isStartOrStopConsumerThreadInProgress = false;
      matDialogSpy.open.and.returnValue({
        afterClosed: () => of({ continue: true }),
      } as any);
      spyOn(component, "onStartStopConsumerThreadPool");
      spyOn(component, "showActionErrorModal");
      component.focusMatSelect = { focus: jasmine.createSpy("focus") } as any;
    });

    it("should open confirmation modal and call onStartStopConsumerThreadPool for START", () => {
      component.showConfirmationModal(
        component.CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
      );
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            operationType:
              component.CONSUMER_THREAD_POOL_LABELS
                .CONSUMER_THREAD_POOL_OPERATION,
            message: jasmine.stringMatching(/start/),
            title: "Start Consumer Thread Pools",
          }),
        })
      );
      expect(component.onStartStopConsumerThreadPool).toHaveBeenCalledWith(
        component.CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
      );
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should open confirmation modal and call onStartStopConsumerThreadPool for STOP", () => {
      component.showConfirmationModal(
        component.CONSUMER_THREAD_POOL_LABELS.STOP_CONSUMER_THREAD_POOL
      );
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            operationType:
              component.CONSUMER_THREAD_POOL_LABELS
                .CONSUMER_THREAD_POOL_OPERATION,
            message: jasmine.stringMatching(/stop/),
            title: "Stop Consumer Thread Pools",
          }),
        })
      );
      expect(component.onStartStopConsumerThreadPool).toHaveBeenCalledWith(
        component.CONSUMER_THREAD_POOL_LABELS.STOP_CONSUMER_THREAD_POOL
      );
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should not call onStartStopConsumerThreadPool if continue is false", () => {
      matDialogSpy.open.and.returnValue({
        afterClosed: () => of({ continue: false }),
      } as any);
      component.showConfirmationModal(
        component.CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
      );
      expect(component.onStartStopConsumerThreadPool).not.toHaveBeenCalled();
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should show error modal if operation is in progress", () => {
      component.isStartOrStopConsumerThreadInProgress = true;
      component.showConfirmationModal(
        component.CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
      );
      expect(component.showActionErrorModal).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: ERROR_TYPES.SERVER_ERROR,
          details: jasmine.objectContaining({
            message:
              component.CONSUMER_THREAD_POOL_LABELS
                .CONSUMER_THREAD_POOL_OPERATION_IN_PROGRESS_MSG,
          }),
        }),
        "error-dialog-height"
      );
    });

    it("should handle selectedConsumer with '/' in confirmation message", () => {
      component.streamForm
        .get(component.CONSUMER_THREAD_POOL_LABELS.CONSUMER_LABEL)
        ?.setValue("stream/consumer");
      component.showConfirmationModal(
        component.CONSUMER_THREAD_POOL_LABELS.START_CONSUMER_THREAD_POOL
      );
      const call = matDialogSpy.open.calls.mostRecent();
      const dialogArgs = call.args[1] as { data?: { message?: string } };
      expect(dialogArgs?.data?.message).toContain("stream-consumer");
    });
  });

  describe("showActionErrorModal", () => {
    let errorDetails: ErrorDetails;
    beforeEach(() => {
      errorDetails = {
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: 500,
          message: "Internal Server Error",
        },
      };
      component.focusMatSelect = { focus: jasmine.createSpy("focus") } as any;
      matDialogSpy.open.and.returnValue({
        afterClosed: () => of({}),
      } as any);
    });

    it("should open ErrorModalComponent with correct error data", () => {
      component.showActionErrorModal(errorDetails);
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.objectContaining({
          data: { error: errorDetails },
          disableClose: true,
          hasBackdrop: true,
          height: MODAL_DIMENSIONS.HEIGHT,
          width: MODAL_DIMENSIONS.WIDTH,
          autoFocus: false,
        })
      );
    });

    it("should focus mat select after error dialog is closed", () => {
      component.showActionErrorModal(errorDetails);
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should handle missing focusMatSelect gracefully", () => {
      component.focusMatSelect = undefined as any;
      expect(() => component.showActionErrorModal(errorDetails)).not.toThrow();
    });
  });

  describe("Stream data loaded subscription", () => {
    beforeEach(() => {
      spyOn(component, "showActionErrorModal");
    });

    it("should dispatch fetchStreams action when streams data is not loaded", () => {
      storeSpy.select.and.returnValue(of(false));
      storeSpy.pipe.and.returnValue(of(false));
      component.ngOnInit();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        StreamActions.fetchStreams()
      );
    });

    it("should not dispatch fetchStreams action when streams data is already loaded", () => {
      storeSpy.select.and.returnValue(of(true));
      storeSpy.pipe.and.returnValue(of(true));
      component.ngOnInit();
      expect(storeSpy.dispatch).not.toHaveBeenCalledWith(
        StreamActions.fetchStreams()
      );
    });

    it("should handle successful streams fetch with data", () => {
      const mockStreams = [
        { name: "mock-stream-1", id: "mock-id-1" },
        { name: "mock-stream-2", id: "mock-id-2" },
      ];
      component.fetchStreamsSuccess$ = of(mockStreams);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.streams).toEqual(mockStreams);
      expect(component.streamForm.get("stream")?.value).toBe("mock-stream-1");
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        StreamActions.fetchConsumers({
          params: {
            stream:
              component.streamForm?.controls[STREAM_LABELS.STREAM_ID]?.value,
          },
        })
      );
    });

    it("should not process when streams data is empty", () => {
      component.fetchStreamsSuccess$ = of([]);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.streams).toEqual([]);
      expect(storeSpy.dispatch).not.toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: jasmine.stringMatching(/fetchConsumers/),
        })
      );
    });

    it("should handle streams fetch error when error object is present", () => {
      const mockError = new HttpErrorResponse({
        error: { status: 500, message: "mock-error" }
      });
      component.fetchStreamsError$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.isStartStopConsumerThreadBtnDisabled).toBe(true);
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle streams fetch error when error object not is present", () => {
      const mockError = new HttpErrorResponse({
       status: 500, statusText: "mock-error"
      });
      component.fetchStreamsError$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.isStartStopConsumerThreadBtnDisabled).toBe(true);
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should handle successful consumers fetch with empty data", () => {
      component.fetchConsumersSuccess$ = of([]);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.consumers).toEqual([]);
      expect(component.isStartStopConsumerThreadBtnDisabled).toBe(true);
    });

    it("should handle consumers fetch error when error object is present", () => {
      const mockError = new HttpErrorResponse({
        error: { status: 500, message: "mock-error" }
      });
      component.fetchConsumersError$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.isStartStopConsumerThreadBtnDisabled).toBe(true);
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle consumers fetch error when error object is not present", () => {
      const mockError = new HttpErrorResponse({
       status: 500, statusText: "mock-error"
      });
      component.fetchConsumersError$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.isStartStopConsumerThreadBtnDisabled).toBe(true);
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should not show success message when start process is not completed", () => {
      const mockState: ConsumerThreadPoolState = {
        isStartStopConsumerPoolProcessRunning: false,
        isStartProcessCompleted: false,
        isStopProcessCompleted: false,
        isStartConsumerStoppedError: null,
        isStopConsumerStoppedError: null,
      };
      component.isStartConsumerThreadPoolSuccess$ = of(mockState);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(streamServiceSpy.showSuccessMessage).not.toHaveBeenCalled();
    });

    it("should handle start consumer thread pool failure when error object is present", () => {
      const mockError = new HttpErrorResponse({
       error:{ status: 500, message: "mock-error" }
      });
      component.isStartConsumerThreadPoolFailure$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle start consumer thread pool failure when error object is not present", () => {
      const mockError = new HttpErrorResponse({
       status: 500, statusText: "mock-error"
      });
      component.isStartConsumerThreadPoolFailure$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should handle stop consumer thread pool success", () => {
      const mockState: ConsumerThreadPoolState = {
        isStartStopConsumerPoolProcessRunning: false,
        isStopProcessCompleted: true,
        isStartProcessCompleted: false,
        isStartConsumerStoppedError: null,
        isStopConsumerStoppedError: null,
      };
      component.isStopConsumerThreadPoolSuccess$ = of(mockState);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.isStartOrStopConsumerThreadInProgress).toBe(false);
      expect(streamServiceSpy.showSuccessMessage).toHaveBeenCalledWith(
        CONSUMER_THREAD_POOL_LABELS.STOP_CONSUMER_SUCCESS_MSG
      );
    });

    it("should not show success message when stop process is not completed", () => {
      const mockState: ConsumerThreadPoolState = {
        isStartStopConsumerPoolProcessRunning: true,
        isStopProcessCompleted: false,
        isStartProcessCompleted: false,
        isStartConsumerStoppedError: null,
        isStopConsumerStoppedError: null,
      };
      component.isStopConsumerThreadPoolSuccess$ = of(mockState);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(streamServiceSpy.showSuccessMessage).not.toHaveBeenCalled();
    });

    it("should handle stop consumer thread pool failure when error object is present", () => {
      const mockError = new HttpErrorResponse({
        error: { status: 500, message: "mock-error" },
      });
      component.isStopConsumerThreadPoolFailure$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle stop consumer thread pool failure when error object is not present", () => {
      const mockError = new HttpErrorResponse({
        status: 500, statusText: "mock-error"
      });
      component.isStopConsumerThreadPoolFailure$ = of(mockError);
      storeSpy.select.and.returnValue(of(true));
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });
  });
});
