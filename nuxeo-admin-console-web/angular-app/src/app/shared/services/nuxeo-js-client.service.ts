import { Injectable } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Injectable({
  providedIn: "root",
})
export class NuxeoJSClientService {
  nuxeoInstance: Nuxeo = {};
  initiateJSClient(url: string | null): Nuxeo {
    let configObj = null;
    if(url) {
      configObj = { baseURL: url };
    }
    this.nuxeoInstance = new Nuxeo(configObj);
  }

  getBaseUrl(): string {
    return this.nuxeoInstance["_baseURL"];
  }

  getApiUrl(): string {
    return this.nuxeoInstance["_restURL"];
  }

  getNuxeoInstance(): Nuxeo {
    return this.nuxeoInstance;
  }
}