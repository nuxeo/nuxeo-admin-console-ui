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
    type: 1,
    documentCount: 5,
    timeTakenToReindex: "10 minutes",
    error: { type: "", details: { status: 0, message: "" } },
    launchedMessage: "",
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
});
