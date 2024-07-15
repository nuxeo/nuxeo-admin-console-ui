import { createReducer, on } from "@ngrx/store";
import * as HomeActions from "./actions";

export interface ProbesInfo {
  name: string;
  status: ProbeStatus;
}

export interface ProbeStatus {
  "entity-type"?: string;
  neverExecuted: boolean;
  success: boolean;
  infos: {
    info: string;
  };
}

export interface HomeState {
  versionInfo: {
    version: string | null;
    clusterEnabled: boolean | null;
  };
  probesInfo: ProbesInfo[];
  error: any;
}

export const initialState: HomeState = {
  versionInfo: {
    version: null,
    clusterEnabled: null,
  },
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
    versionInfo: {
      version: versionInfo?.version,
      clusterEnabled: versionInfo?.clusterEnabled,
    },
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
    probesInfo
  })),
  on(HomeActions.fetchversionInfoFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
