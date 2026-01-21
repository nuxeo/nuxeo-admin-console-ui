import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
  afterEach,
} from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChangeConsumerPositionComponent } from "../../consumer-position/change-consumer-position/change-consumer-position.component";
import { Store } from "@ngrx/store";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StreamService } from "../../../services/stream.service";
import { StreamsState } from "../../../store/reducers";
import { of } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatNativeDateModule } from "@angular/material/core";
import * as StreamActions from "../../../store/actions";
import * as ConsumerPositionActions from "../store/actions";
import {
  CHANGE_CONSUMER_POSITION_LABELS,
  CONSUMER_THREAD_POOL_LABELS,
} from "../../../stream.constants";
import { SharedMethodsService } from "../../../../../shared/services/shared-methods.service";
import { ERROR_TYPES } from "../../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ChangeConsumerPositionState } from "../store/reducers";
import { MatTabsModule } from "@angular/material/tabs";
interface ErrorModalClosedInfo {
  isClosed: boolean;
  event: any;
}

describe("ChangeConsumerPositionComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: ChangeConsumerPositionComponent;
  let fixture: ComponentFixture<ChangeConsumerPositionComponent>;
  let storeSpy: MockedObject<
    Store<{
      streams: StreamsState;
      consumerPosition: ChangeConsumerPositionState;
    }>
  >;
  let matDialogSpy: MockedObject<MatDialog>;
  let httpClientSpy: MockedObject<HttpClient>;
  let matSnackBarSpy: MockedObject<MatSnackBar>;
  let streamServiceSpy: MockedObject<StreamService>;
  let sharedMethodServiceSpy: MockedObject<SharedMethodsService>;
  beforeEach(() => {
    // Suppress console errors during tests to reduce noise
    vi.spyOn(console, "error").mockImplementation(() => {});

    storeSpy = {
      dispatch: vi.fn().mockName("Store.dispatch"),
      pipe: vi.fn().mockName("Store.pipe"),
      select: vi.fn().mockName("Store.select"),
    } as any;
    storeSpy.select.mockReturnValue(of({ streamDataLoaded: true }));
    storeSpy.pipe.mockReturnValue(of([]));
    streamServiceSpy = {
      showSuccessMessage: vi.fn().mockName("StreamService.showSuccessMessage"),
    } as any;

    matDialogSpy = {
      open: vi.fn().mockName("MatDialog.open"),
      closeAll: vi.fn().mockName("MatDialog.closeAll"),
    } as any;
    httpClientSpy = {
      get: vi.fn().mockName("HttpClient.get"),
      post: vi.fn().mockName("HttpClient.post"),
      put: vi.fn().mockName("HttpClient.put"),
      delete: vi.fn().mockName("HttpClient.delete"),
    } as any;
    matSnackBarSpy = {
      open: vi.fn().mockName("MatSnackBar.open"),
      dismiss: vi.fn().mockName("MatSnackBar.dismiss"),
    } as any;
    sharedMethodServiceSpy = {
      showActionErrorModal: vi
        .fn()
        .mockReturnValue(of({ isClosed: true, event: {} })), // ← FIX: Return Observable
      showSuccessSnackBar: vi
        .fn()
        .mockName("SharedMethodsService.showSuccessSnackBar"),
      showErrorSnackBar: vi
        .fn()
        .mockName("SharedMethodsService.showErrorSnackBar"),
    } as any;
    TestBed.configureTestingModule({
      declarations: [ChangeConsumerPositionComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: StreamService, useValue: streamServiceSpy },
        { provide: SharedMethodsService, useValue: sharedMethodServiceSpy },
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
        MatDividerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatTabsModule,
      ],
    });
    fixture = TestBed.createComponent(ChangeConsumerPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("onStreamChange", () => {
    it("should patch the stream value in the form and dispatch fetchConsumers with correct params", () => {
      const streamValue = "mock-stream";
      component.consumerPositionForm.get("stream")?.setValue("");
      component.onStreamChange(streamValue);
      expect(component.consumerPositionForm.get("stream")?.value).toBe(
        streamValue
      );
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StreamActions.fetchConsumers.type,
          params: { stream: streamValue },
        })
      );
    });

    it("should use STREAM_LABELS.STREAM_ID as form control key for params", () => {
      const streamName = "mock-stream";
      component.consumerPositionForm.patchValue({ stream: streamName });
      component.onStreamChange(streamName);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StreamActions.fetchConsumers.type,
          params: { stream: streamName },
        })
      );
    });

    it("should not throw if consumerPositionForm.controls[STREAM_LABELS.STREAM_ID] is undefined", () => {
      component.consumerPositionForm.removeControl(
        component.STREAM_LABELS.STREAM_ID
      );
      expect(() => component.onStreamChange("mock-stream")).not.toThrow();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: StreamActions.fetchConsumers.type,
          params: { stream: undefined },
        })
      );
    });
  });

  describe("onPositionChange", () => {
    it("should enable offset, partition when position is offset", () => {
      const positionGroup = component.consumerPositionForm.get(
        "position"
      ) as FormGroup;
      positionGroup.get("value")?.setValue("offset");
      component.onPositionChange();
      expect(positionGroup.get("offset")?.enabled).toBe(true);
      expect(positionGroup.get("partition")?.enabled).toBe(true);
    });

    it("should disable offset, partition when position is not offset", () => {
      const positionGroup = component.consumerPositionForm.get(
        "position"
      ) as FormGroup;
      positionGroup.get("value")?.setValue("beginning");
      component.onPositionChange();

      expect(positionGroup.get("offset")?.enabled).toBe(false);
      expect(positionGroup.get("partition")?.enabled).toBe(false);
    });

    it("should enable DATE when position is DATE", () => {
      const positionGroup = component.consumerPositionForm.get(
        "position"
      ) as FormGroup;
      positionGroup.get("value")?.setValue("after");
      component.onPositionChange();

      expect(positionGroup.get("after")?.enabled).toBe(true);
    });

    it("should disable DATE when position is not DATE", () => {
      const positionGroup = component.consumerPositionForm.get(
        "position"
      ) as FormGroup;
      positionGroup.get("value")?.setValue("beginning");
      component.onPositionChange();
      expect(positionGroup.get("after")?.enabled).toBe(false);
    });
  });

  describe("changePosition", () => {
    let consumerLabel: string;
    let streamId: string;

    beforeEach(() => {
      consumerLabel = CONSUMER_THREAD_POOL_LABELS.CONSUMER_LABEL;
      streamId = component.STREAM_LABELS.STREAM_ID;
      component.consumerPositionForm.patchValue({
        [consumerLabel]: "test-consumer",
        [streamId]: "test-stream",
        position: {
          value: CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE,
          offset: 0,
          partition: 0,
          date: new Date("2024-01-01T00:00:00Z"),
        },
      });
    });

    it("should dispatch onChangeConsumerPosition with beginning position", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE);
      component.changePosition();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String),
          consumerPosition:
            CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE,
          params: {
            consumer: "test-consumer",
            stream: "test-stream",
          },
        })
      );
    });

    it("should dispatch onChangeConsumerPosition with end position", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.END.VALUE);
      component.changePosition();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String),
          consumerPosition: CHANGE_CONSUMER_POSITION_LABELS.POSITION.END.VALUE,
          params: {
            consumer: "test-consumer",
            stream: "test-stream",
          },
        })
      );
    });

    it("should dispatch onChangeConsumerPosition with offset and partition when position is offset", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE);
      component.consumerPositionForm.get("position.offset")?.setValue(123);
      component.consumerPositionForm.get("position.partition")?.setValue(2);
      component.changePosition();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          consumerPosition:
            CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE,
          params: expect.objectContaining({
            consumer: "test-consumer",
            stream: "test-stream",
            offset: 123,
            partition: 2,
          }),
        })
      );
    });

    it("should dispatch onChangeConsumerPosition with date when position is after", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE);
      const testDate = new Date("2024-01-01T12:00:00Z");
      component.consumerPositionForm.get("position.after")?.setValue(testDate);
      component.changePosition();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          consumerPosition: CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE,
          params: expect.objectContaining({
            consumer: "test-consumer",
            stream: "test-stream",
            date: testDate.toISOString(),
          }),
        })
      );
    });
  });

  describe("isValidData()", () => {
    it("should return true for invalid data", () => {
      expect(component.isValidData([])).toBe(false);
    });

    it("should return false for invalid data", () => {
      expect(component.isValidData(null)).toBe(false);
    });

    it("should return false for invalid data", () => {
      expect(component.isValidData(undefined)).toBe(false);
    });

    it("should return false for invalid data", () => {
      expect(component.isValidData({})).toBe(false);
    });

    it("should return true for valid data", () => {
      const data = {
        before: {
          stream: "mock/recomputeThumbnails",
          consumer: "mock/recomputeThumbnails",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
        after: {
          stream: "mock/recomputeThumbnails",
          consumer: "mock/recomputeThumbnails",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
      };
      expect(component.isValidData(data)).toBe(true);
    });
  });

  describe("ngOnDestroy()", () => {
    it("should unsubscribe from all subscriptions", () => {
      component.ngOnDestroy();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ConsumerPositionActions.resetConsumerPositionData.type,
        })
      );
    });

    it("should complete the destroy$ subject", () => {
      vi.spyOn((component as any).destroy$, "next");
      vi.spyOn((component as any).destroy$, "complete");
      component.ngOnDestroy();
      expect((component as any).destroy$.next).toHaveBeenCalled();
      expect((component as any).destroy$.complete).toHaveBeenCalled();
    });
  });

  describe("showConfirmationModal", () => {
    beforeEach(() => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE);
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ continue: true }),
      } as any);
      component.focusMatSelect = { focus: vi.fn() } as any;
      vi.spyOn(component, "changePosition");
    });

    it("should open confirmation modal and call changePosition method to change position to beginning of the stream", () => {
      const positionName = (
        component.consumerPositionForm.get("position") as FormGroup
      ).get("value")?.value;
      component.showConfirmationModal();
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: expect.objectContaining({
            operationType: CHANGE_CONSUMER_POSITION_LABELS.OPERATION_TYPE,
            message:
              CHANGE_CONSUMER_POSITION_LABELS.BEGINNING_END_CONFIRM_MESSAGE.replace(
                "{positionName}",
                positionName.charAt(0).toUpperCase() + positionName.slice(1)
              ),
            title: CHANGE_CONSUMER_POSITION_LABELS.CONSUMER_POSITION_LABEL,
          }),
        })
      );
      expect(component.changePosition).toHaveBeenCalled();
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should open confirmation modal and call changePosition method to change position to end of the stream", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.END.VALUE);
      const positionName = (
        component.consumerPositionForm.get("position") as FormGroup
      ).get("value")?.value;

      component.showConfirmationModal();
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: expect.objectContaining({
            operationType: CHANGE_CONSUMER_POSITION_LABELS.OPERATION_TYPE,
            message:
              CHANGE_CONSUMER_POSITION_LABELS.BEGINNING_END_CONFIRM_MESSAGE.replace(
                "{positionName}",
                positionName.charAt(0).toUpperCase() + positionName.slice(1)
              ),
            title: CHANGE_CONSUMER_POSITION_LABELS.CONSUMER_POSITION_LABEL,
          }),
        })
      );
      expect(component.changePosition).toHaveBeenCalled();
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should open confirmation modal and call changePosition method to change position after a specific offset", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.OFFSET.VALUE);
      (component.consumerPositionForm.get("position") as FormGroup).get("value")
        ?.value;

      component.showConfirmationModal();
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: expect.objectContaining({
            operationType: CHANGE_CONSUMER_POSITION_LABELS.OPERATION_TYPE,
            message: CHANGE_CONSUMER_POSITION_LABELS.OFFSET_CONFIRM_MESSAGE,
            title: CHANGE_CONSUMER_POSITION_LABELS.CONSUMER_POSITION_LABEL,
          }),
        })
      );
      expect(component.changePosition).toHaveBeenCalled();
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should open confirmation modal and call changePosition method to change position to after a date", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE);
      component.consumerPositionForm
        .get("position")
        ?.get("after")
        ?.setValue(new Date("2024-01-01T00:00:00Z"));
      component.showConfirmationModal();
      expect(matDialogSpy.open).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: expect.objectContaining({
            operationType: CHANGE_CONSUMER_POSITION_LABELS.OPERATION_TYPE,
            message: CHANGE_CONSUMER_POSITION_LABELS.DATE_CONFIRM_MESSAGE,
            title: CHANGE_CONSUMER_POSITION_LABELS.CONSUMER_POSITION_LABEL,
          }),
        })
      );
      expect(component.changePosition).toHaveBeenCalled();
      expect(component.focusMatSelect.focus).toHaveBeenCalled();
    });

    it("should open confirmation modal and dont call changePosition method", () => {
      component.consumerPositionForm
        .get("position.value")
        ?.setValue(CHANGE_CONSUMER_POSITION_LABELS.POSITION.DATE.VALUE);
      component.consumerPositionForm
        .get("position")
        ?.get("after")
        ?.setValue("");

      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ continue: false }),
      } as any);
      component.showConfirmationModal();
      expect(matDialogSpy.open).not.toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: expect.objectContaining({
            operationType: CHANGE_CONSUMER_POSITION_LABELS.OPERATION_TYPE,
            message: CHANGE_CONSUMER_POSITION_LABELS.DATE_CONFIRM_MESSAGE,
            title: CHANGE_CONSUMER_POSITION_LABELS.CONSUMER_POSITION_LABEL,
          }),
        })
      );
      expect(component.changePosition).not.toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    beforeEach(() => {
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );

      component.consumerPositionForm.patchValue({
        consumer: "test-consumer",
        stream: "test-stream",
        position: {
          value: CHANGE_CONSUMER_POSITION_LABELS.POSITION.BEGINNING.VALUE,
          offset: 0,
          partition: 0,
          date: new Date("2024-01-01T00:00:00Z"),
        },
      });
    });

    it("should dispatch fetchStreams action when streams data is not loaded", () => {
      storeSpy.select.mockReturnValue(of(false));
      storeSpy.pipe.mockReturnValue(of(false));
      component.ngOnInit();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        StreamActions.fetchStreams()
      );
    });

    it("should not dispatch fetchStreams action when streams data is already loaded", () => {
      storeSpy.select.mockReturnValue(of(true));
      storeSpy.pipe.mockReturnValue(of(true));
      component.ngOnInit();
      expect(storeSpy.dispatch).not.toHaveBeenCalledWith(
        StreamActions.fetchStreams()
      );
    });

    it("should handle fetchStreamsSuccess with data", () => {
      const mockStreams = [{ name: "stream1" }, { name: "stream2" }];
      component.fetchStreamsSuccess$ = of(mockStreams);
      component.ngOnInit();
      expect(component.streams).toEqual(mockStreams);
      expect(component.consumerPositionForm.get("stream")?.value).toBe(
        "stream1"
      );
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        StreamActions.fetchConsumers({
          params: { stream: "stream1" },
        })
      );
    });

    it("should handle fetchStreamsError when error object is available", () => {
      const mockError = new HttpErrorResponse({
        error: { status: 500, message: "Server Error" },
      });
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      component.fetchStreamsError$ = of(mockError);
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );
      component.ngOnInit();
      expect(component.isChangeConsumerPositionDisabled).toBe(true);
      expect(sharedMethodServiceSpy.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle when error object is not available in fetchStreamsError$", () => {
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: "Server Error",
      });
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      component.fetchStreamsError$ = of(mockError);
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );
      component.ngOnInit();
      expect(component.isChangeConsumerPositionDisabled).toBe(true);
      expect(sharedMethodServiceSpy.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should handle fetchConsumersSuccess with data", () => {
      const mockConsumers = [
        { stream: "stream1", consumer: "consumer1" },
        { stream: "stream1", consumer: "consumer2" },
      ];
      component.fetchConsumersSuccess$ = of(mockConsumers);
      component.ngOnInit();
      expect(component.consumers).toEqual(mockConsumers);
      expect(component.selectedConsumer).toBe("consumer1");
      expect(component.consumerPositionForm.get("consumer")?.value).toBe(
        "consumer1"
      );
    });

    it("should handle fetchConsumersError when error object is available", () => {
      const mockError = new HttpErrorResponse({
        error: { status: 404, message: "Not Found" },
      });
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      component.fetchConsumersError$ = of(mockError);
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );

      component.ngOnInit();
      expect(component.isChangeConsumerPositionDisabled).toBe(true);
      expect(sharedMethodServiceSpy.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle when error object is not available in fetchConsumersError", () => {
      const mockError = new HttpErrorResponse({
        status: 404,
        statusText: "Not Found",
      });
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      component.fetchConsumersError$ = of(mockError);
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );

      component.ngOnInit();
      expect(component.isChangeConsumerPositionDisabled).toBe(true);
      expect(sharedMethodServiceSpy.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should handle changeConsumerPositionError when error object is available", () => {
      const mockError = new HttpErrorResponse({
        error: { status: 400, message: "Bad Request" },
      });
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      component.changeConsumerPositionError$ = of(mockError);
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );

      component.ngOnInit();
      expect(component.consumerPositionData).toEqual([]);
      expect(sharedMethodServiceSpy.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.error.status,
          message: mockError.error.message,
        },
      });
    });

    it("should handle when error object is not available in changeConsumerPositionError", () => {
      const mockError = new HttpErrorResponse({
        status: 400,
        statusText: "Bad Request",
      });
      const mockModalResponse: ErrorModalClosedInfo = {
        isClosed: true,
        event: {},
      };
      component.changeConsumerPositionError$ = of(mockError);
      sharedMethodServiceSpy.showActionErrorModal.mockReturnValue(
        of(mockModalResponse)
      );

      component.ngOnInit();
      expect(component.consumerPositionData).toEqual([]);
      expect(sharedMethodServiceSpy.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: mockError.status,
          message: mockError.message,
        },
      });
    });

    it("should handle changeConsumerPositionSuccess", () => {
      const mockData = [{ id: 1 }] as any;
      component.changeConsumerPositionSuccess$ = of(mockData);
      component.ngOnInit();
      expect(component.consumerPositionData).toEqual(mockData);
      expect(sharedMethodServiceSpy.showSuccessSnackBar).toHaveBeenCalledWith(
        CHANGE_CONSUMER_POSITION_LABELS.SUCCESS_SNACKBAR_MESSAGE
      );
    });

    it("should cleanup subscriptions on destroy", () => {
      const nextSpy = vi.spyOn(component["destroy$"], "next");
      const completeSpy = vi.spyOn(component["destroy$"], "complete");
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        ConsumerPositionActions.resetConsumerPositionData()
      );
    });
  });

  describe("clearRecords", () => {
    it("should clear consumerPositionData and dispatch resetConsumerPositionData action", () => {
      component.consumerPositionData = [{ id: 1 }] as any;
      component.clearRecords();
      expect(component.consumerPositionData).toEqual([]);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        ConsumerPositionActions.resetConsumerPositionData()
      );
    });
  });
});
