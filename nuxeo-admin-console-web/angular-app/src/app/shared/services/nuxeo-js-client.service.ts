import { Injectable } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Injectable({
  providedIn: "root",
})
export class NuxeoJSClientService {
  baseUrl = '';
  apiUrl = '';
  initiateJSClient(): Nuxeo {
    const nuxeoInstance = new Nuxeo();
    this.apiUrl = nuxeoInstance['_restURL'];
    this.baseUrl = nuxeoInstance['_baseURL'];
    return nuxeoInstance;
  }
}
