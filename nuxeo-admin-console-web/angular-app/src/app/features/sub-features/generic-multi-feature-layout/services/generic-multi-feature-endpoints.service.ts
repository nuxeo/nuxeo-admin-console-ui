import { NetworkService } from "./../../../../shared/services/network.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ActionInfo,
} from "../generic-multi-feature-layout.interface";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";

@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureEndpointsService {
  constructor(private networkService: NetworkService) {}
  performDocumentAction(
    requestUrl: string | null,
    requestParams: unknown,
    featureEndpoint: string,
    requestHeaders: { [key: string]: string }
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      /*
        No params for queryParam since, the only param, i.e. 'query' is appended to the url
       & no request url for bodyParam, since endpoint is already sent as the 1st parameter here, and query is part of body params
      */
      { queryParam: { query: requestUrl }, bodyParam: requestParams, requestHeaders }
    );
  }

  performFolderAction(
    requestUrl: string | null,
    requestParams: unknown,
    featureEndpoint: string,
    requestHeaders: { [key: string]: string }
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      /*
        No params for queryParam since, the only param, i.e. 'query' is appended to the url
       & no request url for bodyParam, since endpoint is already sent as the 1st parameter here, and query is part of body params
      */
      { queryParam: { query: requestUrl }, bodyParam: requestParams, requestHeaders }
    );
  }

  performNXQLAction(
    requestUrl: string | null,
    requestParams: unknown,
    featureEndpoint: string,
    requestHeaders: { [key: string]: string }
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      { queryParam: { query: requestUrl }, bodyParam: requestParams, requestHeaders }
    );
  }
}
