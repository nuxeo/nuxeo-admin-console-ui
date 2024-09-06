import {
  ProbeHistory,
  ProbeStatus,
  ProbeCounts
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
}

export const initialState: ProbeState = {
  probesInfo: [],
  error: null,
};

export const ProbeReducer = createReducer(
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
  }))
);
