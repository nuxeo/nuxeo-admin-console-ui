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
  isConfirmModal: boolean;
  documentCount: number;
  impactMessage: string;
  timeTakenToReindex: string;
  confirmContinue: string;
  isErrorModal: boolean;
  errorMessageHeader: string;
  error: ErrorDetails;
  launchedMessage: string;
  copyActionId: string;
  abortLabel: string;
  continueLabel: string;
  closeLabel: string;
  isLaunchedModal: boolean;
  commandId: string;
  userInput: string;
}
