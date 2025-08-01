import { GenericModalComponent } from './generic-modal.component';
import { GENERIC_LABELS } from './../../generic-multi-feature-layout.constants';
import { GenericModalData } from './../../generic-multi-feature-layout.interface';
import { CommonService } from './../../../../../shared/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { EventEmitter } from "@angular/core";
import { Router } from "@angular/router"; 

describe("GenericModalComponent", () => {
  let component: GenericModalComponent;
  let fixture: ComponentFixture<GenericModalComponent>;
  let dialogRef: MatDialogRef<GenericModalComponent>;
  let router: jasmine.SpyObj<Router>; 
  let commonService: jasmine.SpyObj<CommonService>;

  class CommonServiceStub {
    loadApp = new EventEmitter<boolean>();
    redirectToBulkActionMonitoring() {
      return "";
    }
  }

  const mockDialogData: GenericModalData = {
    title: "Test Title",
    type: 1,
    documentCount: 5,
    timeTakenForAction: "10 minutes",
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

    router = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [GenericModalComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: CommonService, useClass: CommonServiceStub },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericModalComponent);
    dialogRef = TestBed.inject(
      MatDialogRef
    ) as MatDialogRef<GenericModalComponent>;
    component = fixture.componentInstance;
    commonService = TestBed.inject(
      CommonService
    ) as jasmine.SpyObj<CommonService>;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
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
      GENERIC_LABELS.ACTION_ID_COPIED_ALERT
    );
  });

  it("should navigate to the bulk action monitoring page with URL parameter and close the dialog when 'See Status' is clicked", async () => {
    const closeDialogSpy = dialogRef.close as jasmine.Spy;
    spyOn(commonService, "redirectToBulkActionMonitoring");
    await component.seeStatus();
    expect(commonService.redirectToBulkActionMonitoring).toHaveBeenCalledWith(
      component.data.commandId
    );
    expect(closeDialogSpy).toHaveBeenCalled(); 
  });

  it("should emit continue: true & commandId when user chooses to continue", () => {
    component.continueConsumerThreadPoolOperation();
    expect(dialogRef.close).toHaveBeenCalledWith({
      continue: true,
    });
  });
});