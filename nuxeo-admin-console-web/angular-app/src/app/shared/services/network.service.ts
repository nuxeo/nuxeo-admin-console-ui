import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";
import { REST_END_POINT_CONFIG } from "../constants/rest-end-ponts.constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NetworkService {
  constructor(private http: HttpClient, private nuxeoJsClientService: NuxeoJSClientService) {}

  getAPIEndpoint = (name: string): string => {
    let url = "";
    if (name && REST_END_POINT_CONFIG[name]) {
      const config = REST_END_POINT_CONFIG[name];
      url = `${this.nuxeoJsClientService.getApiUrl()}${config.endpoint}`;
    }
    return url;
  }

  makeNetworkRequest<T>(endpointName: string, data?: any): Observable<T> {
    const config = REST_END_POINT_CONFIG[endpointName];
    const url = this.getAPIEndpoint(endpointName);

    if (config.method === "POST") {
      return this.http.post<T>(url, data || {});
    } else {
      return this.http.get<T>(url, { params: data });
    }
  }
}
