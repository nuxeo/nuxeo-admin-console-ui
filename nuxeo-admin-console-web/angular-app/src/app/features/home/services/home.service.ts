import { CapabilitiesResponse } from "./../../../shared/types/capabilities.interface";
import { ProbesResponse } from "./../../../shared/types/probes.interface";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private readonly capabilities = "capabilities";
  private readonly probes = "management/probes";

  constructor(
    private http: HttpClient,
    private nuxeoJsClientService: NuxeoJSClientService
  ) {}

  getVersionInfo(): Observable<CapabilitiesResponse> {
    return this.http.get<CapabilitiesResponse>(
      `${this.nuxeoJsClientService.getApiUrl()}/${this.capabilities}`
    );
  }

  getProbesInfo(): Observable<ProbesResponse> {
    return this.http.get<ProbesResponse>(
      `${this.nuxeoJsClientService.getApiUrl()}/${this.probes}`
    );
  }

  convertoTitleCase(word: string) {
    return word
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(" ");
  }
}
