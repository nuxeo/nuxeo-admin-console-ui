import { ReindexModalClosedInfo } from "./../../features/elastic-search-reindex/elastic-search-reindex.interface";
import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  reindexDialogClosed = new EventEmitter<ReindexModalClosedInfo>();
}
