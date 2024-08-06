export interface ElasticSearchType {
  label: string;
  path: string;
  isSelected: boolean;
}

export interface ReindexInfo {
  commandId: string | null;
}

export interface ReindexModalClosedInfo {
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

export interface ReindexModalData {
  title: string;
  type: number;
  documentCount: number;
  impactMessage: string;
  timeTakenToReindex: string;
  error: ErrorDetails;
  launchedMessage: string;
  copyActionId: string;
  abortLabel: string;
  commandId: string;
  userInput: string;
}
