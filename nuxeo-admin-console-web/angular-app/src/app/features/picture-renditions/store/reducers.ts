import { createReducer, on } from "@ngrx/store";
import * as RenditionsActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface NXQLRenditionState {
  nxqlRenditionInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialNXQLRenditionState: NXQLRenditionState = {
    nxqlRenditionInfo: {
    commandId: null,
  },
  error: null,
};

export const nxqlRenditionReducer = createReducer(
  initialNXQLRenditionState,
  on(RenditionsActions.performNxqlRenditions, (state) => ({
    ...state,
    error: null,
  })),
  on(RenditionsActions.onNxqlRenditionsLaunch, (state, { nxqlRenditionInfo }) => ({
    ...state,
    nxqlRenditionInfo: {
      commandId: nxqlRenditionInfo?.commandId,
    },
  })),
  on(RenditionsActions.onNxqlRenditionsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(RenditionsActions.resetNxqlRenditionsState, (state) => ({
    ...state,
    nxqlRenditionInfo: {
      commandId: null,
    },
    error: null,
  }))
);
