import { DocumentTabComponent } from "./document-tab.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  HyFormContainerModule,
  HyMaterialModule,
  HyMaterialTabsModule,
} from "@hyland/ui";
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
import { DocumentActionState } from "../../store/reducers";
import * as FeatureActions from "../../store//actions";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { ErrorDetails } from "../../generic-multi-feature-layout.interface";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { featureMap, FEATURES } from "../../generic-multi-feature-layout.mapping";
import { PICTURE_RENDITIONS_LABELS } from "../../../../pictures/pictures-renditions.constants";

describe("DocumentTabComponent", () => {
  let component: DocumentTabComponent;
  let genericMultiFeatureUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  let fixture: ComponentFixture<DocumentTabComponent>;
  let store: MockStore<DocumentActionState>;
  let dialogService: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GenericModalComponent>>;
  let nuxeoJSClientService: jasmine.SpyObj<NuxeoJSClientService>;

  class genericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    removeLeadingCharacters() {
      return "";
    }

    decodeAndReplaceSingleQuotes() {
      return "";
    }

    getActiveFeature() {
      return "ELASTIC_SEARCH_REINDEX";
    }
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = jasmine.createSpyObj(
      "NuxeoJSClientService",
      ["getNuxeoInstance"]
    );
    const initialState: DocumentActionState = {
      documentActionInfo: {
        commandId: "mockCommandId",
      },
      error: null,
    };
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);
    mockDialogRef.afterClosed.and.returnValue(of({}));

    dialogService = jasmine.createSpyObj("MatDialog", ["open"]);
    dialogService.open.and.returnValue(mockDialogRef);
    await TestBed.configureTestingModule({
      declarations: [DocumentTabComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatTabsModule,
        HyMaterialModule,
        HyFormContainerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        HyMaterialTabsModule,
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
    fixture = TestBed.createComponent(DocumentTabComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    nuxeoJSClientService = TestBed.inject(
      NuxeoJSClientService
    ) as jasmine.SpyObj<NuxeoJSClientService>;
    const nuxeoInstance = { instance: "nuxeoInstance" };
    nuxeoJSClientService.getNuxeoInstance.and.returnValue(nuxeoInstance);
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
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

  it("should return the correct error message when inputIdentifier has a required error", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["", Validators.required],
    });
    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe(GENERIC_LABELS.REQUIRED_DOCID_OR_PATH_ERROR);
  });

  it("should return null when inputIdentifier does not have a required error", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["some value"],
    });
    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  it("should call triggerAction with trimmed value when form is valid", () => {
    const triggerActionSpy = spyOn(component, "triggerAction");

    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["  'some value'  ", Validators.required],
    });
    spyOn(
      genericMultiFeatureUtilitiesService,
      "removeLeadingCharacters"
    ).and.returnValue("some value");
    component.onFormSubmit();
    expect(triggerActionSpy).toHaveBeenCalledWith("some value");
    expect(
      genericMultiFeatureUtilitiesService.removeLeadingCharacters
    ).toHaveBeenCalled();
  });

  it("should not call triggerAction when form is invalid", () => {
    const triggerActionSpy = spyOn(component, "triggerAction");
    spyOn(genericMultiFeatureUtilitiesService, "removeLeadingCharacters");
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["", Validators.required],
    });
    component.onFormSubmit();
    expect(triggerActionSpy).not.toHaveBeenCalled();
    expect(
      genericMultiFeatureUtilitiesService.removeLeadingCharacters
    ).not.toHaveBeenCalled();
  });

  it("should dispatch resetDocumentActionState and unsubscribe from subscriptions on ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    spyOn(component.documentActionLaunchedSubscription, "unsubscribe");
    spyOn(component.documentActionErrorSubscription, "unsubscribe");
    spyOn(component.actionDialogClosedSubscription, "unsubscribe");
    spyOn(component.launchedDialogClosedSubscription, "unsubscribe");
    spyOn(component.errorDialogClosedSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      FeatureActions.resetDocumentActionState()
    );
    expect(
      component.documentActionLaunchedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.documentActionErrorSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.actionDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.launchedDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.errorDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
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

  describe("test triggerAction", () => {
    it("should handle error if fetch fails", async () => {
      spyOn(
        genericMultiFeatureUtilitiesService,
        "decodeAndReplaceSingleQuotes"
      );
      const userInput = "test-input";
      component.nuxeo = {
        repository: jasmine.createSpy().and.returnValue({
          fetch: jasmine.createSpy().and.returnValue(
            Promise.reject({
              response: { json: () => Promise.resolve({ message: "error" }) },
            })
          ),
        }),
      };
      spyOn(store, "dispatch");

      spyOn(component, "checkIfErrorHasResponse").and.returnValue(true);

      await component.triggerAction(userInput);

      expect(component.nuxeo.repository().fetch).toHaveBeenCalledWith(
        userInput
      );
    });
  });

  it("should open error dialog and handle close subscription", () => {
    const mockError: ErrorDetails = {
      type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
      details: { message: "Test error" },
    };

    spyOn(component, "onActionErrorModalClose");

    component.showActionErrorModal(mockError);

    expect(dialogService.open).toHaveBeenCalledWith(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error: mockError,
      },
    });

    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(component.onActionErrorModalClose).toHaveBeenCalled();
  });

  describe('FEATURES.PICTURES', () => {
    it('should return correct labels and data for DOCUMENT tabType', () => {
      const result = featureMap()[FEATURES.PICTURES](GENERIC_LABELS.DOCUMENT);
      expect(result.labels.pageTitle).toBe(PICTURE_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE);
      expect(result.labels.submitBtnLabel).toBe(PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL);
    });
  });

});
