import { createReducer, on } from "@ngrx/store";
import * as ReindexActions from "./actions";

/* Single Doc */

export interface DocumentReindexState {
  reindexInfo: {
    commandId: string | null;
  };
  error: any;
}

export const initialDocumentState: DocumentReindexState = {
  reindexInfo: {
    commandId: null,
  },
  error: null,
};

/* Folder */

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

/* NXQL */

export interface NXQLReindexState {
  nxqlReindexInfo: {
    commandId: string | null;
  };
  error: any;
}

export const initialNXQLReindexState: NXQLReindexState = {
  nxqlReindexInfo: {
    commandId: null,
  },
  error: null,
};

/* Single Doc */

export const reindexReducer = createReducer(
  initialDocumentState,
  on(ReindexActions.performDocumentReindex, (state) => ({
    ...state,
    error: null,
  })),
  on(ReindexActions.onDocumentReindexSuccess, (state, { reindexInfo }) => ({
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

/* Folder */

export const folderReindexReducer = createReducer(
  initialFolderReindexState,
  on(ReindexActions.performFolderReindex, (state) => ({
    ...state,
    error: null,
  })),
  on(ReindexActions.onFolderReindexSuccess, (state, { folderReindexInfo }) => ({
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

/* NXQL */

export const nxqlReindexReducer = createReducer(
  initialNXQLReindexState,
  on(ReindexActions.performNxqlReindex, (state) => ({
    ...state,
    error: null,
  })),
  on(ReindexActions.onNxqlReindexSuccess, (state, { nxqlReindexInfo }) => ({
    ...state,
    nxqlReindexInfo: {
      commandId: nxqlReindexInfo?.commandId,
    },
  })),
  on(ReindexActions.onNxqlReindexFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ReindexActions.resetNxqlReindexState, (state) => ({
    ...state,
    nxqlReindexInfo: {
      commandId: null,
    },
    error: null,
  }))
);
