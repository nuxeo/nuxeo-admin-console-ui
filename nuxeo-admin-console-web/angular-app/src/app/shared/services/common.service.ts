import { EventEmitter, Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { COMMON_LABELS } from "../constants/common.constants";
import { ReindexModalClosedInfo } from "./../../features/elastic-search-reindex/elastic-search-reindex.interface";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  reindexDialogClosed = new EventEmitter<ReindexModalClosedInfo>();
  COMMON_LABELS = COMMON_LABELS;
  constructor(private router: Router) {} 

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

  redirectToBulkActionMonitoring(commandId: string): void {
    this.router.navigate(["/bulk-action-monitoring", commandId]);
  }

  redirectToProbesDetails(): void {
    this.router.navigate(["/probes"]);
  }
}
