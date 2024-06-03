import { createAction, props } from "@ngrx/store";
import { versionInfo } from "../../../shared/types/version-info.interface";

export const fetchversionInfo = createAction("[Admin] Fetch Version Info");
export const fetchversionInfoSuccess = createAction(
  "[Admin] Fetch Version Info Success",
  props<{ versionInfo: versionInfo }>()
);
export const fetchversionInfoFailure = createAction(
  "[Admin] Fetch Version Info Failure",
  props<{ error: any }>()
);
