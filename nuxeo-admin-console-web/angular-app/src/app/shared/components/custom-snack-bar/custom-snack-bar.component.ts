import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { BULK_ACTION_LABELS } from "./../../../features/bulk-action-monitoring/bulk-action-monitoring.constants";
import { Component, Inject } from "@angular/core";
import { SnackBarData } from "../../types/common.interface";

@Component({
  selector: "custom-snack-bar",
  templateUrl: "./custom-snack-bar.component.html",
  styleUrls: ["./custom-snack-bar.component.scss"],
})
export class CustomSnackBarComponent {
  BULK_ACTION_LABELS = BULK_ACTION_LABELS;
  constructor(
    private snackBarRef: MatSnackBarRef<CustomSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData
  ) {}

  close() {
    this.snackBarRef.dismiss();
  }
}
