import { createReducer, on } from "@ngrx/store";
import * as HomeActions from "./actions"; 
import { HttpErrorResponse } from "@angular/common/http";

export interface HomeState {
  versionInfo: {
    version: string | null;
    clusterEnabled: boolean | null;
  };
  error: HttpErrorResponse | null; 
}

export const initialState: HomeState = {
  versionInfo: {
    version: null,
    clusterEnabled: null,
  },
  error: null,
};

export const homeReducer = createReducer(
  initialState,
  on(HomeActions.fetchversionInfo, (state) => ({
    ...state,
    error: null,
  })),
  on(HomeActions.fetchversionInfoSuccess, (state, { versionInfo }) => ({
    ...state,
    versionInfo: {
      version: versionInfo?.version,
      clusterEnabled: versionInfo?.clusterEnabled,
    },
  })),
  on(HomeActions.fetchversionInfoFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
