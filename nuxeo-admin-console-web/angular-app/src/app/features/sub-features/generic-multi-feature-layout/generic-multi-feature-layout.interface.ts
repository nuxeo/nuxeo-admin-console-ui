import { Store } from '@ngrx/store';

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

export interface ErrorStatus {
  status?: number;
  message: string;
}

export interface ErrorDetails {
  type: string;
  details: ErrorStatus;
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
}

export interface FeatureData {
  // featureName: string;
  // tabType: string;
  requestQuery?: string;
  labels: labelsList;
  // store: Store<unknown>; 
  // primaryAction: string;
  // resetStateAction: string;
  // taskFailureAction: string;
  // stateSelector?: string;
  // stateType?: unknown;
}

