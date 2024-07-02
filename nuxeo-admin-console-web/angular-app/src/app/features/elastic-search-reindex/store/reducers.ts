import { createReducer, on } from "@ngrx/store";
import * as ReindexActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface DocumentReindexState {
  reindexInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialDocumentState: DocumentReindexState = {
  reindexInfo: {
    commandId: null,
  },
  error: null,
};

export interface FolderReindexState {
  folderReindexInfo: {
    commandId: string | null;
  };
  error: any;
}

export const initialFolderReindexState: FolderReindexState = {
  folderReindexInfo: {
    commandId: null,
  },
  error: null,
};

export const reindexReducer = createReducer(
  initialDocumentState,
  on(ReindexActions.performDocumentReindex, (state) => ({
    ...state,
    error: null,
  })),
  on(ReindexActions.onDocumentReindexLaunch, (state, { reindexInfo }) => ({
    ...state,
    reindexInfo: {
      commandId: reindexInfo?.commandId,
    },
  })),
  on(ReindexActions.onDocumentReindexFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ReindexActions.resetDocumentReindexState, (state) => ({
    ...state,
    reindexInfo: {
      commandId: null,
    },
    error: null,
  }))
);

export const folderReindexReducer = createReducer(
  initialFolderReindexState,
  on(ReindexActions.performFolderReindex, (state) => ({
    ...state,
    error: null,
  })),
  on(ReindexActions.onFolderReindexLaunch, (state, { folderReindexInfo }) => ({
    ...state,
    folderReindexInfo: {
      commandId: folderReindexInfo?.commandId,
    },
  })),
  on(ReindexActions.onFolderReindexFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ReindexActions.resetFolderReindexState, (state) => ({
    ...state,
    folderReindexInfo: {
      commandId: null,
    },
    error: null,
  }))
);
