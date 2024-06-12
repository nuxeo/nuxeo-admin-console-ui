import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "reindex-confirmation-modal",
  templateUrl: "./reindex-confirmation-modal.component.html",
  styleUrls: ["./reindex-confirmation-modal.component.scss"],
})
export class ReindexConfirmationModalComponent {

  constructor(
    private dialogRef: MatDialogRef<ReindexConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  copyActionId() {
    navigator.clipboard.writeText(this.data.actionId).then(() => {
      alert('Action ID copied to clipboard!');
    });
  }
}
