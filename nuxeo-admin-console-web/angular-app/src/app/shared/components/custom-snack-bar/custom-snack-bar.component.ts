import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from "@angular/material/snack-bar";
import { BULK_ACTION_LABELS } from "./../../../features/bulk-action-monitoring/bulk-action-monitoring.constants";
import { Component, inject } from "@angular/core";
import { SnackBarData } from "../../types/common.interface";

@Component({
  selector: "custom-snack-bar",
  templateUrl: "./custom-snack-bar.component.html",
  styleUrls: ["./custom-snack-bar.component.scss"],
  standalone: false
})
export class CustomSnackBarComponent {
  private snackBarRef = inject<MatSnackBarRef<CustomSnackBarComponent>>(MatSnackBarRef);
  data = inject<SnackBarData>(MAT_SNACK_BAR_DATA);
  BULK_ACTION_LABELS = BULK_ACTION_LABELS;

  close() {
    this.snackBarRef.dismiss();
  }
}
