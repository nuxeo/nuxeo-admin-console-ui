import { Component, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GENERIC_LABELS } from "../../generic-multi-feature-layout.constants";
import { CommonService } from "../../../../../shared/services/common.service";
import { GenericModalData } from "../../generic-multi-feature-layout.interface";
import { CHANGE_CONSUMER_POSITION_LABELS, CONSUMER_THREAD_POOL_LABELS } from "../../../../stream/stream.constants";

@Component({
  selector: "generic-modal",
  templateUrl: "./generic-modal.component.html",
  styleUrls: ["./generic-modal.component.scss"],
  standalone: false
})
export class GenericModalComponent  {
  private dialogRef = inject<MatDialogRef<GenericModalComponent>>(MatDialogRef);
  commonService = inject(CommonService);
  data = inject<GenericModalData>(MAT_DIALOG_DATA);
  GENERIC_LABELS = GENERIC_LABELS;
  CONSUMER_THREAD_POOL_LABELS = CONSUMER_THREAD_POOL_LABELS;
  CHANGE_CONSUMER_POSITION_LABELS = CHANGE_CONSUMER_POSITION_LABELS;
  continue(): void {
    this.dialogRef.close({
      continue: true,
      commandId: this.data?.commandId,
    });
  }

  close(): void {
    this.dialogRef.close({
      continue: false,
    });
  }

  copyActionId(): void {
    navigator.clipboard.writeText(this.data.commandId).then(() => {
      alert(GENERIC_LABELS.ACTION_ID_COPIED_ALERT);
    });
  }

  seeStatus(): void {
    this.commonService.redirectToBulkActionMonitoring(this.data.commandId);
    this.dialogRef.close();
  }

  continueConsumerThreadPoolOperation(){
    this.dialogRef.close({
      continue: true,
    });
  }
}