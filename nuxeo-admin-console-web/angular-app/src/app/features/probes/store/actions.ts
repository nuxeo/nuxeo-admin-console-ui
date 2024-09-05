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
