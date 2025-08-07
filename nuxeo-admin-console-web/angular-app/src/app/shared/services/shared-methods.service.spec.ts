import { TestBed } from "@angular/core/testing";
import { SharedMethodsService } from "./shared-methods.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorModalComponent } from "../../features/sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import {
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "../../features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ErrorDetails } from "../types/common.interface";
import { MatDialog } from "@angular/material/dialog";

describe("SharedMethodsService", () => {
  let service: SharedMethodsService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  beforeEach(() => {
    mockDialog = jasmine.createSpyObj("MatDialog", ["open", "closeAll"]);
    mockSnackBar = jasmine.createSpyObj("MatSnackBar", ["openFromComponent"]);
    TestBed.configureTestingModule({
      providers: [
        SharedMethodsService,
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });
    service = TestBed.inject(SharedMethodsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("showActionErrorModal", () => {
    let errorDetails: ErrorDetails;
    beforeEach(() => {
      errorDetails = {
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: 500,
          message: "Internal Server Error",
        },
      };
    });

    it("should open ErrorModalComponent with correct error data", () => {
      service.showActionErrorModal(errorDetails);
      expect(mockDialog.open).toHaveBeenCalledWith(
        ErrorModalComponent,
        jasmine.objectContaining({
          data: { error: errorDetails },
          disableClose: true,
          hasBackdrop: true,
          height: MODAL_DIMENSIONS.HEIGHT,
          width: MODAL_DIMENSIONS.WIDTH,
          autoFocus: false,
        })
      );
    });
  });

  describe("showSuccessSnackBar", () => {
    it("should open a success snackbar with custom duration", () => {
      const message = "Success!";
      const duration = 3000;
      service.showSuccessSnackBar(message, duration);
      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message, panelClass: "success-snack" },
          duration: duration,
          panelClass: ["success-snack"],
        })
      );
    });
  });

  describe("showErrorSnackBar", () => {
    it("should open an error snackbar with custom duration", () => {
      const message = "Error occurred!";
      const duration = 3000;
      service.showErrorSnackBar(message, duration);
      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.objectContaining({
          data: { message, panelClass: "error-snack" },
          duration: duration,
          panelClass: ["error-snack"],
        })
      );
    });
  });
});
