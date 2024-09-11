import { Probe } from '../../../../shared/types/probes.interface';
import { ProbesInfo } from "./reducers";
import { createAction, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";

export const loadProbesData = createAction("[Admin] Load Probes Data");

export const loadProbesDataSuccess = createAction(
  "[Admin] Load Probes Data Success",
  props<{ probesData: ProbesInfo[] }>()
);

export const loadProbesDataFailure = createAction(
  "[Admin] Load Probes Data Failure",
  props<{ error: HttpErrorResponse }>()
);

export const launchProbe = createAction(
  "[Admin] Launch Probe",
  props<{ probeName: string | null }>()
);

export const launchProbeSuccess = createAction(
  "[Admin] Launch Probe Success",
  props<{ probeInfo: Probe }>()
);

export const launchProbeFailure = createAction(
  "[Admin] Launch Probe Failure",
  props<{ error: HttpErrorResponse }>()
);
