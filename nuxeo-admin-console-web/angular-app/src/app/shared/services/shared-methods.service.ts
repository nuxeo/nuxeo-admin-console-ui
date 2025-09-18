import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackBarComponent } from "../components/custom-snack-bar/custom-snack-bar.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ErrorModalComponent } from "../../features/sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { MODAL_DIMENSIONS } from "../../features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ErrorModalClosedInfo, ErrorDetails } from "../types/common.interface";

/** This service handles common methods such as snack bars and dialogs.
 * It helps avoid code duplication. */

@Injectable({
  providedIn: "root",
})
export class SharedMethodsService {
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;

  constructor(private snackBar: MatSnackBar, public dialogService: MatDialog) {}

  showSuccessSnackBar(message: string, duration: number = 5000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        panelClass: "success-snack",
      },
      duration: duration,
      panelClass: ["success-snack"],
    });
  }

  showErrorSnackBar(message: string, duration: number = 5000) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        panelClass: "error-snack",
      },
      duration: duration,
      panelClass: ["error-snack"],
    });
  }

  showActionErrorModal(error: ErrorDetails) {
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      autoFocus: false,
      data: {
        error: error,
      },
    });
     return this.errorDialogRef.afterClosed();
  }
}
