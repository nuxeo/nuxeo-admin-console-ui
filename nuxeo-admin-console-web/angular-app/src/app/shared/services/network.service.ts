import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";
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
  constructor(
    private http: HttpClient,
    private nuxeoJsClientService: NuxeoJSClientService
  ) {}

  getAPIEndpoint = (name: EndpointName): string => {
    const config = REST_END_POINT_CONFIG[name];
    if (name === REST_END_POINTS.LOGOUT) {
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

    if (data?.["query"]) {
      url += `?query=${data["query"]}`;
      delete data["query"];
    }

    switch (method) {
      case "POST":
        return this.http.post<T>(url, data || {});
        break;
      case "PUT":
        return this.http.put<T>(url, data || {});
        break;
      case "DELETE":
        return this.http.delete<T>(url, { body: data });
        break;
      case "GET":
        if (data) {
          Object.keys(data).forEach((key) => {
            params = params.append(key, String(data[key]));
          });
        }
        return this.http.get<T>(url, { params });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}