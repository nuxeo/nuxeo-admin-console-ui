import { NuxeoJSClientService } from './../../../shared/services/nuxeo-js-client.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ReindexInfo } from "../elastic-search-reindex.interface";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  private elaticSearchReindexEndpoint = "management/elasticsearch/reindex";
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  constructor(private http: HttpClient, private nuxeoJsClientService: NuxeoJSClientService) {}

  performDocumentReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.nuxeoJsClientService.getApiUrl()}${this.elaticSearchReindexEndpoint}?query=${requestQuery}`,
      {}
    );
  }

  performFolderReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.nuxeoJsClientService.getApiUrl()}${this.elaticSearchReindexEndpoint}?query=${requestQuery}`,
      {}
    );
  }
}
