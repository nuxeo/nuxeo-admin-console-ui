export interface ErrorModalData {
  error: ErrorDetails;
  userInput?: string;
}

export interface ErrorModalClosedInfo {
  isClosed: boolean;
  continue?: boolean;
  event: unknown;
}

export interface ErrorDetails {
  type: string;
  status?: number;
  message?: string;
  customText?: string;
  subheading?: string;
}
