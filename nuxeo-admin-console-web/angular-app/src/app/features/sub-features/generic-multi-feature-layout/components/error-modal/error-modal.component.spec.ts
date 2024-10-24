import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { HyDialogBoxModule } from "@hyland/ui";
import { MatDialogRef } from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { ErrorDetails } from '../../generic-multi-feature-layout.interface';
import { ERROR_MESSAGES, ERROR_TYPES } from '../../generic-multi-feature-layout.constants';
import { ErrorModalData } from '../../../../../shared/types/common.interface';
describe("ErrorModalComponent", () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ErrorModalComponent>>;
  const exampleErrorDetails: ErrorDetails = {
    type: ERROR_TYPES.NO_DOCUMENT_ID_FOUND,
    details: {
      status: 404,
      message: "No document found with ID <documentID>",
    },
  };
  const errorData: ErrorModalData = {
    error: exampleErrorDetails,
    userInput: "12345",
  };
  const invalidIdPathErrorData: ErrorModalData = {
    error: {
      type: ERROR_TYPES.INVALID_DOC_ID_OR_PATH,
      details: {
        status: 500,
        message: ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE,
      },
    },
  };
  const defaultErrorData: ErrorModalData = {
    error: {
      type: "unknown error",
      details: {
        message: ERROR_MESSAGES.UNKNOWN_ERROR_MESSAGE,
      },
    },
  };

  beforeEach(() => {
    const dialogRefSpy = jasmine.createSpyObj("MatDialogRef", ["close"]);
    TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      imports: [CommonModule, HyDialogBoxModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ErrorModalComponent>
    >;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("continue", () => {
    it("should close the dialog with continue: true", () => {
      component.continue();
      expect(dialogRef.close).toHaveBeenCalledWith({ continue: true });
    });
  });

  describe("close", () => {
    it("should close the dialog with continue: false", () => {
      component.close();
      expect(dialogRef.close).toHaveBeenCalledWith({ continue: false });
    });
  });

  describe("getCustomErrorMessage", () => {
    it("should return formatted error message with user input if type is NO_DOCUMENT_ID_FOUND", () => {
      component.data = errorData;
      expect(component.getCustomErrorMessage()).toBe(
        "No document found with ID 12345"
      );
    });

    it("should return error message if error type is invalidDocIdOrPathError", () => {
      component.data = invalidIdPathErrorData;
      expect(component.getCustomErrorMessage()).toBe(
        ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE
      );
    });

    it("should return default error message if no error data", () => {
      component.data = defaultErrorData;
      expect(component.getCustomErrorMessage()).toBe(
        ERROR_MESSAGES.UNKNOWN_ERROR_MESSAGE
      );
    });
  });
});