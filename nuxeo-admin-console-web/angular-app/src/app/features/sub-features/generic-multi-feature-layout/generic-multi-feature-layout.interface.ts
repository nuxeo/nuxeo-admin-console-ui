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

export const actionsMap: { [key: string]: () => Promise<any> } = {
  elasticSearchReindex: () => import('../../elastic-search-reindex/store/actions'),
  // Add other mappings here
};


export interface TemplateConfigType {
  featureName: string;
  labels: labelsList;
  store: Store<unknown>
}

export interface labelsList {
  pageTitle: string;
  submitBtnLabel: string;
}

export interface FeatureData {
  featureName: string;
  tabType: string;
  labels: {
    pageTitle: string;
    submitBtnLabel: string;
  };
  store: Store<unknown>; 
}

