import { Injectable } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Injectable({
  providedIn: "root",
})
export class NuxeoJSClientService {
  nuxeoInstance: Nuxeo = {};
  initiateJSClient(): Nuxeo {
    this.nuxeoInstance = new Nuxeo();
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
