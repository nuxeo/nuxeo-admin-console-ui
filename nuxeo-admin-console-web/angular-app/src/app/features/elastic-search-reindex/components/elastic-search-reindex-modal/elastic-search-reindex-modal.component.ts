import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES,
  ELASTIC_SEARCH_REINDEX_ERROR_TYPES,
} from "./../../elastic-search-reindex.constants";
import { CommonService } from "../../../../shared/services/common.service";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReindexModalData } from "../../elastic-search-reindex.interface";

@Component({
  selector: "elastic-search-reindex-modal",
  templateUrl: "./elastic-search-reindex-modal.component.html",
  styleUrls: ["./elastic-search-reindex-modal.component.scss"],
})
export class ElasticSearchReindexModalComponent {
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  ELASTIC_SEARCH_REINDEX_ERROR_TYPES = ELASTIC_SEARCH_REINDEX_ERROR_TYPES;
  constructor(
    private dialogRef: MatDialogRef<ElasticSearchReindexModalComponent>,
    public commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: ReindexModalData
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
      alert(ELASTIC_SEARCH_LABELS.ACTION_ID_COPIED_ALERT);
    });
  }

  getNoDocumentsMessage(): string | null {
    switch (this.data.error.type) {
      case ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID_OR_PATH:
        return ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_DOC_ID_OR_PATH_MESSAGE;
      case ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_DOC_ID:
        return ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE;
      case ELASTIC_SEARCH_REINDEX_ERROR_TYPES.INVALID_QUERY:
        return ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.INVALID_QUERY_MESSAGE;
      case ELASTIC_SEARCH_REINDEX_ERROR_TYPES.NO_DOCUMENT_ID_FOUND:
        return ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.NO_DOCUMENT_ID_FOUND_MESSAGE.replace(
          "<documentID>",
          this.data?.userInput
        );
      case ELASTIC_SEARCH_REINDEX_ERROR_TYPES.NO_MATCHING_QUERY:
        return ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.NO_MATCHING_QUERY_MESSAGE;
      default:
        return ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES.UNKNOWN_ERROR_MESSAGE;
    }
  }
}
