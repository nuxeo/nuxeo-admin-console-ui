import { NetworkService } from "./../../../../shared/services/network.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ActionInfo } from "../generic-multi-feature-layout.interface";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";

@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureEndpointsService {
  constructor(private networkService: NetworkService) {}
  performDocumentAction(
    requestUrl: string | null,
    requestParams: string | null,
    featureEndpoint: string
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      { queryParam: { requestUrl }, bodyParam: requestParams }
    );
  }

  performFolderAction(
    requestUrl: string | null,
    requestParams: unknown,
    featureEndpoint: string
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      { queryParam: { requestUrl }, bodyParam: requestParams }
    );
  }

  performNXQLAction(
    requestUrl: string | null,
    requestParams: unknown,
    featureEndpoint: string
  ): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS[featureEndpoint as keyof typeof REST_END_POINTS],
      { queryParam: { requestUrl }, bodyParam: requestParams }
    );
  }
}
