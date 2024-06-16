import { EventEmitter, Injectable } from "@angular/core";
import { reindexModalClosedInfo } from "src/app/features/elastic-search-reindex/elastic-search-reindex.interface";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  reindexDialogClosed = new EventEmitter<reindexModalClosedInfo>();
}
