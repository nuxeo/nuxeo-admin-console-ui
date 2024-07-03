import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { versionInfo } from "../../../shared/types/version-info.interface";
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

  getVersionInfo(): Observable<versionInfo> {
    return this.http
      .get<CapabilitiesResponse>(
        `${this.nuxeoJsClientService.getApiUrl()}${this.capabilities}`
      )
      .pipe(
        map((data) => ({
          version: data.server?.distributionVersion ?? null,
          clusterEnabled: data.cluster?.enabled ?? null,
        }))
      );
  }
}
