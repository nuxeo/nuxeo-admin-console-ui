import { FolderESReindexComponent } from "./folder-es-reindex.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
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
import { BehaviorSubject, Observable, of } from "rxjs";
import { ErrorDetails, ReindexInfo } from "../../elastic-search-reindex.interface";
import { NuxeoJSClientService } from "../../../../shared/services/nuxeo-js-client.service";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_ERROR_TYPES,
  ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS,
} from "../../elastic-search-reindex.constants";
import { DocumentReindexState, FolderReindexState } from "../../store/reducers";
import * as ReindexActions from "../../store//actions";
import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";

describe("FolderESReindexComponent", () => {
  let component: FolderESReindexComponent;
  let nuxeoJSClientService;
  let elasticSearchReindexService: jasmine.SpyObj<ElasticSearchReindexService>;
  let fixture: ComponentFixture<FolderESReindexComponent>;
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

    secondsToHumanReadable() {
      return "";
    }
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = jasmine.createSpyObj(
      "NuxeoJSClientService",
      ["getNuxeoInstance"]
    );
    const initialState: FolderReindexState = {
      folderReindexInfo: {
        commandId: "mockCommandId",
      },
      error: null,
    };
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed"]);
    mockDialogRef.afterClosed.and.returnValue(of({}));

    dialogService = jasmine.createSpyObj("MatDialog", ["open"]);
    dialogService.open.and.returnValue(mockDialogRef);
    await TestBed.configureTestingModule({
      declarations: [FolderESReindexComponent],
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
        { provide: MatDialog, useValue: dialogService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    elasticSearchReindexService = TestBed.inject(
      ElasticSearchReindexService
    ) as jasmine.SpyObj<ElasticSearchReindexService>;
    fixture = TestBed.createComponent(FolderESReindexComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    nuxeoJSClientService = TestBed.inject(NuxeoJSClientService);
    component.folderReindexForm = TestBed.inject(FormBuilder).group({
      documentID: [""],
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
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should open error dialog and handle close subscription", () => {
    const mockError: ErrorDetails = {
      type: ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID,
      details: { message: "Test error" },
    };

    spyOn(component, "onReindexErrorModalClose");
    component.userInput = "123";
    component.showReindexErrorModal(mockError);

    expect(dialogService.open).toHaveBeenCalledWith(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.HEIGHT,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.error,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_ERRROR_MODAL_TITLE}`,
          errorMessageHeader: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
          error: mockError,
          userInput: component.userInput,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          isErrorModal: true,
        },
      }
    );

    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(component.onReindexErrorModalClose).toHaveBeenCalled();
  });

  it("should focus on the input field on modal close", () => {
    const mockElement = jasmine.createSpyObj("HTMLElement", ["focus"]);
    spyOn(document, "getElementById").and.returnValue(mockElement);

    component.onReindexErrorModalClose();

    expect(document.getElementById).toHaveBeenCalledWith("documentID");
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
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.HEIGHT,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.launched,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED} ${commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          commandId,
          isLaunchedModal: true,
          copyActionId: `${ELASTIC_SEARCH_LABELS.COPY_ACTION_ID_BUTTON_LABEL}`,
        },
      }
    );
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onReindexLaunchedModalCloseSpy).toHaveBeenCalled();
  });

  it("should return the correct error message when documentID has a required error", () => {
    component.folderReindexForm = new FormBuilder().group({
      documentID: ["", Validators.required],
    });

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe(ELASTIC_SEARCH_LABELS.REQUIRED_DOCID_ERROR);
  });

  it("should return null when documentID does not have a required error", () => {
    component.folderReindexForm = new FormBuilder().group({
      documentID: ["some value"],
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

  it("should dispatch resetDocumentReindexState and unsubscribe from subscriptions on ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    spyOn(component.folderReindexingLaunchedSubscription, "unsubscribe");
    spyOn(component.folderReindexingErrorSubscription, "unsubscribe");
    spyOn(component.confirmDialogClosedSubscription, "unsubscribe");
    spyOn(component.launchedDialogClosedSubscription, "unsubscribe");
    spyOn(component.errorDialogClosedSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ReindexActions.resetFolderReindexState()
    );
    expect(
      component.folderReindexingLaunchedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.folderReindexingErrorSubscription.unsubscribe
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
    spyOn(component, "getHumanReadableTime").and.returnValue("1 second");
    const onConfirmationModalCloseSpy = spyOn(
      component,
      "onConfirmationModalClose"
    ).and.callThrough();
    component.showConfirmationModal(2);
    expect(dialogService.open).toHaveBeenCalledWith(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.HEIGHT,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.WIDTH,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.confirm,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_CONFIRMATION_MODAL_TITLE}`,
          message: `${ELASTIC_SEARCH_LABELS.REINDEX_WARNING}`,
          isConfirmModal: true,
          abortLabel: `${ELASTIC_SEARCH_LABELS.ABORT_LABEL}`,
          continueLabel: `${ELASTIC_SEARCH_LABELS.CONTINUE}`,
          impactMessage: `${ELASTIC_SEARCH_LABELS.IMPACT_MESSAGE}`,
          confirmContinue: `${ELASTIC_SEARCH_LABELS.CONTINUE_CONFIRMATION}`,
          documentCount: 2,
          timeTakenToReindex: "1 second",
        },
      }
    );
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onConfirmationModalCloseSpy).toHaveBeenCalled();
  });

  it("should get human readable time", () => {
    const seconds = 3661;
    const humanReadableTime = "1 hour 1 minute 1 second";
    spyOn(
      elasticSearchReindexService,
      "secondsToHumanReadable"
    ).and.returnValue(humanReadableTime);

    const result = component.getHumanReadableTime(seconds);

    expect(
      elasticSearchReindexService.secondsToHumanReadable
    ).toHaveBeenCalledWith(seconds);
    expect(result).toBe(humanReadableTime);
  });
});
