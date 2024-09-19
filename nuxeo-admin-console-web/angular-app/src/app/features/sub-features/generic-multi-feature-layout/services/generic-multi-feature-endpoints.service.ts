import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { NetworkService } from "../../../../shared/services/network.service";
import { ActionInfo } from "../generic-multi-feature-layout.interface";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";

@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureEndpointsService {
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private networkService: NetworkService
  ) {}

  performDocumentReindex(requestQuery: string | null): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: requestQuery }
    );
  }

  performFolderReindex(requestQuery: string | null): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: requestQuery }
    );
  }

  performNXQLReindex(nxqlQuery: string | null): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: nxqlQuery }
    );
  }
}