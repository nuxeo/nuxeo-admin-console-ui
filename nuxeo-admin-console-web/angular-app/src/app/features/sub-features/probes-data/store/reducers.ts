import {
  ProbeHistory,
  ProbeStatus,
  ProbeCounts,
} from "../../../../shared/types/probes.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { createReducer, on } from "@ngrx/store";
import * as ProbeActions from "./actions";

export interface ProbesInfo {
  name: string;
  status: ProbeStatus;
  history: ProbeHistory;
  counts?: ProbeCounts;
  time?: number;
}

export interface ProbeState {
  probesInfo: ProbesInfo[];
  error: HttpErrorResponse | null;
  launchAllProbeError: HttpErrorResponse | null;
  showLaunchAllSuccessSnackbar?: boolean;
}

export const initialState: ProbeState = {
  probesInfo: [],
  error: null,
  launchAllProbeError: null,
  showLaunchAllSuccessSnackbar: false,
};

export const ProbeDataReducer = createReducer(
  initialState,
  on(ProbeActions.loadProbesData, (state) => ({
    ...state,
    error: null,
  })),

  on(ProbeActions.loadProbesDataSuccess, (state, { probesData }) => ({
    ...state,
    probesInfo: probesData,
  })),

  on(ProbeActions.loadProbesDataFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ProbeActions.launchProbeSuccess, (state, { probeInfo }) => ({
    ...state,
    probesInfo: state.probesInfo.map((probe) =>
      probe.name === probeInfo.name ? { ...probe, ...probeInfo } : probe
    ),
     showLaunchAllSuccessSnackbar: false,
  })),
  
  on(ProbeActions.launchProbeFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ProbeActions.launchAllProbes, (state) => ({
    ...state,
    launchAllProbeError: null,
    showLaunchAllSuccessSnackbar: false,
  })),

  on(ProbeActions.launchAllProbesSuccess, (state, { probesData }) => ({
    ...state,
    probesInfo: probesData,
    launchAllProbeError: null,
     showLaunchAllSuccessSnackbar: true,
  })),

  on(ProbeActions.launchAllProbesFailure, (state, { error }) => ({
    ...state,
    launchAllProbeError: error,
    showLaunchAllSuccessSnackbar: false,
  })),

  on(ProbeActions.resetLaunchAllProbesState, (state) => ({
    ...state,
    showLaunchAllSuccessSnackbar: false,
    launchAllProbeError: null,
  }))
);
