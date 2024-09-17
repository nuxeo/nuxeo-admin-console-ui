import { createAction, props } from "@ngrx/store";
import { RenditionsInfo } from "../picture-renditions.interface";
import { HttpErrorResponse } from "@angular/common/http";

export const performNxqlRenditions = createAction(
  "[Admin] Perform NXQL Renditions",
  props<{ nxqlQuery: string | null }>()
);
export const onNxqlRenditionsLaunch = createAction(
  "[Admin] On NXQL Renditions Launch",
  props<{ nxqlRenditionInfo: RenditionsInfo }>()
);
export const onNxqlRenditionsFailure = createAction(
  "[Admin] On NXQL Renditions Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetNxqlRenditionsState = createAction(
  "[Admin] Reset NXQL Renditions State"
);
