import { reindexModalClosedInfo } from "./../../features/elastic-search-reindex/elastic-search-reindex.interface";
import { EventEmitter, Injectable } from "@angular/core";
// @ts-ignore
import Nuxeo from "nuxeo";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  reindexDialogClosed = new EventEmitter<reindexModalClosedInfo>();
  initiateJSClient(): Nuxeo {
    return new Nuxeo();
  }
}
