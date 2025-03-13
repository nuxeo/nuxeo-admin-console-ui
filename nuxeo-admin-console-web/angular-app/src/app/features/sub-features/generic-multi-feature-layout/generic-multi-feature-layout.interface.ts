import { ErrorDetails } from "../../../shared/types/errors.interface";

export interface TabInfo {
  label: string;
  path: string;
  isSelected: boolean;
}

export interface ActionInfo {
  commandId: string | null;
}

export interface GenericModalClosedInfo {
  isClosed: boolean;
  continue?: boolean;
  event: unknown;
}


export interface GenericModalData {
  title: string;
  type: number;
  documentCount: number;
  timeTakenForAction: string;
  error: ErrorDetails;
  launchedMessage: string;
  commandId: string;
  userInput: string;
}

export interface labelsList {
  pageTitle: string;
  submitBtnLabel: string;
  nxqlQueryPlaceholder?: string;
}

export interface FeatureData {
  requestParams: string;
  labels: labelsList;
  data: RequestParamType;
}

export interface RequestParamType {
  queryParam?: { [key: string]: unknown };
  bodyParam?: { [key: string]: unknown };
  urlParam?: { [key: string]: unknown };
  requestHeaders?: { [key: string]: string };
}
