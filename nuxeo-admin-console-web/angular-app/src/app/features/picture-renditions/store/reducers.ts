import { createReducer, on } from "@ngrx/store";
import * as RenditionsActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface NxqlPictureRenditionsState {
  nxqlPictureRenditionsInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialNxqlLPictureRenditionsState: NxqlPictureRenditionsState = {
    nxqlPictureRenditionsInfo: {
    commandId: null,
  },
  error: null,
};

export const nxqlPictureRenditionsReducer = createReducer(
  initialNxqlLPictureRenditionsState,
  on(RenditionsActions.performNxqlPictureRenditions, (state) => ({
    ...state,
    error: null,
  })),
  on(RenditionsActions.onNxqlPictureRenditionsLaunch, (state, { nxqlPictureRenditionsInfo }) => ({
    ...state,
    nxqlPictureRenditionsInfo: {
      commandId: nxqlPictureRenditionsInfo?.commandId,
    },
  })),
  on(RenditionsActions.onNxqlPictureRenditionsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(RenditionsActions.resetNxqlPictureRenditionsState, (state) => ({
    ...state,
    nxqlPictureRenditionsInfo: {
      commandId: null,
    },
    error: null,
  }))
);
