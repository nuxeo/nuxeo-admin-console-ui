import { createReducer, on } from "@ngrx/store";
import * as ReindexActions from "./actions";

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
