import { NetworkService } from "./../../../../shared/services/network.service";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
  ActionInfo,
} from "../generic-multi-feature-layout.interface";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";

@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureEndpointsService {
  private networkService = inject(NetworkService);

  performDocumentAction(
    requestUrl: string | null,
    requestParams: unknown,
    featureEndpoint: string,
    requestHeaders: { [key: string]: string }
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      /*
        Only include query param when requestUrl is not null
       & no request url for bodyParam, since endpoint is already sent as the 1st parameter here, and query is part of body params
      */
      { 
        queryParam: requestUrl ? { query: requestUrl } : {}, 
        bodyParam: requestParams, 
        requestHeaders 
      }
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
        Only include query param when requestUrl is not null
       & no request url for bodyParam, since endpoint is already sent as the 1st parameter here, and query is part of body params
      */
      { 
        queryParam: requestUrl ? { query: requestUrl } : {}, 
        bodyParam: requestParams, 
        requestHeaders 
      }
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
      { 
        queryParam: requestUrl ? { query: requestUrl } : {}, 
        bodyParam: requestParams, 
        requestHeaders 
      }
    );
  }
}
