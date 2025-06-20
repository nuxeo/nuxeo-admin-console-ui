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
import {  StoreModule } from "@ngrx/store";
import { BehaviorSubject, of, Subject } from "rxjs";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
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
import { THUMBNAIL_GENERATION_LABELS } from "../../../../thumbnail-generation/thumbnail-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../../../fulltext-reindex/fulltext-reindex.constants";
import { VIDEO_RENDITIONS_LABELS } from "src/app/features/video-renditions-generation/video-renditions-generation.constants";

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
     return ;
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
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed", "afterOpened"]);
    mockDialogRef.afterClosed.and.returnValue(of({}));
    mockDialogRef.afterOpened.and.returnValue(of());

    dialogService = jasmine.createSpyObj("MatDialog", ["open"]);
    dialogService.open.and.returnValue(mockDialogRef);
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
    spyOn((component as any).destroy$, "next");
    spyOn((component as any).destroy$, "complete");
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      FeatureActions.resetDocumentActionState()
    );
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

      spyOn(genericMultiFeatureUtilitiesService, "checkIfResponseHasError").and.returnValue(true);

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

  describe('FEATURES.PICTURE_RENDITIONS', () => {
    it('should return correct labels and data for DOCUMENT tabType', () => {
      const result = featureMap()[FEATURES.PICTURE_RENDITIONS](GENERIC_LABELS.DOCUMENT);
      expect(result.labels.pageTitle).toBe(PICTURE_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE);
      expect(result.labels.submitBtnLabel).toBe(PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL);
    });
  });

  describe('FEATURES.THUMBNAIL_GENERATION', () => {
    it('should return correct labels and data for DOCUMENT tabType', () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.DOCUMENT);
      expect(result.labels.pageTitle).toBe(THUMBNAIL_GENERATION_LABELS.DOCUMENT_THUMBNAIL_GENERATION_TITLE);
      expect(result.labels.submitBtnLabel).toBe(THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL);
    });
  });

  describe('FEATURES.FULLTEXT_REINDEX', () => {
    it('should return correct labels and data for DOCUMENT tabType', () => {
      const result = featureMap()[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.DOCUMENT);
      expect(result.labels.pageTitle).toBe(FULLTEXT_REINDEX_LABELS.DOCUMENT_REINDEX_TITLE);
      expect(result.labels.submitBtnLabel).toBe(FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL);
    });
  });

  describe("ngOnInit", () => {
    let addControlSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, "showActionLaunchedModal");
      spyOn(component, "showActionErrorModal");
      addControlSpy = spyOn(
        component.inputForm,
        "addControl"
      ).and.callThrough();
      spyOn(
        genericMultiFeatureUtilitiesService,
        "getActiveFeature"
      ).and.returnValue("elasticsearch-reindex" as any);
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
    const mockError: ErrorDetails = { message: "Test", code: "Error" } as any;
    component.showActionErrorModal(mockError);
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

  it("should reset conversionNames, force, form controls", () => {
    spyOn(component, "isFeatureVideoRenditions").and.returnValue(true);
    spyOn(component, "isFeatureFullTextReindex").and.returnValue(true);
    const control = new FormControl("");
    const resetSpy = spyOn(control, "reset");
    component.inputForm = new FormGroup({
      conversionNames: control,
      force: control,
    });
    component.onActionLaunchedModalClose();
    expect(resetSpy).toHaveBeenCalledTimes(2);
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
});