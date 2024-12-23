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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import * as fromReducer from "../../../store/reducers";
import * as BulkActionMonitoringActions from "../../../store/actions";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { GenericMultiFeatureUtilitiesService } from "../../../../sub-features/generic-multi-feature-layout/services/generic-multi-feature-utilities.service";
import { ErrorModalComponent } from "../../../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { MODAL_DIMENSIONS } from "../../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

describe("BulkActionMonitoringFormComponent", () => {
  let component: BulkActionMonitoringFormComponent;
  let fixture: ComponentFixture<BulkActionMonitoringFormComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let genericMultiFeatureUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ErrorModalComponent>>;
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
    mockStore = jasmine.createSpyObj("Store", ["pipe", "dispatch"]);
    mockCommonService = jasmine.createSpyObj("CommonService", [
      "removeLeadingCharacters",
      "redirectToBulkActionMonitoring",
    ]);
    mockDialog = jasmine.createSpyObj("MatDialog", ["open"]);
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);

    await TestBed.configureTestingModule({
      declarations: [BulkActionMonitoringFormComponent],
      imports: [
        HttpClientTestingModule,
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActionMonitoringFormComponent);
    component = fixture.componentInstance;
    mockStore.pipe.and.returnValue(of(null));
    mockDialog.open.and.returnValue(mockDialogRef);
    mockDialogRef.afterClosed.and.returnValue(of({}));
    store = TestBed.inject(MockStore);
    genericMultiFeatureUtilitiesService = TestBed.inject(
      GenericMultiFeatureUtilitiesService
    ) as jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
    spyOn(genericMultiFeatureUtilitiesService, 'removeLeadingCharacters');
    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore.dispatch.calls.reset();
    genericMultiFeatureUtilitiesService.removeLeadingCharacters.calls.reset();
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
      genericMultiFeatureUtilitiesService.removeLeadingCharacters.and.returnValue("123");
      component.bulkActionMonitoringForm.controls["bulkActionId"].setValue(
        "123"
      );
      spyOn(store, "dispatch");
      component.onBulkActionFormSubmit();
      expect(genericMultiFeatureUtilitiesService.removeLeadingCharacters).toHaveBeenCalledWith(
        "123"
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkActionMonitoringActions.performBulkActionMonitor({ id: "123" })
      );
    });
  });

  describe("ngOnDestroy", () => {
    it("should unsubscribe from all subscriptions", () => {
      spyOn(component.bulkActionLaunchedSubscription, "unsubscribe");
      spyOn(component.bulkActionErrorSubscription, "unsubscribe");
      spyOn(component.errorDialogClosedSubscription, "unsubscribe");
      spyOn(store, "dispatch");
      component.ngOnDestroy();
      expect(
        component.bulkActionLaunchedSubscription.unsubscribe
      ).toHaveBeenCalled();
      expect(
        component.bulkActionErrorSubscription.unsubscribe
      ).toHaveBeenCalled();
      expect(
        component.errorDialogClosedSubscription.unsubscribe
      ).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        BulkActionMonitoringActions.resetBulkActionMonitorState()
      );
    });
  });
});
