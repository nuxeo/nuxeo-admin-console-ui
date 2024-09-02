import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DocumentESReindexComponent } from "./document-es-reindex.component";
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
import { BehaviorSubject, Observable, of } from "rxjs";
import {
  ErrorDetails,
  ReindexInfo,
} from "../../elastic-search-reindex.interface";
import { NuxeoJSClientService } from "../../../../shared/services/nuxeo-js-client.service";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex.constants";
import { DocumentReindexState } from "../../store/reducers";
import * as ReindexActions from "../../store//actions";
import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import {
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "../../../../shared/constants/common.constants";
import { ErrorModalComponent } from "../../../../shared/components/error-modal/error-modal.component";
import { CommonService } from "../../../../shared/services/common.service";

describe("DocumentESReindexComponent", () => {
  let component: DocumentESReindexComponent;
  let nuxeoJSClientService: jasmine.SpyObj<NuxeoJSClientService>;
  let elasticSearchReindexService: jasmine.SpyObj<ElasticSearchReindexService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let fixture: ComponentFixture<DocumentESReindexComponent>;
  let store: MockStore<DocumentReindexState>;
  let dialogService: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<
    MatDialogRef<ElasticSearchReindexModalComponent>
  >;

  class elasticSearchReindexServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    performDocumentReindex() {
      return Observable<ReindexInfo>;
    }

    performFolderReindex() {
      return Observable<ReindexInfo>;
    }

    performNXQLReindex() {
      return Observable<ReindexInfo>;
    }
  }

  class CommonServiceStub {
    removeLeadingCharacters() {
      return "";
    }

    decodeAndReplaceSingleQuotes() {
      return "";
    }
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = jasmine.createSpyObj(
      "NuxeoJSClientService",
      ["getNuxeoInstance"]
    );
    const initialState: DocumentReindexState = {
      reindexInfo: {
        commandId: "mockCommandId",
      },
      error: null,
    };
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);
    mockDialogRef.afterClosed.and.returnValue(of({}));

    dialogService = jasmine.createSpyObj("MatDialog", ["open"]);
    dialogService.open.and.returnValue(mockDialogRef);
    await TestBed.configureTestingModule({
      declarations: [DocumentESReindexComponent],
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
        MatProgressSpinnerModule,
        MatDialogModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        { provide: NuxeoJSClientService, useValue: nuxeoJSClientServiceSpy },
        {
          provide: ElasticSearchReindexService,
          useClass: elasticSearchReindexServiceStub,
        },
        {
          provide: CommonService,
          useClass: CommonServiceStub,
        },
        { provide: MatDialog, useValue: dialogService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    elasticSearchReindexService = TestBed.inject(
      ElasticSearchReindexService
    ) as jasmine.SpyObj<ElasticSearchReindexService>;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
    fixture = TestBed.createComponent(DocumentESReindexComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    nuxeoJSClientService = TestBed.inject(
      NuxeoJSClientService
    ) as jasmine.SpyObj<NuxeoJSClientService>;
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize Nuxeo instance and set page title on ngOnInit", () => {
    const nuxeoInstance = { instance: "nuxeoInstance" };
    nuxeoJSClientService.getNuxeoInstance.and.returnValue(nuxeoInstance);
    spyOn(elasticSearchReindexService.pageTitle, "next");
    component.ngOnInit();

    expect(component.nuxeo).toEqual(nuxeoInstance);
    expect(elasticSearchReindexService.pageTitle.next).toHaveBeenCalledWith(
      `${ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE}`
    );
  });

  it("should focus on the input field on modal close", () => {
    const mockElement = jasmine.createSpyObj("HTMLElement", ["focus"]);
    spyOn(document, "getElementById").and.returnValue(mockElement);

    component.onReindexErrorModalClose();

    expect(document.getElementById).toHaveBeenCalledWith("documentIdentifier");
    expect(mockElement.focus).toHaveBeenCalled();
  });

  it("should open the reindex launched modal with correct data and subscribe to afterClosed", () => {
    const commandId = "test-command-id";
    const showReindexLaunchedModalSpy = spyOn(
      component,
      "showReindexLaunchedModal"
    ).and.callThrough();
    const onReindexLaunchedModalCloseSpy = spyOn(
      component,
      "onReindexLaunchedModalClose"
    ).and.callThrough();
    component.showReindexLaunchedModal(commandId);
    expect(showReindexLaunchedModalSpy).toHaveBeenCalledWith(commandId);
    expect(dialogService.open).toHaveBeenCalledWith(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.launched,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED} ${commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
          commandId,
        },
      }
    );
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onReindexLaunchedModalCloseSpy).toHaveBeenCalled();
  });

  it("should return the correct error message when documentIdentifier has a required error", () => {
    component.documentReindexForm = new FormBuilder().group({
      documentIdentifier: ["", Validators.required],
    });

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe(
      ELASTIC_SEARCH_LABELS.REQUIRED_DOCID_OR_PATH_ERROR
    );
  });

  it("should return null when documentIdentifier does not have a required error", () => {
    component.documentReindexForm = new FormBuilder().group({
      documentIdentifier: ["some value"],
    });
    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  it("should call triggerReindex with trimmed value when form is valid", () => {
    const triggerReindexSpy = spyOn(component, "triggerReindex");

    component.documentReindexForm = new FormBuilder().group({
      documentIdentifier: ["  'some value'  ", Validators.required],
    });
    spyOn(commonService, "removeLeadingCharacters").and.returnValue(
      "some value"
    );
    component.onReindexFormSubmit();
    expect(triggerReindexSpy).toHaveBeenCalledWith("some value");
    expect(commonService.removeLeadingCharacters).toHaveBeenCalled();
  });

  it("should not call triggerReindex when form is invalid", () => {
    const triggerReindexSpy = spyOn(component, "triggerReindex");
    spyOn(commonService, "removeLeadingCharacters");
    component.documentReindexForm = new FormBuilder().group({
      documentIdentifier: ["", Validators.required],
    });
    component.onReindexFormSubmit();
    expect(triggerReindexSpy).not.toHaveBeenCalled();
    expect(commonService.removeLeadingCharacters).not.toHaveBeenCalled();
  });

  it("should dispatch resetDocumentReindexState and unsubscribe from subscriptions on ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    spyOn(component.documentReindexingLaunchedSubscription, "unsubscribe");
    spyOn(component.documentReindexingErrorSubscription, "unsubscribe");
    spyOn(component.reindexDialogClosedSubscription, "unsubscribe");
    spyOn(component.launchedDialogClosedSubscription, "unsubscribe");
    spyOn(component.errorDialogClosedSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ReindexActions.resetDocumentReindexState()
    );
    expect(
      component.documentReindexingLaunchedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.documentReindexingErrorSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.reindexDialogClosedSubscription.unsubscribe
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

  describe("test triggerReindex", () => {
    it("should dispatch performDocumentReindex on successful fetch", async () => {
      spyOn(commonService, "decodeAndReplaceSingleQuotes").and.returnValue(
        "/some/path"
      );
      component.nuxeo = {
        repository: jasmine.createSpy().and.returnValue({
          fetch: jasmine
            .createSpy()
            .and.returnValue(Promise.resolve({ path: "'/some/path'" })),
        }),
      };
      spyOn(store, "dispatch");
      const userInput = "test-input";
      await component.triggerReindex(userInput);
      expect(component.nuxeo.repository().fetch).toHaveBeenCalledWith(
        userInput
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        ReindexActions.performDocumentReindex({
          requestQuery: `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:path='/some/path'`,
        })
      );
      expect(commonService.decodeAndReplaceSingleQuotes).toHaveBeenCalled();
    });

    it("should handle error if fetch fails", async () => {
      spyOn(commonService, "decodeAndReplaceSingleQuotes");
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

      await component.triggerReindex(userInput);

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

    spyOn(component, "onReindexErrorModalClose");

    component.showReindexErrorModal(mockError);

    expect(dialogService.open).toHaveBeenCalledWith(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error: mockError,
      },
    });

    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(component.onReindexErrorModalClose).toHaveBeenCalled();
  });
});
