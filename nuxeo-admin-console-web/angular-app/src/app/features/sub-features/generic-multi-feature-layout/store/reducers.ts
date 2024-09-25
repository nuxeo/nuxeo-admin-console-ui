import { createReducer, on } from "@ngrx/store";
import * as FeatureActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface DocumentActionState {
  documentActionInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialDocumentState: DocumentActionState = {
  documentActionInfo: {
    commandId: null,
  },
  error: null,
};

export interface FolderActionState {
  folderActionInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialFolderActionState: FolderActionState = {
  folderActionInfo: {
    commandId: null,
  },
  error: null,
};

export interface NXQLActionState {
  nxqlActionInfo: {
    commandId: string | null;
  };
  error: HttpErrorResponse | null;
}

export const initialNXQLActionState: NXQLActionState = {
  nxqlActionInfo: {
    commandId: null,
  },
  error: null,
};

export const documentActionReducer = createReducer(
  initialDocumentState,
  on(FeatureActions.performDocumentAction, (state) => ({
    ...state,
    error: null,
  })),
  on(FeatureActions.onDocumentActionLaunch, (state, { documentActionInfo }) => {
    return {
      ...state,
      documentActionInfo: {
        commandId: documentActionInfo?.commandId,
      },
    };
  }),
  
  on(FeatureActions.onDocumentActionFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(FeatureActions.resetDocumentActionState, (state) => ({
    ...state,
    documentActionInfo: {
      commandId: null,
    },
    error: null,
  }))
);

export const folderActionReducer = createReducer(
  initialFolderActionState,
  on(FeatureActions.performFolderAction, (state) => ({
    ...state,
    error: null,
  })),
  on(FeatureActions.onFolderActionLaunch, (state, { folderActionInfo }) => ({
    ...state,
    folderActionInfo: {
      commandId: folderActionInfo?.commandId,
    },
  })),
  on(FeatureActions.onFolderActionFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(FeatureActions.resetFolderActionState, (state) => ({
    ...state,
    folderActionInfo: {
      commandId: null,
    },
    error: null,
  }))
);

export const nxqlActionReducer = createReducer(
  initialNXQLActionState,
  on(FeatureActions.performNxqlAction, (state) => ({
    ...state,
    error: null,
  })),
  on(FeatureActions.onNxqlActionLaunch, (state, { nxqlActionInfo }) => ({
    ...state,
    nxqlActionInfo: {
      commandId: nxqlActionInfo?.commandId,
    },
  })),
  on(FeatureActions.onNxqlActionFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(FeatureActions.resetNxqlActionState, (state) => ({
    ...state,
    nxqlActionInfo: {
      commandId: null,
    },
    error: null,
  }))
);
