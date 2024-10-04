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

    // iterate & add
    if (data?.["queryParam"]) {
      const queryParam = data["queryParam"] as { query: string };
      url += `?query=${queryParam["query"]}`;
      delete data["query"];
    }

    /* if (data?.["bodyParam"]) {
      const renamedObj = Object.fromEntries(
        Object.entries(data).map(([key, value]) => 
          [`query`, value]
        )
      )
      data = renamedObj;
    } */
    let bodyParam = {} as { query: string };
    if (data?.["bodyParam"]) {
      bodyParam = data["bodyParam"] as { query: string };
    }

    if (
      data?.["bodyParam"] &&
      typeof data["bodyParam"] === "object" && // Ensure it's an object
      "query" in data["bodyParam"] && // Check if "query" exists
      typeof (data["bodyParam"] as Record<string, any>)["query"] === "object" && // Check if 'query' is an object
      Object.keys((data["bodyParam"] as Record<string, any>)["query"]).length >
        0
    ) {
      // 'query' is an object and it is not empty
      bodyParam = data["bodyParam"] as { query: string };
    }

    switch (method) {
      case "POST":
        return this.http.post<T>(url, bodyParam["query"] || {});
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
            params = params.append(key, String(data?.[key]));
          });
        }
        return this.http.get<T>(url, { params });
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
