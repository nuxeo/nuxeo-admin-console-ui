import { HyDialogBoxModule } from "@hyland/ui";
import { ElasticSearchReindexModalComponent } from "./elastic-search-reindex-modal.component";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { EventEmitter } from "@angular/core";
import { CommonService } from "../../../../shared/services/common.service";
import { ReindexModalData } from "../../elastic-search-reindex.interface";
import { ELASTIC_SEARCH_LABELS, ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES, ELASTIC_SEARCH_REINDEX_ERROR_TYPES } from "../../elastic-search-reindex.constants";

describe("ElasticSearchReindexModalComponent", () => {
  let component: ElasticSearchReindexModalComponent;
  let fixture: ComponentFixture<ElasticSearchReindexModalComponent>;
  let dialogRef: MatDialogRef<ElasticSearchReindexModalComponent>;

  class CommonServiceStub {
    loadApp = new EventEmitter<boolean>();
  }

  const mockDialogData: ReindexModalData = {
    title: "Test Title",
    isConfirmModal: true,
    documentCount: 5,
    impactMessage: "This is going to affect a huge no. of documents",
    timeTakenToReindex: "10 minutes",
    confirmContinue: "Do you want to continue?",
    isErrorModal: false,
    errorMessageHeader: "",
    error: { type: "", details: { status: 0, message: "" } },
    launchedMessage: "",
    copyActionId: "Copy ID",
    abortLabel: "Abort",
    continueLabel: "Continue",
    closeLabel: "Close",
    isLaunchedModal: true,
    commandId: "203-11112-38652-990",
    userInput: "",
  };

  beforeEach(async () => {
    const matDialogRefSpy = jasmine.createSpyObj("MatDialogRef", [
      "afterClosed",
      "continue",
      "close",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ElasticSearchReindexModalComponent],
      imports: [
        CommonModule,
        HyDialogBoxModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: CommonService, useClass: CommonServiceStub },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ElasticSearchReindexModalComponent);
    dialogRef = TestBed.inject(
      MatDialogRef
    ) as MatDialogRef<ElasticSearchReindexModalComponent>;
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should emit continue: true & commandId when user chooses to continue", () => {
    component.continue();
    expect(dialogRef.close).toHaveBeenCalledWith({
      continue: true,
      commandId: mockDialogData.commandId,
    });
  });

  it("should emit continue: false when user closes the modal", () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith({
      continue: false,
    });
  });

  it("should display a JavaScript alert indicating action ID has been copied to clipboard", async () => {
    const clipboardWriteTextSpy = spyOn(
      navigator.clipboard,
      "writeText"
    ).and.returnValue(Promise.resolve());
    const alertSpy = spyOn(window, "alert");

    await component.copyActionId();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(
      mockDialogData.commandId
    );
    expect(alertSpy).toHaveBeenCalledWith(
      ELASTIC_SEARCH_LABELS.ACTION_ID_COPIED_ALERT
    );
  });
  

  it("should return INVALID_DOC_ID_OR_PATH_MESSAGE when error type is INVALID_DOC_ID_OR_PATH", () => {
    component.data.error.type = ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID_OR_PATH;
    const message = component.getNoDocumentsMessage();
    expect(message).toBe(ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE);
  });

  it("should return INVALID_DOC_ID_MESSAGE when error type is INVALID_DOC_ID", () => {
    component.data.error.type = ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID;
    const message = component.getNoDocumentsMessage();
    expect(message).toBe(ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE);
  });

  it("should return INVALID_QUERY_MESSAGE when error type is INVALID_QUERY", () => {
    component.data.error.type = ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_QUERY;
    const message = component.getNoDocumentsMessage();
    expect(message).toBe(ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_QUERY_MESSAGE);
  });

  it("should return NO_DOCUMENT_ID_FOUND_MESSAGE with userInput when error type is NO_DOCUMENT_ID_FOUND", () => {
    const userInput = "12345";
    component.data.error.type = ELASTIC_SEARCH_REINDEX_ERROR_TYPES.NO_DOCUMENT_ID_FOUND;
    component.data.userInput = userInput;
    const message = component.getNoDocumentsMessage();
    const expectedMessage = ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.NO_DOCUMENT_ID_FOUND_MESSAGE.replace(
      "<documentID>",
      userInput
    );
    expect(message).toBe(expectedMessage);
  });

  it("should return NO_MATCHING_QUERY_MESSAGE when error type is NO_MATCHING_QUERY", () => {
    component.data.error.type = ELASTIC_SEARCH_REINDEX_ERROR_TYPES.NO_MATCHING_QUERY;
    const message = component.getNoDocumentsMessage();
    expect(message).toBe(ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.NO_MATCHING_QUERY_MESSAGE);
  });

  it("should return UNKNOWN_ERROR_MESSAGE for any other error type", () => {
    component.data.error.type = "UNKNOWN_ERROR_TYPE";
    const message = component.getNoDocumentsMessage();
    expect(message).toBe(ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.UNKNOWN_ERROR_MESSAGE);
  });

});
