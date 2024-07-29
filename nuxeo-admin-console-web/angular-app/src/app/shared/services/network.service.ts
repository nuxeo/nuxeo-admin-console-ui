import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";
import { REST_END_POINT_CONFIG, REST_END_POINTS } from "../constants/rest-end-ponts.constants";
import { Observable } from "rxjs";

type EndpointName = keyof typeof REST_END_POINTS;

@Injectable({
  providedIn: "root",
})
export class NetworkService {
  constructor(private http: HttpClient, private nuxeoJsClientService: NuxeoJSClientService) {}

  getAPIEndpoint = (name: EndpointName): string => {
    const config = REST_END_POINT_CONFIG[name];
    return `${this.nuxeoJsClientService.getApiUrl()}${config.endpoint}`;
  }

  makeNetworkRequest<T>(endpointName: EndpointName, data?: Record<string, unknown>): Observable<T> {
    const config = REST_END_POINT_CONFIG[endpointName];
    const url = this.getAPIEndpoint(endpointName);
    const method = config.method || 'PUT';
    let params = new HttpParams();

    switch (method) {
      case 'POST':
        return this.http.post<T>(url, data || {});
      case 'PUT':
        return this.http.put<T>(url, data || {});
      case 'DELETE':
        return this.http.delete<T>(url, { body: data });
      case 'GET':
        if (data) {
          Object.keys(data).forEach(key => {
            params = params.append(key, String(data[key]));
          });
        }
        return this.http.get<T>(url, { params });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
