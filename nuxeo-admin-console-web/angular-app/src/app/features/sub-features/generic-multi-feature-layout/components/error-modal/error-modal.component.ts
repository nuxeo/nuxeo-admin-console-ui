import { ERROR_MESSAGES, ERROR_MODAL_LABELS, ERROR_TYPES, GENERIC_LABELS } from '../../generic-multi-feature-layout.constants';

import { ErrorModalData } from "../../../../../shared/types/common.interface";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "error-modal",
  templateUrl: "./error-modal.component.html",
  styleUrls: ["./error-modal.component.scss"],
})
export class ErrorModalComponent {
  ERROR_TYPES = ERROR_TYPES;
  ERROR_MODAL_LABELS = ERROR_MODAL_LABELS;
  GENERIC_LABELS = GENERIC_LABELS;

  constructor(
    private dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModalData
  ) {}

  continue(): void {
    this.dialogRef.close({
      continue: true,
    });
  }

  close(): void {
    this.dialogRef.close({
      continue: false,
    });
  }

  getCustomErrorMessage(): string | null {
    if (this.data?.error) {
      return this.data.error.type === ERROR_TYPES.NO_DOCUMENT_ID_FOUND
        ? this.data.error.details?.message.replace(
            "<documentID>",
            this.data?.userInput as string
          )
        : this.data.error.details?.message;
    }
    return ERROR_MESSAGES.UNKNOWN_ERROR_MESSAGE;
  }
}
