import { VIDEO_RENDITIONS_LABELS } from "./../../../video-renditions-generation/video-renditions-generation.constants";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { GENERIC_LABELS } from "../generic-multi-feature-layout.constants";
import { FeaturesKey } from "../generic-multi-feature-layout.mapping";
import { FormGroup } from "@angular/forms";
import { RequestParamType } from "../generic-multi-feature-layout.interface";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureUtilitiesService {
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  activeFeature: FeaturesKey = {} as FeaturesKey;
  nuxeo: Nuxeo;
  setActiveFeature(activeFeature: FeaturesKey): void {
    this.activeFeature = activeFeature;
  }
  getActiveFeature(): FeaturesKey {
    return this.activeFeature;
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

  getRequestQuery(requestQuery: string, params: string): string {
    return `${GENERIC_LABELS.SELECT_BASE_QUERY} ${this.insertParamInQuery(
      requestQuery,
      params
    )}`;
  }

  insertParamInQuery(requestQuery: string, param: string) {
    return requestQuery.replaceAll("{query}", param);
  }

  buildRequestParams(
    data: RequestParamType,
    requestQuery: string,
    inputForm: FormGroup
  ): { requestUrl: string; requestParams: URLSearchParams } {
    let requestUrl = ""; 
    let requestParams = new URLSearchParams(); 
    if (data["bodyParam"]) {
      Object.keys(data["bodyParam"]).forEach((key) => {
        const paramValue = inputForm.get(key)?.value; 

        if (key === GENERIC_LABELS.QUERY && requestQuery) {
          requestParams.append(key, requestQuery);
        }
        else if (key === VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY) {
        
          this.appendConversionsToRequest(requestParams, paramValue, key);
        }
        else if (paramValue) {
          requestParams.append(key, paramValue as string); 
        }
      });
    }
    if (data["queryParam"]) {
      // since it is queryParam, the query would be appended to the url
      requestUrl = requestQuery;
    }
    // Return the constructed request URL and URLSearchParams
    return { requestUrl, requestParams };
  }

  appendConversionsToRequest(
    requestParams: URLSearchParams,
    userInput: string,
    key: string
  ): any {
    try {
      if (userInput.indexOf(",") > -1) {
        userInput.split(",").forEach((name) => {
          requestParams.append(key, name);
        });
      } else {
        requestParams.append(key, userInput);
      }
      return requestParams;
    } catch (error) {
      console.log(error);
      // return requestParams
      // TODO: Show error modal
    }
  }
}
