import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import {
  FEATURE_NAMES,
  GENERIC_LABELS,
  TAB_TYPES,
} from "../generic-multi-feature-layout.constants";
import { ActionInfo } from "../generic-multi-feature-layout.interface";

@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureUtilitiesService {
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

  getActionLaunchedConfig(
    state: any,
    featureName: string,
    tabType: string
  ): ActionInfo {
    let actionConfigObj: ActionInfo = {
      commandId: "",
    };
    /* Add required state object as per feature in an else-if block */
    switch (featureName) {
      case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
        if (tabType === TAB_TYPES.DOCUMENT) {
          actionConfigObj = state?.reindex?.reindexInfo;
        } else if (tabType === TAB_TYPES.FOLDER) {
          actionConfigObj = state?.folderReindex?.folderReindexInfo;
        } else if (tabType === TAB_TYPES.NXQL) {
          actionConfigObj = state?.nxqlReindex?.nxqlReindexInfo;
        }
        break;
    }
    return actionConfigObj;
  }

  getActionErrorConfig(
    state: any,
    featureName: string,
    tabType: string
  ): HttpErrorResponse | null {
    let actionErrorObj: HttpErrorResponse | null = null;
    /* Add required state object as per feature in an else-if block */
    switch (featureName) {
      case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
        if (tabType === TAB_TYPES.DOCUMENT) {
          actionErrorObj = state?.reindex?.error;
        } else if (tabType === TAB_TYPES.FOLDER) {
          actionErrorObj = state?.folderReindex?.error;
        } else if (tabType === TAB_TYPES.NXQL) {
          actionErrorObj = state?.nxqlReindex?.error;
        }
        break;
    }
    return actionErrorObj;
  }

  buildQuery(queryParam: string, featureName: string, tabType: string): string {
    let query = "";
    switch (featureName) {
      case FEATURE_NAMES.ELASTIC_SEARCH_REINDEX:
        switch (tabType) {
          case "Document":
            query = `ecm:path='${queryParam}'`;
            break;
          case "Folder":
            query = `ecm:uuid='${queryParam}' OR ecm:ancestorId='${queryParam}''`;
            break;
        }
    }
    return query;
  }

  getRequestQuery(param: string, featureName: string, tabType: string): string {
    return `${GENERIC_LABELS.SELECT_BASE_QUERY} ${this.buildQuery(
      param,
      featureName,
      tabType
    )}`;
  }
}
