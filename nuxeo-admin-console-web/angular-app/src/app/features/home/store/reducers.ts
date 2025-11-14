import {
  ProbeHistory,
  ProbeStatus,
} from "./../../../shared/types/probes.interface";
import { versionInfo } from "./../../../shared/types/version-info.interface";
import { createReducer, on } from "@ngrx/store";
import * as HomeActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";

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

export interface InstanceState {
  instanceInfo: InstanceInfo;
  instanceInfoError: HttpErrorResponse | null;
}

export const initialInstanceState: InstanceState = {
  instanceInfo: {} as InstanceInfo,
  instanceInfoError: null,
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
);
export const instanceInfoReducer = createReducer(
  initialInstanceState,
  on(HomeActions.fetchInstanceInfo, (state) => ({
    ...state,
    instanceInfoError: null,
  })),
  on(HomeActions.fetchInstanceInfoSuccess, (state, { instanceInfo }) => ({
    ...state,
    instanceInfo,
    instanceInfoError: null,
  })),
  on(HomeActions.fetchInstanceInfoFailure, (state, { error }) => ({
    ...state,
    instanceInfoError: error,
  }))
);
