import { CapabilitiesResponse } from "./../../../shared/types/capabilities.interface";
import { ProbesResponse } from "./../../../shared/types/probes.interface";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  constructor(
    private http: HttpClient,
    private nuxeoJsClientService: NuxeoJSClientService,
    private networkService: NetworkService
  ) {}

  getVersionInfo(): Observable<CapabilitiesResponse> {
    return this.networkService.makeNetworkRequest<CapabilitiesResponse>(
      REST_END_POINTS.CAPABILITIES
    );
  }

  getProbesInfo(): Observable<ProbesResponse> {
    return this.networkService.makeNetworkRequest<ProbesResponse>(
      REST_END_POINTS.PROBES
    );
  }

  convertToTitleCase(word: string): string {
    return word
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(" ");
  }
}
