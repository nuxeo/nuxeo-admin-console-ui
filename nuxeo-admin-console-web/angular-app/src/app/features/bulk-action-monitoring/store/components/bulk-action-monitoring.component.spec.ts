import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BulkActionMonitoringComponent } from "./bulk-action-monitoring.component";
import { CommonService } from "../../../../shared/services/common.service";
import { ErrorModalComponent } from "../../../../shared/components/error-modal/error-modal.component";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import * as fromReducer from "../reducers";
import * as BulkActionMonitoringActions from "../actions";
import { BULK_ACTION_LABELS } from "../../bulk-action-monitoring.constants";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "../../../../shared/constants/common.constants";

describe("BulkActionMonitoringComponent", () => {
  let component: BulkActionMonitoringComponent;
  let fixture: ComponentFixture<BulkActionMonitoringComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ErrorModalComponent>>;
  let store: MockStore<fromReducer.BulkActionMonitoringState>;
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
    mockStore = jasmine.createSpyObj("Store", ["pipe", "dispatch"]);
    mockCommonService = jasmine.createSpyObj("CommonService", [
      "removeLeadingCharacters",
      "decodeAndReplaceSingleQuotes",
    ]);
    mockDialog = jasmine.createSpyObj("MatDialog", ["open"]);
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);

    await TestBed.configureTestingModule({
      declarations: [BulkActionMonitoringComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
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
        { provide: MatDialog, useValue: mockDialog },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActionMonitoringComponent);
    component = fixture.componentInstance;
    mockStore.pipe.and.returnValue(of(null));
    mockDialog.open.and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of({}));
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore.dispatch.calls.reset();
    mockCommonService.removeLeadingCharacters.calls.reset();
    mockCommonService.decodeAndReplaceSingleQuotes.calls.reset();
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
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: { error },
      });
    });
  });

  describe("getErrorMessage", () => {
    it("should return required error message", () => {
      component.bulkActionMonitoringForm.controls["bulkActionId"].setErrors({required: true,});
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
      const mockId = "mockId";
      mockCommonService.removeLeadingCharacters.and.returnValue(mockId);
      mockCommonService.decodeAndReplaceSingleQuotes.and.returnValue(mockId);
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue("mockId");
      spyOn(store, "dispatch");
      component.onBulkActionFormSubmit();
      expect(mockCommonService.removeLeadingCharacters).toHaveBeenCalledWith("mockId");
      expect(mockCommonService.decodeAndReplaceSingleQuotes).toHaveBeenCalledWith(mockId);
      expect(store.dispatch).toHaveBeenCalledWith(BulkActionMonitoringActions.performBulkActionMonitor({ id: mockId }));
    });

    it("should handle invalid action ID", () => {
      const invalidId = "%invalid";
      mockCommonService.removeLeadingCharacters.and.returnValue(invalidId);
      mockCommonService.decodeAndReplaceSingleQuotes.and.throwError(new URIError("URI malformed"));
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue(invalidId);
      spyOn(component, "showBulkActionErrorModal");
      component.onBulkActionFormSubmit();
      expect(component.showBulkActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.INVALID_ACTION_ID,
        details: {
          message: ERROR_MESSAGES.INVALID_ACTION_ID_MESSAGE,
        },
      });
    });
  });

  describe("ngOnDestroy", () => {
    it("should unsubscribe from all subscriptions", () => {
      spyOn(component.bulkActionLaunchedSubscription, "unsubscribe");
      spyOn(component.bulkActionErrorSubscription, "unsubscribe");
      spyOn(component.errorDialogClosedSubscription, "unsubscribe");
      spyOn(store, "dispatch");
      component.ngOnDestroy();
      expect(component.bulkActionLaunchedSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.bulkActionErrorSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.errorDialogClosedSubscription.unsubscribe).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(BulkActionMonitoringActions.resetBulkActionMonitorState());
    });
  });
});
