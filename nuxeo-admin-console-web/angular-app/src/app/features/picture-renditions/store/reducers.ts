import { createReducer, on } from "@ngrx/store";
import * as RenditionsActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface DocumentRenditionsState {
  renditionsInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialDocumentState: DocumentRenditionsState = {
  renditionsInfo: {
    commandId: null,
  },
  error: null,
};

export const renditionsReducer = createReducer(
  initialDocumentState,
  on(RenditionsActions.performDocumentPictureRenditions, (state) => ({
    ...state,
    error: null,
  })),
  on(RenditionsActions.onDocumentPictureRenditionsLaunch, (state, { renditionsInfo }) => ({
    ...state,
    renditionsInfo: {
      commandId: renditionsInfo?.commandId,
    },
  })),
  on(RenditionsActions.onDocumentPictureRendtionsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(RenditionsActions.resetDocumentPictureRenditionsState, (state) => ({
    ...state,
    renditionsInfo: {
      commandId: null,
    },
    error: null,
  }))
);


