import { ReindexModalClosedInfo } from "./../../features/elastic-search-reindex/elastic-search-reindex.interface";
import { EventEmitter, Injectable } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  reindexDialogClosed = new EventEmitter<ReindexModalClosedInfo>();
  initiateJSClient(): Nuxeo {
    return new Nuxeo();
  }
}
