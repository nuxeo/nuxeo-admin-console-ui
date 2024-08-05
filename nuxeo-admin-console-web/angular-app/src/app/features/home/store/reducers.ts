import {
  ProbeHistory,
  ProbeStatus,
} from "./../../../shared/types/probes.interface";
import { versionInfo } from "./../../../shared/types/version-info.interface";
import { createReducer, on } from "@ngrx/store";
import * as HomeActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface ProbesInfo {
  name: string;
  status: ProbeStatus;
  history: ProbeHistory;
}

export interface HomeState {
  versionInfo: versionInfo;
  probesInfo: ProbesInfo[];
  error: HttpErrorResponse | null;
}

export const initialState: HomeState = {
  versionInfo: {} as versionInfo,
  probesInfo: [],
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
    versionInfo,
  })),
  on(HomeActions.fetchversionInfoFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(HomeActions.fetchProbesInfo, (state) => ({
    ...state,
    error: null,
  })),
  on(HomeActions.fetchProbesInfoSuccess, (state, { probesInfo }) => ({
    ...state,
    probesInfo,
  })),
  on(HomeActions.fetchProbesInfoFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
