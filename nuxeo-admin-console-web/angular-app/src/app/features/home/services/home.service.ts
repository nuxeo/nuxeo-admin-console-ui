import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";
import { CapabilitiesResponse } from "../../../shared/types/capabilities.interface";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private readonly capabilities = "capabilities";

  constructor(
    private http: HttpClient,
    private nuxeoJsClientService: NuxeoJSClientService
  ) {}

  getVersionInfo(): Observable<CapabilitiesResponse> {
    return this.http.get<CapabilitiesResponse>(
      `${this.nuxeoJsClientService.getApiUrl()}/${this.capabilities}`
    );
  }
}
