import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ERROR_MODAL_LABELS, GENERIC_LABELS } from "../generic-multi-feature-layout.constants";
import { FeaturesKey } from "../generic-multi-feature-layout.mapping";
import { FormGroup } from "@angular/forms";
import { RequestParamType } from "../generic-multi-feature-layout.interface";
import { ActionCreator, Store } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { TypedAction } from "@ngrx/store/src/models";
@Injectable({
  providedIn: "root",
})
export class GenericMultiFeatureUtilitiesService {
  constructor(private store: Store) { }
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
  activeFeature: FeaturesKey = {} as FeaturesKey;
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

  getRequestQuery(requestQuery: string, param: string): string {
    return `${GENERIC_LABELS.SELECT_BASE_QUERY} ${this.insertParamInQuery(
      requestQuery,
      param
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
    // Prepare request payload body
    const requestParams = new URLSearchParams();
    // Prepare body params object with dynamic parameters & their values entered as input
    if (data["bodyParam"]) {
      Object.keys(data["bodyParam"]).forEach((key) => {
        if (key === GENERIC_LABELS.QUERY) {
          requestParams.append(key, requestQuery);
          return;
        }
        const paramValue = inputForm.get(key)?.value;
        if (!paramValue) return;
        requestParams.append(key, paramValue as string);
      });
    }
    if (data["queryParam"]) {
      // since it is queryParam, the query would be appended to the url
      requestUrl = requestQuery;
    }
    return { requestUrl, requestParams };
  }

  checkIfResponseHasError(err: unknown): boolean {
    return (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response: unknown }).response === "object" &&
      (err as { response: { json: unknown } }).response !== null &&
      "json" in (err as { response: { json: unknown } }).response &&
      typeof (err as { response: { json: () => Promise<unknown> } }).response
        .json === "function"
    );
  }
  handleError(err: unknown): Promise<unknown> {
    if (this.checkIfResponseHasError(err)) {
      return (err as { response: { json: () => Promise<unknown> } }).response.json();
    } else {
      return Promise.reject(ERROR_MODAL_LABELS.UNEXPECTED_ERROR);
    }
  }

  handleErrorJson(errorJson: unknown, action: ActionCreator<string, (props: { error: HttpErrorResponse }) => { error: HttpErrorResponse } & TypedAction<string>>): void {
    if (typeof errorJson === "object" && errorJson !== null && typeof action === 'function') {
      this.store.dispatch(
        action({
          error: errorJson as HttpErrorResponse,
        })
      );
    }
  }

}
