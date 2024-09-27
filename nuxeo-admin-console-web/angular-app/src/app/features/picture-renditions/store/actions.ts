import { createAction, props } from "@ngrx/store";
import { RenditionsInfo } from "../picture-renditions.interface";
import { HttpErrorResponse } from "@angular/common/http";

export const performNxqlPictureRenditions = createAction(
  "[Admin] Perform NXQL Renditions",
  props<{ nxqlQuery: string | null }>()
);
export const onNxqlPictureRenditionsLaunch = createAction(
  "[Admin] On NXQL Renditions Launch",
  props<{ nxqlPictureRenditionsInfo: RenditionsInfo }>()
);
export const onNxqlPictureRenditionsFailure = createAction(
  "[Admin] On NXQL Renditions Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetNxqlPictureRenditionsState = createAction(
  "[Admin] Reset NXQL Renditions State"
);
