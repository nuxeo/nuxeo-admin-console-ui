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

describe("ElasticSearchReindexModalComponent", () => {
  let component: ElasticSearchReindexModalComponent;
  let fixture: ComponentFixture<ElasticSearchReindexModalComponent>;
  let dialogRef: MatDialogRef<ElasticSearchReindexModalComponent>;
  class commonServiceStub {
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
    error: { status: "", message: "" },
    launchedMessage: "",
    copyActionId: "Copy ID",
    abortLabel: "Abort",
    continueLabel: "Continue",
    closeLabel: "Close",
    isLaunchedModal: true,
    commandId: "203-11112-38652-990",
    userInput: ""
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
        { provide: CommonService, useClass: commonServiceStub },
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

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should emit continue: true & commandId, when user chooses to continue", () => {
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

  it("should display a javascript alert indicating action id to have been copied, on clipboard copy", async () => {
    const clipboardWriteTextSpy = spyOn(
      navigator.clipboard,
      "writeText"
    ).and.returnValue(Promise.resolve());
    const alertSpy = spyOn(window, "alert");

    await component.copyActionId();

    expect(clipboardWriteTextSpy).toHaveBeenCalledWith(
      mockDialogData.commandId
    );
    expect(alertSpy).toHaveBeenCalledWith("Action ID copied to clipboard!");
  });
});
