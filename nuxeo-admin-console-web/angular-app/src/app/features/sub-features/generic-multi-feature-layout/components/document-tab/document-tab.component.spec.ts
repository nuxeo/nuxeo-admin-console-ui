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
import { DocumentTabComponent } from "./document-tab.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DocumentActionState } from "../../store/reducers";
import * as FeatureActions from "../../store//actions";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { ErrorDetails } from "../../generic-multi-feature-layout.interface";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import {
  featureMap,
  FEATURES,
} from "../../generic-multi-feature-layout.mapping";
import { PICTURE_RENDITIONS_LABELS } from "../../../../pictures/pictures-renditions.constants";
import { THUMBNAIL_GENERATION_LABELS } from "../../../../thumbnail-generation/thumbnail-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../../../fulltext-reindex/fulltext-reindex.constants";
import { VIDEO_RENDITIONS_LABELS } from "src/app/features/video-renditions-generation/video-renditions-generation.constants";
describe("DocumentTabComponent", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let component: DocumentTabComponent;
  let genericMultiFeatureUtilitiesService: MockedObject<GenericMultiFeatureUtilitiesService>;
  let fixture: ComponentFixture<DocumentTabComponent>;
  let store: MockStore<DocumentActionState>;
  let dialogService: MockedObject<MatDialog>;
  let mockDialogRef: MockedObject<MatDialogRef<GenericModalComponent>>;
  let nuxeoJSClientService: MockedObject<NuxeoJSClientService>;

  class genericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    store: unknown;
    removeLeadingCharacters() {
      return "";
    }

    decodeAndReplaceSingleQuotes() {
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

    handleErrorJson(): void {
      return;
    }

    buildRequestQuery(): void {
      return;
    }

    buildRequestParams(): void {
      return;
    }
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = {
      getNuxeoInstance: vi
        .fn()
        .mockName("NuxeoJSClientService.getNuxeoInstance"),
    };
    const initialState: DocumentActionState = {
      documentActionInfo: {
        commandId: "mockCommandId",
      },
      error: null,
    };
    mockDialogRef = {
      afterClosed: vi.fn().mockName("MatDialogRef.afterClosed"),
      afterOpened: vi.fn().mockName("MatDialogRef.afterOpened"),
    } as MockedObject<MatDialogRef<GenericModalComponent>>;
    mockDialogRef.afterClosed.mockReturnValue(of({}));
    mockDialogRef.afterOpened.mockReturnValue(of());

    dialogService = {
      open: vi.fn().mockName("MatDialog.open"),
    } as MockedObject<MatDialog>;
    dialogService.open.mockReturnValue(mockDialogRef);
    await TestBed.configureTestingModule({
      declarations: [DocumentTabComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
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
    ) as MockedObject<GenericMultiFeatureUtilitiesService>;
    fixture = TestBed.createComponent(DocumentTabComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    nuxeoJSClientService = TestBed.inject(
      NuxeoJSClientService
    ) as MockedObject<NuxeoJSClientService>;
    const nuxeoInstance = { instance: "nuxeoInstance" };
    nuxeoJSClientService.getNuxeoInstance.mockReturnValue(nuxeoInstance);
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should open the reindex launched modal with correct data and subscribe to afterClosed", () => {
    const commandId = "test-command-id";
    const showActionLaunchedModalSpy = vi.spyOn(
      component,
      "showActionLaunchedModal"
    );
    const onActionLaunchedModalCloseSpy = vi.spyOn(
      component,
      "onActionLaunchedModalClose"
    );
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

  it("should call triggerAction with trimmed value when form is valid", () => {
    const triggerActionSpy = vi.spyOn(component, "triggerAction");

    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["  'some value'  ", Validators.required],
    });
    vi.spyOn(
      genericMultiFeatureUtilitiesService,
      "removeLeadingCharacters"
    ).mockReturnValue("some value");
    component.onFormSubmit();
    expect(triggerActionSpy).toHaveBeenCalledWith("some value");
    expect(
      genericMultiFeatureUtilitiesService.removeLeadingCharacters
    ).toHaveBeenCalled();
  });

  it("should not call triggerAction when form is invalid", () => {
    const triggerActionSpy = vi.spyOn(component, "triggerAction");
    vi.spyOn(genericMultiFeatureUtilitiesService, "removeLeadingCharacters");
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
    const dispatchSpy = vi.spyOn(store, "dispatch");
    vi.spyOn((component as any).destroy$, "next");
    vi.spyOn((component as any).destroy$, "complete");
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      FeatureActions.resetDocumentActionState()
    );
  });

  describe("test triggerAction", () => {
    it("should handle error if fetch fails", async () => {
      vi.spyOn(
        genericMultiFeatureUtilitiesService,
        "decodeAndReplaceSingleQuotes"
      );
      const userInput = "test-input";
      component.nuxeo = {
        repository: vi.fn().mockReturnValue({
          fetch: vi.fn().mockReturnValue(
            Promise.reject({
              response: { json: () => Promise.resolve({ message: "error" }) },
            })
          ),
        }),
      };
      vi.spyOn(store, "dispatch");

      vi.spyOn(
        genericMultiFeatureUtilitiesService,
        "checkIfResponseHasError"
      ).mockReturnValue(true);

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

    vi.spyOn(component, "onActionErrorModalClose");

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

  describe("FEATURES.PICTURE_RENDITIONS", () => {
    it("should return correct labels and data for DOCUMENT tabType", () => {
      const result = featureMap()[FEATURES.PICTURE_RENDITIONS](
        GENERIC_LABELS.DOCUMENT
      );
      expect(result.labels.pageTitle).toBe(
        PICTURE_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE
      );
      expect(result.labels.submitBtnLabel).toBe(
        PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
      );
    });
  });

  describe("FEATURES.THUMBNAIL_GENERATION", () => {
    it("should return correct labels and data for DOCUMENT tabType", () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](
        GENERIC_LABELS.DOCUMENT
      );
      expect(result.labels.pageTitle).toBe(
        THUMBNAIL_GENERATION_LABELS.DOCUMENT_THUMBNAIL_GENERATION_TITLE
      );
      expect(result.labels.submitBtnLabel).toBe(
        THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL
      );
    });
  });

  describe("FEATURES.FULLTEXT_REINDEX", () => {
    it("should return correct labels and data for DOCUMENT tabType", () => {
      const result = featureMap()[FEATURES.FULLTEXT_REINDEX](
        GENERIC_LABELS.DOCUMENT
      );
      expect(result.labels.pageTitle).toBe(
        FULLTEXT_REINDEX_LABELS.DOCUMENT_REINDEX_TITLE
      );
      expect(result.labels.submitBtnLabel).toBe(
        FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL
      );
    });
  });

  describe("ngOnInit", () => {
    let addControlSpy: Mock;
    beforeEach(() => {
      vi.spyOn(component, "showActionLaunchedModal");
      vi.spyOn(component, "showActionErrorModal");
      addControlSpy = vi.spyOn(component.inputForm, "addControl");
      vi.spyOn(
        genericMultiFeatureUtilitiesService,
        "getActiveFeature"
      ).mockReturnValue("elasticsearch-reindex" as any);
    });

    it("should call showActionLaunchedModal when documentActionLaunched$ emits with commandId", () => {
      const commandId = "mockCommandId";
      (component as any).documentActionLaunched$ = of({ commandId });
      (component as any).documentActionError$ = of(null);
      component.ngOnInit();
      expect(component.showActionLaunchedModal).toHaveBeenCalledWith(commandId);
    });

    it("should call showActionErrorModal when documentActionError$ emits with error", () => {
      const error = { status: 500, message: "Server error" };
      (component as any).documentActionLaunched$ = of(null);
      (component as any).documentActionError$ = of(error);
      component.ngOnInit();
      expect(component.showActionErrorModal).toHaveBeenCalledWith({
        type: ERROR_TYPES.SERVER_ERROR,
        details: { status: error.status, message: error.message },
      });
    });

    it("should not call showActionLaunchedModal if documentActionLaunched$ emits without commandId", () => {
      (component as any).documentActionLaunched$ = of({});
      (component as any).documentActionError$ = of(null);
      component.ngOnInit();
      expect(component.showActionLaunchedModal).not.toHaveBeenCalled();
    });

    it("should not call showActionErrorModal if documentActionError$ emits null", () => {
      (component as any).documentActionLaunched$ = of(null);
      (component as any).documentActionError$ = of(null);
      component.ngOnInit();
      expect(component.showActionErrorModal).not.toHaveBeenCalled();
    });

    it("should add force control if feature is FULLTEXT_REINDEX", () => {
      vi.spyOn(component, "isFeatureFullTextReindex").mockReturnValue(true);
      component.ngOnInit();
      expect(addControlSpy).toHaveBeenCalledWith(
        FULLTEXT_REINDEX_LABELS.FORCE,
        expect.any(FormControl)
      );
    });

    it("should add video renditions controls if feature is VIDEO_RENDITIONS_GENERATION", () => {
      vi.spyOn(component, "isFeatureFullTextReindex").mockReturnValue(false);
      vi.spyOn(component, "isFeatureVideoRenditions").mockReturnValue(true);
      component.activeFeature = FEATURES.VIDEO_RENDITIONS_GENERATION as any;
      component.ngOnInit();
      expect(addControlSpy).toHaveBeenCalledWith(
        VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY,
        expect.any(FormControl)
      );
      expect(addControlSpy).toHaveBeenCalledWith(
        VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY,
        expect.any(FormControl)
      );
    });
  });

  it("should call focus on .cdk-dialog-container when showActionErrorModal dialog is opened", () => {
    const mockDialogElement = document.createElement("div");
    mockDialogElement.classList.add("cdk-dialog-container");
    const focusSpy = vi.spyOn(mockDialogElement, "focus");
    vi.spyOn(document, "querySelector").mockReturnValue(mockDialogElement);
    const afterOpened$ = new Subject<void>();
    const afterClosed$ = new Subject<void>();
    const mockDialogRef = {
      afterOpened: () => afterOpened$.asObservable(),
      afterClosed: () => afterClosed$.asObservable(),
    } as MatDialogRef<ErrorModalComponent>;
    dialogService.open.mockReturnValue(mockDialogRef);
    const mockError: ErrorDetails = { message: "Test", code: "Error" } as any;
    component.showActionErrorModal(mockError);
    afterOpened$.next();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should call focus on .cdk-dialog-container when showActionLaunchedModal dialog is opened", () => {
    const mockDialogElement = document.createElement("div");
    mockDialogElement.classList.add("cdk-dialog-container");
    const focusSpy = vi.spyOn(mockDialogElement, "focus");
    vi.spyOn(document, "querySelector").mockReturnValue(mockDialogElement);
    const afterOpened$ = new Subject<void>();
    const afterClosed$ = new Subject<void>();
    const mockDialogRef = {
      afterOpened: () => afterOpened$.asObservable(),
      afterClosed: () => afterClosed$.asObservable(),
    } as MatDialogRef<ErrorModalComponent>;
    dialogService.open.mockReturnValue(mockDialogRef);
    const commandId = "mockCommandId";
    component.showActionLaunchedModal(commandId);
    afterOpened$.next();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should reset conversionNames, force, form controls", () => {
    vi.spyOn(component, "isFeatureVideoRenditions").mockReturnValue(true);
    vi.spyOn(component, "isFeatureFullTextReindex").mockReturnValue(true);
    const control = new FormControl("");
    const resetSpy = vi.spyOn(control, "reset");
    component.inputForm = new FormGroup({
      conversionNames: control,
      force: control,
    });
    component.onActionLaunchedModalClose();
    expect(resetSpy).toHaveBeenCalledTimes(2);
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

  it("should show error modal if decodeURIComponent throws", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["mock%input", Validators.required],
    });
    component.isSubmitBtnDisabled = false;
    vi.spyOn(component, "triggerAction").mockImplementation(() => {});
    vi.spyOn(component, "showActionErrorModal").mockImplementation(() => {});
    vi.spyOn(window, "decodeURIComponent").mockImplementation(() => {
      throw new Error("Mock Error");
    });
    component.onFormSubmit();
    expect(component.triggerAction).not.toHaveBeenCalled();
    expect(component.showActionErrorModal).toHaveBeenCalledWith({
      type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
      details: { message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE },
    });
  });

  describe("triggerAction", () => {
    let fetchSpy: Mock;
    let buildRequestQuerySpy: Mock;
    let buildRequestParamsSpy: Mock;
    let storeDispatchSpy: Mock;
    let decodeAndReplaceSingleQuotesSpy: Mock;
    let showActionErrorModalSpy: Mock;

    beforeEach(() => {
      fetchSpy = vi
        .fn()
        .mockReturnValue(Promise.resolve({ path: "/mock/path" }));
      component.nuxeo = {
        repository: vi.fn().mockReturnValue({ fetch: fetchSpy }),
      } as any;
      buildRequestQuerySpy = vi
        .spyOn(genericMultiFeatureUtilitiesService, "buildRequestQuery")
        .mockReturnValue("query");
      buildRequestParamsSpy = vi
        .spyOn(genericMultiFeatureUtilitiesService, "buildRequestParams")
        .mockReturnValue({
          requestUrl: "url",
          requestParams: "",
          requestHeaders: {},
        });
      storeDispatchSpy = vi.spyOn(store, "dispatch");
      decodeAndReplaceSingleQuotesSpy = vi.spyOn(
        genericMultiFeatureUtilitiesService,
        "decodeAndReplaceSingleQuotes"
      );
      showActionErrorModalSpy = vi.spyOn(component, "showActionErrorModal");
      component.activeFeature = FEATURES.FULLTEXT_REINDEX as any;
      component.templateConfigData = { data: {} } as any;
      component.inputForm = new FormGroup({
        inputIdentifier: new FormControl(""),
      });
    });

    it("should build request and dispatch action for valid document", async () => {
      await component.triggerAction("mock/path");
      expect(component.nuxeo.repository).toHaveBeenCalled();
      expect(fetchSpy).toHaveBeenCalledWith("mock/path");
      expect(buildRequestQuerySpy).toHaveBeenCalled();
      expect(buildRequestParamsSpy).toHaveBeenCalled();
      expect(storeDispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FeatureActions.performDocumentAction.type,
        })
      );
    });

    it("should show error modal if buildRequestQuery throws", async () => {
      buildRequestQuerySpy.mockImplementation(() => {
        throw new Error("error");
      });
      await component.triggerAction("/mock/path");
      expect(showActionErrorModalSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
        })
      );
    });

    it("should show error modal if decodeAndReplaceSingleQuotes throws", async () => {
      fetchSpy.mockReturnValue(Promise.resolve({ path: "/default-domain's" }));
      decodeAndReplaceSingleQuotesSpy.mockImplementation(() => {
        throw new Error("mock error");
      });
      await component.triggerAction("/default-domain's");
      expect(showActionErrorModalSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
        })
      );
    });

    it("should not call buildRequestQuery if document is not object or missing path", async () => {
      fetchSpy.mockReturnValue(Promise.resolve(null));
      await component.triggerAction("mock/path/document");
      expect(buildRequestQuerySpy).not.toHaveBeenCalled();
      expect(storeDispatchSpy).not.toHaveBeenCalled();
    });
  });
});
