export interface ErrorModalData {
  error: ErrorDetails;
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

export interface SnackBarData {
  message: string;
  panelClass: string;
}
