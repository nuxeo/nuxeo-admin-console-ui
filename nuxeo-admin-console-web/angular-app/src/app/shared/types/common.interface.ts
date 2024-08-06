export interface ErrorModalData {
  title: string;
  errorMessageHeader: string;
  error: ErrorDetails;
  closeLabel: string;
  userInput?: string;
}

export interface ErrorDetails {
  type: string;
  details: ErrorStatus;
}

export interface ErrorStatus {
  status?: number;
  message: string;
}

export interface ErrorModalClosedInfo {
  isClosed: boolean;
  continue?: boolean;
  event: unknown;
}