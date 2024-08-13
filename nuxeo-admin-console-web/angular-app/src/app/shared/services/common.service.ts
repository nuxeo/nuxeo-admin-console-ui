import { COMMON_LABELS } from "../constants/common.constants";
import { ReindexModalClosedInfo } from "./../../features/elastic-search-reindex/elastic-search-reindex.interface";
import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  reindexDialogClosed = new EventEmitter<ReindexModalClosedInfo>();
  COMMON_LABELS = COMMON_LABELS;

  removeLeadingCharacters(input: string): string {
    if (input.startsWith("'") && input.endsWith("'")) {
      return input.slice(1, -1);
    }
    if (input.startsWith('"') && input.endsWith('"')) {
      return input.slice(1, -1);
    }
    if (input.startsWith("'") || input.startsWith('"')) {
      return input.slice(1);
    }
    return input;
  }

  // tslint:disable-next-line:no-useless-escape
  decodeAndReplaceSingleQuotes(input: string): string {
    /* replace & decode all occurences of single & double quotes */
    return input.replaceAll("'", "%5C%27");
  }

  getPluralizedText(itemCount: number, inputStr: string): string {
    if (itemCount !== 1) {
      return inputStr.indexOf(COMMON_LABELS.DOCUMENT_TEXT) > -1
        ? inputStr.replaceAll(
            COMMON_LABELS.DOCUMENT_TEXT,
            COMMON_LABELS.DOCUMENT_TEXT + "s"
          )
        : inputStr.replaceAll(
            COMMON_LABELS.ERROR_TEXT,
            COMMON_LABELS.ERROR_TEXT + "s"
          );
    }
    return inputStr;
  }
}
