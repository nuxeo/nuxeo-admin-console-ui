import { createReducer, on } from "@ngrx/store";
import * as ReindexActions from "./actions";

export interface ReindexState {
  reindexInfo: {
    commandId: string | null;
  };
  error: any;
}

export const initialState: ReindexState = {
  reindexInfo: {
    commandId: null,
  },
  error: null,
};

export const reindexReducer = createReducer(
  initialState,
  on(ReindexActions.performReindex, (state) => ({
    ...state,
    error: null,
  })),
  on(ReindexActions.performReindexSuccess, (state, { reindexInfo }) => ({
    ...state,
    reindexInfo: {
      commandId: reindexInfo?.commandId,
    },
  })),
  on(ReindexActions.performReindexFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ReindexActions.resetReindexState, (state) => ({
    ...state,
    reindexInfo: {
      commandId: null,
    },
    error: null,
  }))
);
