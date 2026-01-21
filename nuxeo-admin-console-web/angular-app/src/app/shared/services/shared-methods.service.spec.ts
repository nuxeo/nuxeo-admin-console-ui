import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { TestBed } from "@angular/core/testing";
import { SharedMethodsService } from "./shared-methods.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ERROR_TYPES } from "../../features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ErrorDetails } from "../types/common.interface";
import { MatDialog } from "@angular/material/dialog";
describe("SharedMethodsService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: SharedMethodsService;
  let mockSnackBar: MockedObject<MatSnackBar>;
  let mockDialog: MockedObject<MatDialog>;
  beforeEach(() => {
    mockDialog = {
      open: vi.fn().mockName("MatDialog.open"),
      closeAll: vi.fn().mockName("MatDialog.closeAll"),
    } as any;
    mockSnackBar = {
      openFromComponent: vi.fn().mockName("MatSnackBar.openFromComponent"),
    } as any;
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
    it("should set errorDialogRef when showActionErrorModal is called", () => {
      const errorDetails: ErrorDetails = {
        type: ERROR_TYPES.SERVER_ERROR,
        details: {
          status: 500,
          message: "Internal Server Error",
        },
      };
      const dialogRefMock = { afterClosed: () => ({}) } as any;
      mockDialog.open.mockReturnValue(dialogRefMock);
      service.showActionErrorModal(errorDetails);
      expect(service.errorDialogRef).toBe(dialogRefMock);
    });
  });

  describe("showSuccessSnackBar", () => {
    it("should open a success snackbar with custom duration", () => {
      const message = "Success!";
      const duration = 5000;
      service.showSuccessSnackBar(message);
      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: { message, panelClass: "success-snack" },
          duration: duration,
          panelClass: ["success-snack"],
        })
      );
    });

    it("should open a success snackbar with custom duration", () => {
      const message = "Success!";
      const duration = 2000;
      service.showSuccessSnackBar(message, duration);
      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
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
      const duration = 5000;
      service.showErrorSnackBar(message);
      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: { message, panelClass: "error-snack" },
          duration: duration,
          panelClass: ["error-snack"],
        })
      );
    });

    it("should open an error snackbar with custom duration", () => {
      const message = "Error occurred!";
      const duration = 3000;
      service.showErrorSnackBar(message, duration);
      expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: { message, panelClass: "error-snack" },
          duration: duration,
          panelClass: ["error-snack"],
        })
      );
    });
  });
});
