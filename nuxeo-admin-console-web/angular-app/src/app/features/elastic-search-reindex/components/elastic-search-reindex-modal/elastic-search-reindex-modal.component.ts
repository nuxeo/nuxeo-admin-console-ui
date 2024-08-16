import { AfterViewInit, Component, Inject } from "@angular/core";
import { COMMON_LABELS } from './../../../../shared/constants/common.constants';
import {
  ELASTIC_SEARCH_LABELS,
} from "./../../elastic-search-reindex.constants";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReindexModalData } from "../../elastic-search-reindex.interface";
import { CommonService } from "../../../../shared/services/common.service";
import { Router } from '@angular/router';

@Component({
  selector: "elastic-search-reindex-modal",
  templateUrl: "./elastic-search-reindex-modal.component.html",
  styleUrls: ["./elastic-search-reindex-modal.component.scss"],
})
export class ElasticSearchReindexModalComponent implements AfterViewInit {
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  COMMON_LABELS = COMMON_LABELS;

  constructor(
    private dialogRef: MatDialogRef<ElasticSearchReindexModalComponent>,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: ReindexModalData,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const copyButton = document.querySelector('.button-group button');
      if (copyButton) {
        (copyButton as HTMLElement).focus();
      }
    });
  }

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
      alert(ELASTIC_SEARCH_LABELS.ACTION_ID_COPIED_ALERT);
    });
  }

  seeStatus(): void {
    this.router.navigate(['/bulk-action-monitoring', this.data.commandId])
      .then(() => {
        this.dialogRef.close();
      });
  }
}