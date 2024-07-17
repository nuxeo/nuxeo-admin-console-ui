import { Injectable } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
type URL = string | null;

@Injectable({
  providedIn: "root",
})

export class NuxeoJSClientService {
  nuxeoInstance: Nuxeo = {};
  private _removeSlashFromURL(url:URL):URL{
    return  url?.endsWith('/') ? url?.slice(0,-1) : url;
  }
  initiateJSClient(url: string | null): Nuxeo {
    let configObj: object | null = null;
    if(url) {
      configObj = { baseURL: url };
    }
    this.nuxeoInstance = new Nuxeo(configObj);
  }

  getBaseUrl(): URL {
    const baseURL=  this.nuxeoInstance["_baseURL"];
    return this._removeSlashFromURL(baseURL);
  }

  getApiUrl(): URL {
    const restURL =  this.nuxeoInstance["_restURL"];
    return this._removeSlashFromURL(restURL);
  }

  getNuxeoInstance(): Nuxeo {
    return this.nuxeoInstance;
  }
}