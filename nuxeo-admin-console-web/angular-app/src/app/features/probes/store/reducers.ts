import {
    ProbeHistory,
    ProbeStatus,
    ProbeCounts
  } from "./../../../shared/types/probes.interface";
  import { HttpErrorResponse } from "@angular/common/http";
  import { createReducer, on } from "@ngrx/store";
  import * as ProbesActions from "./actions";
  
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
  }
  
  export const initialState: ProbeState = {
    
    probesInfo: [],
    error: null,
  };

  
  export const ProbeReducer = createReducer(
    initialState,
    
    on(ProbesActions.fetchProbesInfo, (state) => ({
      ...state,
      error: null,
    })),
    on(ProbesActions.fetchProbesInfoSuccess, (state, { probesInfo }) => ({
      ...state,
      probesInfo,
    })),
    on(ProbesActions.fetchProbesInfoFailure, (state, { error }) => ({
      ...state,
      error,
    })),
    on(ProbesActions.launchProbeSuccess, (state, { probeInfo }) => ({
      ...state,
      probesInfo: state.probesInfo.map((probe) =>
        probe.name === probeInfo.name ? { ...probe, ...probeInfo } : probe
      ),
    })),
    on(ProbesActions.launchProbeFailure, (state, { error }) => ({
      ...state,
      error,
    }))
  );
  