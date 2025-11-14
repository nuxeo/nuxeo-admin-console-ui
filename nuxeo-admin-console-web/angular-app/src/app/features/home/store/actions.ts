import { createAction, props } from "@ngrx/store";
import { versionInfo } from "../../../shared/types/version-info.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";

export const fetchversionInfo = createAction("[Admin] Fetch Version Info");
export const fetchversionInfoSuccess = createAction(
  "[Admin] Fetch Version Info Success",
  props<{ versionInfo: versionInfo }>()
);
export const fetchversionInfoFailure = createAction(
  "[Admin] Fetch Version Info Failure",
  props<{ error: HttpErrorResponse | null }>()
);

export const fetchInstanceInfo = createAction("[Admin] Fetch Instance Info");
export const fetchInstanceInfoSuccess = createAction(
  "[Admin] Fetch Instance Info Success",
  props<{ instanceInfo: InstanceInfo }>()
);
export const fetchInstanceInfoFailure = createAction(
  "[Admin] Fetch Instance Info Failure",
  props<{ error: HttpErrorResponse | null }>()
);