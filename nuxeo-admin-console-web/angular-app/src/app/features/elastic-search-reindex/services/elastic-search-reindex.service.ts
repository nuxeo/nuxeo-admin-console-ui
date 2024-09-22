import { DocumentReindexState } from "./../store/reducers";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ReindexInfo } from "../elastic-search-reindex.interface";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";
import { Store } from "@ngrx/store";
import { ELASTIC_SEARCH_LABELS } from "../elastic-search-reindex.constants";
import {
  FEATURE_NAMES,
  GENERIC_LABELS,
} from "../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private networkService: NetworkService,
    private documentStore: Store<{ reindex: DocumentReindexState }>
  ) {}

  performDocumentReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.networkService.makeHttpRequest<ReindexInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: requestQuery }
    );
  }

  performFolderReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.networkService.makeHttpRequest<ReindexInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: requestQuery }
    );
  }

  performNXQLReindex(nxqlQuery: string | null): Observable<ReindexInfo> {
    return this.networkService.makeHttpRequest<ReindexInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: nxqlQuery }
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

  getDocumentTabData(): Observable<any> {
    const data = {
      featureName: FEATURE_NAMES.ELASTIC_SEARCH_REINDEX,
      labels: {
        pageTitle: ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE,
        submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
      },
      store: this.documentStore,
    };
    return of(data);
  }
}
