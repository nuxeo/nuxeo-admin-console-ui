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

  makeNetworkRequest<T>(endpointName: EndpointName, data?: Record<string, unknown>, method?: 'POST' | 'GET' | 'PUT'): Observable<T> {
    const config = REST_END_POINT_CONFIG[endpointName];
    const url = this.getAPIEndpoint(endpointName);
    let params = new HttpParams();

    if (method === 'POST') {
      return this.http.post<T>(url, data || {});
    } 
    
    if (method === 'PUT') {
      return this.http.put<T>(url, data || {});
    }
    
    if (method === 'GET' || config.method === 'GET') {
      if (data) {
        Object.keys(data).forEach(key => {
          params = params.append(key, String(data[key]));
        });
      }
      return this.http.get<T>(url, { params });
    }

    throw new Error(`Unsupported HTTP method: ${method}`);
  }
}
