import { FolderTabComponent } from "./folder-tab.component";

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
import { BehaviorSubject, of, Subject } from "rxjs";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import * as FeatureActions from "../../store//actions";
import { FolderActionState } from "../../store/reducers";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { ErrorDetails } from "../../generic-multi-feature-layout.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { featureMap, FEATURES } from "../../generic-multi-feature-layout.mapping";
import { PICTURE_RENDITIONS_LABELS } from "../../../../pictures/pictures-renditions.constants";
import { THUMBNAIL_GENERATION_LABELS } from "../../../../thumbnail-generation/thumbnail-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../../../fulltext-reindex/fulltext-reindex.constants";
import { HttpErrorResponse } from "@angular/common/http";
import { VIDEO_RENDITIONS_LABELS } from "../../../../video-renditions-generation/video-renditions-generation.constants";

describe("FolderTabComponent", () => {
  let component: FolderTabComponent;
  let nuxeoJSClientService;
  let genericMultiFeatureUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  let fixture: ComponentFixture<FolderTabComponent>;
  let store: MockStore<FolderActionState>;
  let dialogService: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GenericModalComponent>>;

  class GenericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

    secondsToHumanReadable() {
      return "";
    }

    getActiveFeature() {
      return "ELASTIC_SEARCH_REINDEX";
    }

    checkIfResponseHasError(): boolean {
      return true;
    }
    handleError(): Promise<unknown> {
     return Promise.resolve("");
    }  

    removeLeadingCharacters(): string {
      return "mock-value";
    }

    decodeAndReplaceSingleQuotes():string {
      return "mock-value"
    }

    buildRequestQuery():void {
      return;
    }

    buildRequestParams():void {
      return;
    }

    handleErrorJson(): void {
      return;
    }
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = jasmine.createSpyObj(
      "NuxeoJSClientService",
      ["getNuxeoInstance"]
    );
    const initialState: FolderActionState = {
      folderActionInfo: {
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
      declarations: [FolderTabComponent],
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
          useClass: GenericMultiFeatureUtilitiesServiceStub,
        },
        { provide: MatDialog, useValue: dialogService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    genericMultiFeatureUtilitiesService = TestBed.inject(
      GenericMultiFeatureUtilitiesService
    ) as jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
    fixture = TestBed.createComponent(FolderTabComponent);
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
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should open error dialog and handle close subscription", () => {
    const mockError: ErrorDetails = {
      type: ERROR_TYPES.INVALID_DOC_ID,
      details: { message: "Test error" },
    };

    spyOn(component, "onActionErrorModalClose");
    component.userInput = "123";
    component.showActionErrorModal(mockError);

    expect(dialogService.open).toHaveBeenCalledWith(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error: mockError,
        userInput: component.userInput,
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

  it("should return null when inputIdentifier does not have a required error", () => {
   component.inputForm = new FormBuilder().group({
      inputIdentifier: ["", Validators.required],
    });
    spyOn(component, 'isIdAndPathRequired').and.returnValue(false);
    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe(GENERIC_LABELS.REQUIRED_DOCID_ERROR)
  });

  it("should dispatch resetDocumentReindexState and unsubscribe from subscriptions on ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    spyOn((component as any).destroy$, "next");
    spyOn((component as any).destroy$, "complete");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      FeatureActions.resetFolderActionState()
    );
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  it("should open the confirmation modal with correct data and subscribe to afterClosed", () => {
    spyOn(component, "getHumanReadableTime").and.returnValue("1 second");
    const onConfirmationModalCloseSpy = spyOn(
      component,
      "onConfirmationModalClose"
    ).and.callThrough();
    component.showConfirmationModal(2);
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
  describe('FEATURES.PICTURE_RENDITIONS', () => {
    it('should return correct labels and data for FOLDER tabType', () => {
      const result = featureMap()[FEATURES.PICTURE_RENDITIONS](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe(PICTURE_RENDITIONS_LABELS.FOLDER_RENDITIONS_TITLE);
      expect(result.labels.submitBtnLabel).toBe(PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL);
    });
  });

  describe('FEATURES.THUMBNAIL_GENERATION', () => {
    it('should return correct labels and data for FOLDER tabType', () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe(THUMBNAIL_GENERATION_LABELS.FOLDER_THUMBNAIL_GENERATION_TITLE);
      expect(result.labels.submitBtnLabel).toBe(THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL);
    });
  });

  describe('FEATURES.FULLTEXT_REINDEX', () => {
    it('should return correct labels and data for FOLDER tabType', () => {
      const result = featureMap()[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe(FULLTEXT_REINDEX_LABELS.FOLDER_REINDEX_TITLE);
      expect(result.labels.submitBtnLabel).toBe(FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL);
    });
  });

  describe("ngOnInit", () => {
    let addControlSpy: jasmine.Spy;
    beforeEach(() => {
      addControlSpy = spyOn(
        component.inputForm,
        "addControl"
      ).and.callThrough();
      spyOn(
        genericMultiFeatureUtilitiesService,
        "getActiveFeature"
      ).and.returnValue("elasticsearch-reindex" as any);
    });

    it("it should call showActionLaunchedModal with commandId", () => {
      const data = { commandId: "mockCommandId" };
      component.folderActionLaunched$ = of(data);
      spyOn(component, "showActionLaunchedModal");
      component.ngOnInit();
      expect(component.showActionLaunchedModal).toHaveBeenCalledWith(
        data.commandId
      );
    });

    it('should update templateLabels data', () => {
       component.templateConfigData =
         {
           labels: {
             pageTitle: 'test',
             submitBtnLabel: 'confirm'
           }
         } as any
       component.ngOnInit();
       expect(component.templateLabels).toEqual(component.templateConfigData.labels)
     });

    it("it should call showActionLaunchedModal with commandId", () => {
      const error = new HttpErrorResponse({
        error: { message: "mockErrorMessage" },
        status: 500,
        statusText: "Server Error",
      });
      component.folderActionError$ = of(error);
      spyOn(component, "showActionErrorModal");
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: { status: error.status, message: error.message },
      });
    });

    it("should add force control if feature is FULLTEXT_REINDEX", () => {
      spyOn(component, "isFeatureFullTextReindex").and.returnValue(true);
      component.ngOnInit();
      expect(addControlSpy).toHaveBeenCalledWith(
        FULLTEXT_REINDEX_LABELS.FORCE,
        jasmine.any(FormControl)
      );
    });

    it("should add video renditions controls if feature is VIDEO_RENDITIONS_GENERATION", () => {
      spyOn(component, "isFeatureFullTextReindex").and.returnValue(false);
      spyOn(component, "isFeatureVideoRenditions").and.returnValue(true);
      component.activeFeature = FEATURES.VIDEO_RENDITIONS_GENERATION as any;
      component.ngOnInit();
      expect(addControlSpy).toHaveBeenCalledWith(
        VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY,
        jasmine.any(FormControl)
      );
      expect(addControlSpy).toHaveBeenCalledWith(
        VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY,
        jasmine.any(FormControl)
      );
    });
  });

  it("should disable submit button when form is submitted", () => {
    component.inputForm.get("inputIdentifier")?.setValue("test input");
    component.isSubmitBtnDisabled = false;
    fixture.detectChanges();
    spyOn(genericMultiFeatureUtilitiesService, "removeLeadingCharacters");
    component.onFormSubmit();
    expect(component.isSubmitBtnDisabled).toBeFalse();
  });

  it("should handle form submission for valid path with single quotes", () => {
    const mockDecodedInput = "/mockValue";
    spyOn(genericMultiFeatureUtilitiesService, "removeLeadingCharacters");
    spyOn(
      genericMultiFeatureUtilitiesService,
      "decodeAndReplaceSingleQuotes"
    ).and.returnValue(mockDecodedInput);
    spyOn(component, "triggerAction");
    component.inputForm.get("inputIdentifier")?.setValue("mock input");
    component.onFormSubmit();
    expect(
      genericMultiFeatureUtilitiesService.removeLeadingCharacters
    ).toHaveBeenCalled();
    expect(
      genericMultiFeatureUtilitiesService.decodeAndReplaceSingleQuotes
    ).toHaveBeenCalled();
    expect(component.triggerAction).toHaveBeenCalled();
  });

  it("should show error modal if decodeURIComponent throws", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["mock%input", Validators.required],
    });
    component.isSubmitBtnDisabled = false;
    spyOn(component, "triggerAction");
    spyOn(component, "showActionErrorModal");
    fixture.detectChanges();
    spyOn(window, "decodeURIComponent").and.throwError("Mock URI Error");
    spyOn(component, "isIdAndPathRequired").and.returnValue(false);
    fixture.detectChanges();
    component.onFormSubmit();
    expect(component.triggerAction).not.toHaveBeenCalled();
    expect(component.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.INVALID_DOC_ID,
      details: { message: ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE },
    });
  });

  it("should process request directly when ID-only feature is used", () => {
    spyOn(component, "isIdAndPathRequired").and.returnValue(false);
    spyOn(component, "processRequest");
    component.triggerAction("test-id");
    expect(component.processRequest).toHaveBeenCalledWith("test-id");
  });

  it("should handle confirmation modal close with continue action", () => {
    const mockRequestParams = {
      requestUrl: "test-url",
      requestParams: "",
      requestHeaders: {},
    };
    spyOn(store, "dispatch");
    spyOn(
      genericMultiFeatureUtilitiesService,
      "buildRequestParams"
    ).and.returnValue(mockRequestParams);
    component.onConfirmationModalClose({ continue: true });
    expect(component.isSubmitBtnDisabled).toBeFalse();
  });

  it("should call buildRequestParams and store", () => {
    component.activeFeature = "elasticsearch-reindex" as any;
    const mockRequestParams = {
      requestUrl: "test-url",
      requestParams: "",
      requestHeaders: {},
    };
    spyOn(store, "dispatch");
    spyOn(
      genericMultiFeatureUtilitiesService,
      "buildRequestParams"
    ).and.returnValue(mockRequestParams);
    component.onConfirmationModalClose({ continue: true });
    expect(
      genericMultiFeatureUtilitiesService.buildRequestParams
    ).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it("should focus input on confirmation modal close without continue", () => {
    const mockElement = document.createElement("input");
    spyOn(document, "getElementById").and.returnValue(mockElement);
    spyOn(mockElement, "focus");
    component.onConfirmationModalClose({ continue: false });
    expect(document.getElementById).toHaveBeenCalledWith("inputIdentifier");
    expect(mockElement.focus).toHaveBeenCalled();
  });

  it("should reset", () => {
    spyOn(component, "isFeatureVideoRenditions").and.returnValue(true);
    const control = new FormControl("");
    const resetSpy = spyOn(control, "reset");
    component.inputForm = new FormGroup({
      conversionNames: control,
    });
    component.onActionLaunchedModalClose();
    expect(resetSpy).toHaveBeenCalled();
  });

  it("should call focus on .cdk-dialog-container when showActionErrorModal dialog is opened", () => {
    const mockDialogElement = document.createElement("div");
    mockDialogElement.classList.add("cdk-dialog-container");
    const focusSpy = spyOn(mockDialogElement, "focus");
    spyOn(document, "querySelector").and.returnValue(mockDialogElement);
    const afterOpened$ = new Subject<void>();
    const afterClosed$ = new Subject<void>();
    const mockDialogRef = {
      afterOpened: () => afterOpened$.asObservable(),
      afterClosed: () => afterClosed$.asObservable(),
    } as MatDialogRef<ErrorModalComponent>;

    dialogService.open.and.returnValue(mockDialogRef);
    const fakeError: ErrorDetails = { message: "Test", code: "Error" } as any;
    component["userInput"] = "mockInput";
    component.showActionErrorModal(fakeError);
    afterOpened$.next();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should call focus on .cdk-dialog-container when showActionLaunchedModal dialog is opened", () => {
    const mockDialogElement = document.createElement("div");
    mockDialogElement.classList.add("cdk-dialog-container");
    const focusSpy = spyOn(mockDialogElement, "focus");
    spyOn(document, "querySelector").and.returnValue(mockDialogElement);
    const afterOpened$ = new Subject<void>();
    const afterClosed$ = new Subject<void>();
    const mockDialogRef = {
      afterOpened: () => afterOpened$.asObservable(),
      afterClosed: () => afterClosed$.asObservable(),
    } as MatDialogRef<ErrorModalComponent>;
    dialogService.open.and.returnValue(mockDialogRef);
    const commandId = "mockCommandId";
    component.showActionLaunchedModal(commandId);
    afterOpened$.next();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should call focus on .cdk-dialog-container when showConfirmationModal dialog is opened", () => {
    const mockDialogElement = document.createElement("div");
    mockDialogElement.classList.add("cdk-dialog-container");
    const focusSpy = spyOn(mockDialogElement, "focus");
    spyOn(document, "querySelector").and.returnValue(mockDialogElement);
    const afterOpened$ = new Subject<void>();
    const afterClosed$ = new Subject<void>();
    const mockDialogRef = {
      afterOpened: () => afterOpened$.asObservable(),
      afterClosed: () => afterClosed$.asObservable(),
    } as MatDialogRef<ErrorModalComponent>;

    dialogService.open.and.returnValue(mockDialogRef);
    const commandId = 123;
    component.showConfirmationModal(commandId);
    afterOpened$.next();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should unsubscribe from all subscriptions", (done) => {
    let unsubscribed = false;
    (component as any).destroy$.subscribe({
      complete: () => {
        unsubscribed = true;
      },
    });
    component.ngOnDestroy();
    expect(unsubscribed).toBeTrue();
    done();
  });

  describe("processRequest", () => {
    it("should call buildRequestQuery and fetchNoOfDocuments with correct arguments", () => {
      const userInput = "mock-user-input";
      const mockQuery = "SELECT * FROM Document";
      spyOn(
        genericMultiFeatureUtilitiesService,
        "buildRequestQuery"
      ).and.returnValue(mockQuery);
      spyOn(component, "fetchNoOfDocuments");
      component.templateConfigData = { some: "data" } as any;
      component.processRequest(userInput);
      expect(
        genericMultiFeatureUtilitiesService.buildRequestQuery
      ).toHaveBeenCalledWith(userInput, component.templateConfigData);
      expect(component.fetchNoOfDocuments).toHaveBeenCalled();
    });

    it("should handle processRequest errors appropriately", () => {
      spyOn(
        genericMultiFeatureUtilitiesService,
        "buildRequestQuery"
      ).and.throwError("Mock error");
      spyOn(component, "showActionErrorModal");
      component.processRequest("mock-input");
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
        details: {
          message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
        },
      });
    });
  });
  describe("triggerAction", () => {
    beforeEach(() => {
      component.nuxeo = {
        repository: jasmine.createSpy().and.returnValue({
          fetch: jasmine.createSpy(),
        }),
      } as any;
    });

    it("should call processRequest with doc.uid when areIdAndPathRequired is true and fetch resolves with document", async () => {
      spyOn(component, "isIdAndPathRequired").and.returnValue(true);
      const mockUid = "mock-uid";
      const fetchSpy = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve({ uid: mockUid }));
      (component.nuxeo.repository as jasmine.Spy).and.returnValue({
        fetch: fetchSpy,
      });
      const processRequestSpy = spyOn(component, "processRequest");
      spyOn(
        (component as any).genericMultiFeatureUtilitiesService,
        "handleError"
      );
      spyOn(
        (component as any).genericMultiFeatureUtilitiesService,
        "handleErrorJson"
      );
      await component.triggerAction("mock-user-input");
      await Promise.resolve();
      expect(fetchSpy).toHaveBeenCalledWith("mock-user-input");
      expect(processRequestSpy).toHaveBeenCalledWith(mockUid);
    });

    it("should not call processRequest if fetch resolves with null", async () => {
      spyOn(component, "isIdAndPathRequired").and.returnValue(true);
      const fetchSpy = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(null));
      (component.nuxeo.repository as jasmine.Spy).and.returnValue({
        fetch: fetchSpy,
      });
      const processRequestSpy = spyOn(component, "processRequest");
      spyOn(
        (component as any).genericMultiFeatureUtilitiesService,
        "handleError"
      );
      spyOn(
        (component as any).genericMultiFeatureUtilitiesService,
        "handleErrorJson"
      );
      await component.triggerAction("mock-user-input");
      await Promise.resolve();
      expect(fetchSpy).toHaveBeenCalledWith("mock-user-input");
      expect(processRequestSpy).not.toHaveBeenCalled();
    });
  });
});