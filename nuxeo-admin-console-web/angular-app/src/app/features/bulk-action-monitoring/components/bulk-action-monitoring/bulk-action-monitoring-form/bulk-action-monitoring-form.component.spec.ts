import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { BULK_ACTION_LABELS } from "./../../../bulk-action-monitoring.constants";
import { CommonService } from "./../../../../../shared/services/common.service";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringFormComponent } from "./bulk-action-monitoring-form.component";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { of } from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import * as fromReducer from "../../../store/reducers";
import * as BulkActionMonitoringActions from "../../../store/actions";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { GenericMultiFeatureUtilitiesService } from "../../../../sub-features/generic-multi-feature-layout/services/generic-multi-feature-utilities.service";
import { ErrorModalComponent } from "../../../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { MODAL_DIMENSIONS } from "../../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

describe("BulkActionMonitoringFormComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: BulkActionMonitoringFormComponent;
  let fixture: ComponentFixture<BulkActionMonitoringFormComponent>;
  let mockStore: MockedObject<Store>;
  let mockCommonService: MockedObject<CommonService>;
  let genericMultiFeatureUtilitiesService: MockedObject<GenericMultiFeatureUtilitiesService>;
  let mockDialog: MockedObject<MatDialog>;
  let mockDialogRef: MockedObject<MatDialogRef<ErrorModalComponent>>;
  let store: MockStore<fromReducer.BulkActionMonitoringState>;
  class genericMultiFeatureUtilitiesServiceStub {
    removeLeadingCharacters() {
      return "";
    }
  }
  const initialState = {
    bulkActionMonitoringInfo: {
      "entity-type": null,
      commandId: null,
      state: null,
      processed: -1,
      skipCount: -1,
      error: false,
      errorCount: -1,
      total: -1,
      action: null,
      username: null,
      submitted: null,
      scrollStart: null,
      scrollEnd: null,
      processingStart: null,
      processingEnd: null,
      completed: null,
      processingMillis: -1,
    },
    error: null,
  };

  beforeEach(async () => {
    mockStore = {
      pipe: vi.fn().mockName("Store.pipe"),
      dispatch: vi.fn().mockName("Store.dispatch"),
    } as unknown as MockedObject<Store>;
    mockCommonService = {
      removeLeadingCharacters: vi
        .fn()
        .mockName("CommonService.removeLeadingCharacters"),
      redirectToBulkActionMonitoring: vi
        .fn()
        .mockName("CommonService.redirectToBulkActionMonitoring"),
    } as unknown as MockedObject<CommonService>;
    mockDialog = {
      open: vi.fn().mockName("MatDialog.open"),
    } as unknown as MockedObject<MatDialog>;
    mockDialogRef = {
      afterClosed: vi.fn().mockName("MatDialogRef.afterClosed"),
    } as unknown as MockedObject<MatDialogRef<ErrorModalComponent>>;

    await TestBed.configureTestingModule({
      declarations: [BulkActionMonitoringFormComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        StoreModule.forRoot(provideMockStore),
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        FormBuilder,
        { provide: CommonService, useValue: mockCommonService },
        {
          provide: GenericMultiFeatureUtilitiesService,
          useClass: genericMultiFeatureUtilitiesServiceStub,
        },
        { provide: MatDialog, useValue: mockDialog },
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === "bulkActionId" ? "123" : null),
            }),
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActionMonitoringFormComponent);
    component = fixture.componentInstance;
    mockStore.pipe.mockReturnValue(of(null));
    mockDialog.open.mockReturnValue(mockDialogRef);
    mockDialogRef.afterClosed.mockReturnValue(of({}));
    store = TestBed.inject(MockStore);
    genericMultiFeatureUtilitiesService = TestBed.inject(
      GenericMultiFeatureUtilitiesService
    ) as MockedObject<GenericMultiFeatureUtilitiesService>;
    vi.spyOn(genericMultiFeatureUtilitiesService, "removeLeadingCharacters");
    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore.dispatch.mockClear();
    genericMultiFeatureUtilitiesService.removeLeadingCharacters.mockClear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("showBulkActionErrorModal", () => {
    it("should open the error modal", () => {
      const error = {
        type: "Server Error",
        details: { status: 500, message: "Error" },
      };
      component.showBulkActionErrorModal(error);
      expect(mockDialog.open).toHaveBeenCalledWith(ErrorModalComponent, {
        disableClose: true,
        hasBackdrop: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: { error },
      });
    });
  });

  describe("getErrorMessage", () => {
    it("should return required error message", () => {
      component.bulkActionMonitoringForm.controls["bulkActionId"].setErrors({
        required: true,
      });
      expect(component.getErrorMessage()).toBe(
        BULK_ACTION_LABELS.REQUIRED_BULK_ACTION_ID_ERROR
      );
    });

    it("should return null if no error", () => {
      component.bulkActionMonitoringForm.controls["bulkActionId"].setErrors({});
      expect(component.getErrorMessage()).toBeNull();
    });
  });

  describe("onBulkActionFormSubmit", () => {
    it("should handle valid form submission", () => {
      component.isBulkActionBtnDisabled = false;
      genericMultiFeatureUtilitiesService.removeLeadingCharacters.mockReturnValue(
        "123"
      );
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue(
        "123"
      );
      vi.spyOn(store, "dispatch");
      component.onBulkActionFormSubmit();
      expect(
        genericMultiFeatureUtilitiesService.removeLeadingCharacters
      ).toHaveBeenCalledWith("123");
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkActionMonitoringActions.performBulkActionMonitor({ id: "123" })
      );
    });
  });

  describe("ngOnDestroy", () => {
    it("should complete destroy$ subject and dispatch resetBulkActionMonitorState", () => {
      vi.spyOn(component["destroy$"], "next");
      vi.spyOn(component["destroy$"], "complete");
      vi.spyOn(store, "dispatch");
      component.ngOnDestroy();
      expect(component["destroy$"].next).toHaveBeenCalled();
      expect(component["destroy$"].complete).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkActionMonitoringActions.resetBulkActionMonitorState()
      );
    });
  });
  it("should allow subscriptions using takeUntil(destroy$) to be unsubscribed", async () => {
    let unsubscribed = false;
    component["destroy$"].subscribe({
      complete: () => {
        unsubscribed = true;
      },
    });
    component.ngOnDestroy();
    expect(unsubscribed).toBe(true);
  });

  describe("ngOnInit - bulkActionMonitoringLaunched$ subscription", () => {
    it("should handle successful bulk action response with commandId", () => {
      const mockBulkActionData = {
        "entity-type": "bulkStatus",
        commandId: "test-command-id-123",
        state: "COMPLETED",
        processed: 10,
        skipCount: 0,
        error: false,
        errorCount: 0,
        total: 10,
        action: "testAction",
        username: "testUser",
        submitted: "2026-01-13T10:00:00",
        scrollStart: "2026-01-13T10:00:00",
        scrollEnd: "2026-01-13T10:05:00",
        processingStart: "2026-01-13T10:00:00",
        processingEnd: "2026-01-13T10:10:00",
        completed: "2026-01-13T10:10:00",
        processingMillis: 600000,
      };

      component.bulkActionMonitoringLaunched$ = of(mockBulkActionData);
      component.bulkActionError$ = of(null);

      vi.spyOn(component.setBulkActionResponse, "emit");
      vi.spyOn(component.bulkActionMonitoringForm, "reset");

      component.ngOnInit();

      expect(component.bulkActionResponse).toEqual(mockBulkActionData);
      expect(component.setBulkActionResponse.emit).toHaveBeenCalledWith(
        mockBulkActionData
      );
      expect(component.isBulkActionBtnDisabled).toBe(false);
      expect(component.bulkActionMonitoringForm.reset).toHaveBeenCalled();
    });

    it("should handle bulk action response without commandId", () => {
      const mockBulkActionData = {
        "entity-type": null,
        commandId: null,
        state: null,
        processed: -1,
        skipCount: -1,
        error: false,
        errorCount: -1,
        total: -1,
        action: null,
        username: null,
        submitted: null,
        scrollStart: null,
        scrollEnd: null,
        processingStart: null,
        processingEnd: null,
        completed: null,
        processingMillis: -1,
      };

      component.bulkActionMonitoringLaunched$ = of(mockBulkActionData);
      component.bulkActionError$ = of(null);

      component.ngOnInit();

      expect(component.bulkActionResponse).toEqual({} as any);
    });
  });

  describe("ngOnInit - bulkActionError$ subscription", () => {
    it("should handle error response and show error modal", () => {
      const mockError = {
        error: {
          status: 500,
          message: "Internal Server Error",
        },
      };

      component.bulkActionMonitoringLaunched$ = of(null as any);
      component.bulkActionError$ = of(mockError as any);

      vi.spyOn(component.setBulkActionResponse, "emit");
      vi.spyOn(component, "showBulkActionErrorModal");

      component.ngOnInit();

      expect(component.setBulkActionResponse.emit).toHaveBeenCalledWith(null);
      expect(component.showBulkActionErrorModal).toHaveBeenCalledWith({
        type: "serverError",
        details: {
          status: 500,
          message: "Internal Server Error",
        },
      });
    });

    it("should not show error modal when error is null", () => {
      component.bulkActionMonitoringLaunched$ = of(null as any);
      component.bulkActionError$ = of(null);

      vi.spyOn(component, "showBulkActionErrorModal");

      component.ngOnInit();

      expect(component.showBulkActionErrorModal).not.toHaveBeenCalled();
    });

    it("should not show error modal when error.error is undefined", () => {
      const mockError = {
        status: 500,
      };

      component.bulkActionMonitoringLaunched$ = of(null as any);
      component.bulkActionError$ = of(mockError as any);

      vi.spyOn(component, "showBulkActionErrorModal");

      component.ngOnInit();

      expect(component.showBulkActionErrorModal).not.toHaveBeenCalled();
    });
  });

  describe("onBulkActionModalClose", () => {
    it("should reset button state", () => {
      component.isBulkActionBtnDisabled = true;
      component.onBulkActionModalClose();

      expect(component.isBulkActionBtnDisabled).toBe(false);
    });
  });

  describe("showBulkActionErrorModal - afterClosed callback", () => {
    it("should call onBulkActionModalClose when dialog is closed", () => {
      vi.spyOn(component, "onBulkActionModalClose");

      const error = {
        type: "Server Error",
        details: { status: 500, message: "Error" },
      };

      component.showBulkActionErrorModal(error);

      expect(mockDialogRef.afterClosed).toHaveBeenCalled();
      expect(component.onBulkActionModalClose).toHaveBeenCalled();
    });
  });

  describe("onBulkActionFormSubmit - edge cases", () => {
    it("should not submit when form is invalid", () => {
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue("");
      component.bulkActionMonitoringForm.markAsDirty();
      component.isBulkActionBtnDisabled = false;
      vi.spyOn(store, "dispatch");

      component.onBulkActionFormSubmit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should not submit when button is already disabled", () => {
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue(
        "123"
      );
      component.isBulkActionBtnDisabled = true;
      vi.spyOn(store, "dispatch");

      component.onBulkActionFormSubmit();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should trim whitespace from bulkActionId", () => {
      component.isBulkActionBtnDisabled = false;
      genericMultiFeatureUtilitiesService.removeLeadingCharacters.mockReturnValue(
        "456"
      );
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue(
        "  456  "
      );
      vi.spyOn(store, "dispatch");

      component.onBulkActionFormSubmit();

      expect(
        genericMultiFeatureUtilitiesService.removeLeadingCharacters
      ).toHaveBeenCalledWith("456");
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkActionMonitoringActions.performBulkActionMonitor({ id: "456" })
      );
    });
  });
});
