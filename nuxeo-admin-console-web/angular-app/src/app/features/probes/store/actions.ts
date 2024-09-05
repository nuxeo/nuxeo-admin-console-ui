import { ProbesInfo } from "./reducers";
import { createAction, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { Probe } from "src/app/shared/types/probes.interface";

export const fetchProbesInfo = createAction("[Admin] Fetch Probes Info");

export const fetchProbesInfoSuccess = createAction(
  "[Admin] Fetch Probes Info Success",
  props<{ probesInfo: ProbesInfo[] }>()
);

export const fetchProbesInfoFailure = createAction(
  "[Admin] Fetch Probes Info Failure",
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
