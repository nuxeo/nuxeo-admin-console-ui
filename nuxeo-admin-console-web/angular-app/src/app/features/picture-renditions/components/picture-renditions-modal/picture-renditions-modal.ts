import { Component, Inject } from "@angular/core";
import { COMMON_LABELS } from '../../../../shared/constants/common.constants';
import { PICTURE_RENDITIONS_LABELS } from "../../picture-renditions.constants";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RenditionsModalData } from "../../picture-renditions.interface";
import { CommonService } from "../../../../shared/services/common.service";


@Component({
  selector: "picture-renditions-modal",
  templateUrl: "./picture-renditions-modal.component.html",
  styleUrls: ["./picture-renditions-modal.component.scss"],
})
export class PictureRenditionsModalComponent  {
  PICTURE_RENDITIONS_LABELS = PICTURE_RENDITIONS_LABELS;
  COMMON_LABELS = COMMON_LABELS;
  constructor(
    private dialogRef: MatDialogRef<PictureRenditionsModalComponent>,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: RenditionsModalData
  ) {}

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
      alert(PICTURE_RENDITIONS_LABELS.ACTION_ID_COPIED_ALERT);
    });
  }

  seeStatus(): void {
    this.commonService.redirectToBulkActionMonitoring(this.data.commandId);
    this.dialogRef.close();
  }
}