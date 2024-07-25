import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";
import { REST_END_POINT_CONFIG } from "../constants/rest-end-ponts.constants";


@Injectable({
    providedIn: "root",
})
export class NetworkService {
    constructor(private http: HttpClient, private nuxeoJsClientService: NuxeoJSClientService) {}

    getAPIEndpoint = (name: string): string => {
        let url = "";
        if(name && REST_END_POINT_CONFIG[name]) {
            const config = REST_END_POINT_CONFIG[name];
            url = `${this.nuxeoJsClientService.getApiUrl()}${config.endpoint}`
        }
        return url;
    }
}