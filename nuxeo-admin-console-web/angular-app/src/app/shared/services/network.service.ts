import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";
import { APP_CONSTANTS } from "src/app/app.constants";
import {
  REST_END_POINT_CONFIG,
  REST_END_POINTS,
} from "../constants/rest-end-ponts.constants";
import { Observable } from "rxjs";

type EndpointName = keyof typeof REST_END_POINTS;

@Injectable({
  providedIn: "root",
})
export class NetworkService {
  private http = inject(HttpClient);
  private nuxeoJsClientService = inject(NuxeoJSClientService);

  getAPIEndpoint = (name: EndpointName): string => {
    let endPointName = name;
    if (endPointName === REST_END_POINTS.ELASTIC_SEARCH_REINDEX) {
      if (
        this.nuxeoJsClientService.getPlatformMajorVersion() &&
        this.nuxeoJsClientService.getPlatformMajorVersion() <
          APP_CONSTANTS.PLATFORM_VERSIONS.LTS_2025
      ) {
        endPointName = REST_END_POINTS.ELASTIC_SEARCH_REINDEX_OLD;
      }
    }

    const config = REST_END_POINT_CONFIG[endPointName];

    if (endPointName === REST_END_POINTS.LOGOUT) {
      return `${this.nuxeoJsClientService.getBaseUrl()}${config.endpoint}`;
    }
    return `${this.nuxeoJsClientService.getApiUrl()}${config.endpoint}`;
  };

  makeHttpRequest<T>(
    endpointName: EndpointName,
    data?: Record<string, unknown>
  ): Observable<T> {
    const config = REST_END_POINT_CONFIG[endpointName];
    let url = this.getAPIEndpoint(endpointName);
    const method = config.method || "PUT";
    let params = new HttpParams();

    if (data?.["urlParam"] && Object.keys(data?.["urlParam"]).length > 0) {
      Object.entries(data?.["urlParam"]).forEach(([key, value]) => {
        if (url.indexOf(key) > -1) {
          url = url.replaceAll(`{${key}}`, value);
        }
      });
      delete data["urlParam"];
    }
    if (data?.["queryParam"]) {
      const queryParams = data["queryParam"] as Record<
        string,
        unknown
      >;
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join("&");
      if (queryString) {
        url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
      }
      delete data["queryParam"];
    }


    switch (method) {
      case "POST":
        return this.http.post<T>(url, data?.["bodyParam"] || {}, {
          headers: data?.["requestHeaders"]
            ? new HttpHeaders(data?.["requestHeaders"] as Record<string, never>)
            : {},
        });
      case "PUT":
        return this.http.put<T>(url, data || {}, {
          headers: data?.["requestHeaders"]
            ? new HttpHeaders(data?.["requestHeaders"] as Record<string, never>)
            : {},
        });
      case "DELETE":
        return this.http.delete<T>(url, {
          body: data,
          headers: data?.["requestHeaders"]
            ? new HttpHeaders(data?.["requestHeaders"] as Record<string, never>)
            : {},
        });
      case "GET":
        if (data) {
          Object.keys(data).forEach((key) => {
            params = params.append(key, String(data?.[key]));
          });
        }
        return this.http.get<T>(url, {
          params,
          headers: data?.["requestHeaders"]
            ? new HttpHeaders(data?.["requestHeaders"] as Record<string, never>)
            : {},
        });

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
