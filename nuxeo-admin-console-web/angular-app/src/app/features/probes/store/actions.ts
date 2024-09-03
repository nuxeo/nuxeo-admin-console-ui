import { ProbesInfo } from "./reducers";
import { createAction, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";

export const fetchProbesInfo = createAction("[Admin] Fetch Probes Info");

export const fetchProbesInfoSuccess = createAction(
  "[Admin] Fetch Probes Info Success",
  props<{ probesInfo: ProbesInfo[] }>()
);

export const fetchProbesInfoFailure = createAction(
  "[Admin] Fetch Probes Info Failure",
  props<{ error: HttpErrorResponse }>()
);
