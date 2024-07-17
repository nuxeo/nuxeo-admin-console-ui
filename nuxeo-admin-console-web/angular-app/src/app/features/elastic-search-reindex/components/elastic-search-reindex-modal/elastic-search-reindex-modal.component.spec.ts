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
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex.constants";

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
    error: { message: "", status: "400" },
    launchedMessage: "",
    copyActionId: "Copy ID",
    abortLabel: "Abort",
    continueLabel: "Continue",
    closeLabel: "Close",
    isLaunchedModal: true,
    commandId: "203-11112-38652-990",
    userInput: "",
    noMatchingQuery: false,
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

  it("should return NO_MATCHING_QUERY message when noMatchingQuery is true", () => {
    component.data.noMatchingQuery = true;
    const message = component.getNoDocumentsMessage();
    expect(message).toEqual(ELASTIC_SEARCH_LABELS.NO_MATCHING_QUERY);
  });

  it("should return NO_DOCUMENTS message with userInput when noMatchingQuery is false", () => {
    const userInput = "12345";
    component.data.noMatchingQuery = false;
    component.data.userInput = userInput;
    const message = component.getNoDocumentsMessage();
    const expectedMessage = ELASTIC_SEARCH_LABELS.NO_DOCUMENTS.replace(
      "<documentID>",
      userInput
    );
    expect(message).toEqual(expectedMessage);
  });

  it("should return NO_DOCUMENTS message with empty userInput when noMatchingQuery is false and userInput is not provided", () => {
    component.data.noMatchingQuery = false;
    component.data.userInput = "";
    const message = component.getNoDocumentsMessage();
    const expectedMessage = ELASTIC_SEARCH_LABELS.NO_DOCUMENTS.replace(
      "<documentID>",
      ""
    );
    expect(message).toEqual(expectedMessage);
  });
});
