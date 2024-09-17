export interface PictureSearchType {
    label: string;
    path: string;
    isSelected: boolean;
  }

  export interface RenditionsModalClosedInfo {
    isClosed: boolean;
    continue?: boolean;
    event: unknown;
  }

  export interface RenditionsInfo {
    commandId: string | null;
  }

  export interface ErrorStatus {
    status?: number;
    message: string;
  }

  export interface ErrorDetails {
    type: string;
    details: ErrorStatus;
  }

  export interface PictureRenditionsModalData {
    title: string;
    type: number;
    documentCount: number;
    timeTakenToReindex: string;
    error: ErrorDetails;
    launchedMessage: string;
    commandId: string;
    userInput: string;
  }