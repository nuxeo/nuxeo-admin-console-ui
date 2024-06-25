import { createReducer, on } from "@ngrx/store";
import * as ReindexActions from "./actions";

export interface DocumentReindexState {
  reindexInfo: {
    commandId: string | null;
  };
  error: any;
}

export interface FolderReindexState {
  folderReindexInfo: {
    commandId: string | null;
  };
  error: any;
}

export interface NXQLReindexState {
  nxqlReindexInfo: {
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

export const initialFolderReindexState: FolderReindexState = {
  folderReindexInfo: {
    commandId: null,
  },
  error: null,
};

export const initialNXQLReindexState: NXQLReindexState = {
  nxqlReindexInfo: {
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
