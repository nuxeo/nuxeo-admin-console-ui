import { NXQLTabComponent } from "./nxql-tab.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, of } from "rxjs";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import * as FeatureActions from "../../store//actions";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { NXQLActionState } from "../../store/reducers";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { ErrorDetails } from "../../generic-multi-feature-layout.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { featureMap, FEATURES } from "../../generic-multi-feature-layout.mapping";
import { PICTURE_RENDITIONS_LABELS } from "../../../../pictures/pictures-renditions.constants";
import { THUMBNAIL_GENERATION_LABELS } from "../../../../thumbnail-generation/thumbnail-generation.constants";
import { VIDEO_RENDITIONS_LABELS } from "../../../../video-renditions-generation/video-renditions-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../../../fulltext-reindex/fulltext-reindex.constants";


describe("NXQLTabComponent", () => {
  let component: NXQLTabComponent;
  let nuxeoJSClientService;
  let genericMultiFeatureUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  let fixture: ComponentFixture<NXQLTabComponent>;
  let store: MockStore<NXQLActionState>;
  let dialogService: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GenericModalComponent>>;

  class genericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(true);
    getActiveFeature() {
      return "ELASTIC_SEARCH_REINDEX";
    }

    secondsToHumanReadable() {
      return "";
    }
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = jasmine.createSpyObj(
      "NuxeoJSClientService",
      ["getNuxeoInstance"]
    );
    const initialState: NXQLActionState = {
      nxqlActionInfo: {
        commandId: "mockCommandId",
      },
      error: null,
    };
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed", "afterOpened"]);
    mockDialogRef.afterClosed.and.returnValue(of({}));
    mockDialogRef.afterOpened.and.returnValue(of());
    dialogService = jasmine.createSpyObj("MatDialog", ["open"]);
    dialogService.open.and.returnValue(mockDialogRef);
    await TestBed.configureTestingModule({
      declarations: [NXQLTabComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        { provide: NuxeoJSClientService, useValue: nuxeoJSClientServiceSpy },
        {
          provide: GenericMultiFeatureUtilitiesService,
          useClass: genericMultiFeatureUtilitiesServiceStub,
        },
        { provide: MatDialog, useValue: dialogService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    genericMultiFeatureUtilitiesService = TestBed.inject(
      GenericMultiFeatureUtilitiesService
    ) as jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
    fixture = TestBed.createComponent(NXQLTabComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    nuxeoJSClientService = TestBed.inject(NuxeoJSClientService);
    component.inputForm = TestBed.inject(FormBuilder).group({
      inputIdentifier: [""],
    });
    nuxeoJSClientService.nuxeoInstance = {
      repository: jasmine.createSpy().and.returnValue({
        fetch: jasmine.createSpy().and.callFake((input: string) => {
          if (input === "valid-id") {
            return Promise.resolve({ uid: "1234" });
          } else if (input === "error-id") {
            return Promise.reject(new Error("Error occurred"));
          } else {
            return Promise.resolve(null);
          }
        }),
      }),
    };

    spyOn(component, "fetchNoOfDocuments");
    spyOn(genericMultiFeatureUtilitiesService, "getActiveFeature");
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should open error dialog and handle close subscription", () => {
    const mockError: ErrorDetails = {
      type: ERROR_TYPES.INVALID_QUERY,
      details: { message: "Test error" },
    };

    spyOn(component, "onActionErrorModalClose");

    component.showActionErrorModal(mockError);

    expect(dialogService.open).toHaveBeenCalledWith(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error: mockError,
      },
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(component.onActionErrorModalClose).toHaveBeenCalled();
  });

  it("should focus on the input field on modal close", () => {
    const mockElement = jasmine.createSpyObj("HTMLElement", ["focus"]);
    spyOn(document, "getElementById").and.returnValue(mockElement);
    component.onActionErrorModalClose();
    expect(document.getElementById).toHaveBeenCalledWith("inputIdentifier");
    expect(mockElement.focus).toHaveBeenCalled();
  });

  it("should open the reindex launched modal with correct data and subscribe to afterClosed", () => {
    const commandId = "test-command-id";
    const showActionLaunchedModalSpy = spyOn(
      component,
      "showActionLaunchedModal"
    ).and.callThrough();
    const onActionLaunchedModalCloseSpy = spyOn(
      component,
      "onActionLaunchedModalClose"
    ).and.callThrough();
    component.showActionLaunchedModal(commandId);
    expect(showActionLaunchedModalSpy).toHaveBeenCalledWith(commandId);
    expect(dialogService.open).toHaveBeenCalledWith(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        type: GENERIC_LABELS.MODAL_TYPE.launched,
        title: `${GENERIC_LABELS.ACTION_LAUNCHED_MODAL_TITLE}`,
        launchedMessage: `${GENERIC_LABELS.ACTION_LAUNCHED} ${commandId}. ${GENERIC_LABELS.COPY_MONITORING_ID}`,
        commandId,
      },
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onActionLaunchedModalCloseSpy).toHaveBeenCalled();
  });

  it("should return the correct error message when nxqlQuery has a required error", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["", Validators.required],
    });

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe(GENERIC_LABELS.REQUIRED_NXQL_QUERY_ERROR);
  });

  it("should return null when nxqlQuery does not have a required error", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["some value"],
    });
    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  it("should return true for valid error object with response and json function", () => {
    const err = {
      response: {
        json: () => Promise.resolve({}),
      },
    };
    const result = component.checkIfErrorHasResponse(err);
    expect(result).toBeTrue();
  });

  it("should return false for null error", () => {
    const err = null;
    const result = component.checkIfErrorHasResponse(err);
    expect(result).toBeFalse();
  });

  it("should return false for non-object error", () => {
    const err = "string error";
    const result = component.checkIfErrorHasResponse(err);
    expect(result).toBeFalse();
  });

  it("should return false for error without response", () => {
    const err = { someProperty: "someValue" };
    const result = component.checkIfErrorHasResponse(err);
    expect(result).toBeFalse();
  });

  it("should return false for error with response but no json function", () => {
    const err = { response: {} };
    const result = component.checkIfErrorHasResponse(err);
    expect(result).toBeFalse();
  });

  it("should return false for error with response and non-function json property", () => {
    const err = { response: { json: "not a function" } };
    const result = component.checkIfErrorHasResponse(err);
    expect(result).toBeFalse();
  });

  it("should dispatch resetDocumentActionState and unsubscribe from subscriptions on ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    spyOn(component.nxqlActionLaunchedSubscription, "unsubscribe");
    spyOn(component.nxqlActionErrorSubscription, "unsubscribe");
    spyOn(component.confirmDialogClosedSubscription, "unsubscribe");
    spyOn(component.launchedDialogClosedSubscription, "unsubscribe");
    spyOn(component.errorDialogClosedSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      FeatureActions.resetNxqlActionState()
    );
    expect(
      component.nxqlActionLaunchedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.nxqlActionErrorSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.confirmDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.launchedDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.errorDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
  });

  it("should open the confirmation modal with correct data and subscribe to afterClosed", () => {
    const documentId = "1234";
    spyOn(component, "getHumanReadableTime").and.returnValue("1 second");
    const showConfirmationModalSpy = spyOn(
      component,
      "showConfirmationModal"
    ).and.callThrough();
    const onConfirmationModalCloseSpy = spyOn(
      component,
      "onConfirmationModalClose"
    ).and.callThrough();
    component.showConfirmationModal(2, documentId);
    expect(showConfirmationModalSpy).toHaveBeenCalledWith(2, documentId);
    expect(dialogService.open).toHaveBeenCalledWith(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        type: GENERIC_LABELS.MODAL_TYPE.confirm,
        title: `${GENERIC_LABELS.ACTION_CONFIRMATION_MODAL_TITLE}`,
        message: `${GENERIC_LABELS.ACTION_WARNING}`,
        documentCount: 2,
        timeTakenForAction: "1 second",
      },
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onConfirmationModalCloseSpy).toHaveBeenCalled();
  });

  it("should get human readable time", () => {
    const seconds = 3661;
    const humanReadableTime = "1 hour 1 minute 1 second";
    spyOn(
      genericMultiFeatureUtilitiesService,
      "secondsToHumanReadable"
    ).and.returnValue(humanReadableTime);

    const result = component.getHumanReadableTime(seconds);

    expect(
      genericMultiFeatureUtilitiesService.secondsToHumanReadable
    ).toHaveBeenCalledWith(seconds);
    expect(result).toBe(humanReadableTime);
  });

  it("should call buildDocumentCountFetchRequestQuery if form is valid", () => {
    component.inputForm.setValue({
      inputIdentifier:
        "SELECT * FROM Document WHERE ecm:path STARTSWITH '/default-domain'",
    });
    component.isSubmitBtnDisabled = false;
    component.onFormSubmit();
    expect(genericMultiFeatureUtilitiesService.spinnerStatus.value).toBe(false);
  });

  it("should not call buildDocumentCountFetchRequestQuery if form is invalid", () => {
    component.inputForm.setValue({ inputIdentifier: "" });
    component.onFormSubmit();
    expect(genericMultiFeatureUtilitiesService.spinnerStatus.value).toBe(true);
    expect(component.fetchNoOfDocuments).not.toHaveBeenCalled();
  });
  describe('FEATURES.PICTURE_RENDITIONS', () => {
    it('should return correct labels and data for NXQL tabType', () => {
      const result = featureMap()[FEATURES.PICTURE_RENDITIONS](GENERIC_LABELS.NXQL);
      expect(result.labels.pageTitle).toBe(PICTURE_RENDITIONS_LABELS.NXQL_QUERY_RENDITIONS_TITLE);
      expect(result.labels.submitBtnLabel).toBe(PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL);
    });
  });

  describe('FEATURES.THUMBNAIL_GENERATION', () => {
    it('should return correct labels and data for NXQL tabType', () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.NXQL);
      expect(result.labels.pageTitle).toBe(THUMBNAIL_GENERATION_LABELS.NXQL_THUMBNAIL_GENERATION_TITLE);
      expect(result.labels.submitBtnLabel).toBe(THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL);
    });
  });

  it('should add form controls for video renditions when isFeatureVideoRenditions() returns true', () => {
    spyOn(component, 'isFeatureVideoRenditions').and.returnValue(true);

    component.ngOnInit();

    expect(component.inputForm.contains(VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY)).toBe(true);
    expect(component.inputForm.contains(VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY)).toBe(true);
  });

  it('should not add form controls for video renditions when isFeatureVideoRenditions() returns false', () => {
    spyOn(component, 'isFeatureVideoRenditions').and.returnValue(false);

    component.ngOnInit();

    expect(component.inputForm.contains(VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY)).toBe(false);
    expect(component.inputForm.contains(VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY)).toBe(false);
  });

  describe('FEATURES.FULLTEXT_REINDEX', () => {
    it('should return correct labels and data for NXQL tabType', () => {
      const result = featureMap()[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.NXQL);
      expect(result.labels.pageTitle).toBe(FULLTEXT_REINDEX_LABELS.NXQL_QUERY_REINDEX_TITLE);
      expect(result.labels.submitBtnLabel).toBe(FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL);
    });
  });
});
