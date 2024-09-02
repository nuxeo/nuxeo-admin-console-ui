import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ReindexInfo } from "../elastic-search-reindex.interface";
import { NuxeoJSClientService } from "../../../shared/services/nuxeo-js-client.service";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  private elaticSearchReindexEndpoint = "management/elasticsearch/reindex";
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private nuxeoJsClientService: NuxeoJSClientService
  ) {}

  performDocumentReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.nuxeoJsClientService.getApiUrl()}/${
        this.elaticSearchReindexEndpoint
      }?query=${requestQuery}`,
      {}
    );
  }

  performFolderReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.nuxeoJsClientService.getApiUrl()}/${
        this.elaticSearchReindexEndpoint
      }?query=${requestQuery}`,
      {}
    );
  }

  performNXQLReindex(nxqlQuery: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.nuxeoJsClientService.getApiUrl()}/${
        this.elaticSearchReindexEndpoint
      }?query=${nxqlQuery}`,
      {}
    );
  }

  secondsToHumanReadable(seconds: number): string {
    const SECONDS_IN_MINUTE = 60;
    const SECONDS_IN_HOUR = 3600;
    const SECONDS_IN_DAY = 86400;
    const SECONDS_IN_MONTH = 2592000;

    const months = Math.floor(seconds / SECONDS_IN_MONTH);
    seconds %= SECONDS_IN_MONTH;
    const days = Math.floor(seconds / SECONDS_IN_DAY);
    seconds %= SECONDS_IN_DAY;
    const hours = Math.floor(seconds / SECONDS_IN_HOUR);
    seconds %= SECONDS_IN_HOUR;
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    const remainingSeconds = seconds % SECONDS_IN_MINUTE;

    let humanReadableTime = "";

    if (months > 0) {
      humanReadableTime += `${months} month${months > 1 ? "s" : ""} `;
    }
    if (days > 0) {
      humanReadableTime += `${days} day${days > 1 ? "s" : ""} `;
    }
    if (hours > 0) {
      humanReadableTime += `${hours} hour${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      humanReadableTime += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    }
    if (remainingSeconds > 0) {
      humanReadableTime += `${remainingSeconds} second${
        remainingSeconds === 1 ? "" : "s"
      }`;
    }

    return humanReadableTime.trim();
  }

  removeLeadingCharacters(input: string): string {
    if (input.startsWith("'") && input.endsWith("'")) {
      return input.slice(1, -1);
    }
    if (input.startsWith('"') && input.endsWith('"')) {
      return input.slice(1, -1);
    }
    if (input.startsWith("'") || input.startsWith('"')) {
      return input.slice(1);
    }
    return input;
  }

  // tslint:disable-next-line:no-useless-escape
  decodeAndReplaceSingleQuotes(input: string): string {
    /* replace & decode all occurences of single & double quotes */
      return input.replaceAll("'", "%5C%27");
  }
}
