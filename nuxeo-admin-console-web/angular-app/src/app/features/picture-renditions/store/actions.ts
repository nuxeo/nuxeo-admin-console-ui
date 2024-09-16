import { createAction, props } from "@ngrx/store";
import { RenditionsInfo } from "../picture-renditions.interface";
import { HttpErrorResponse } from "@angular/common/http";

export const performDocumentPictureRenditions = createAction(
  "[Admin] Perform Renditions",
  props<{ requestQuery: string | null }>()
);
export const onDocumentPictureRenditionsLaunch = createAction(
  "[Admin] On Renditions Launch",
  props<{ renditionsInfo: RenditionsInfo }>()
);
export const onDocumentPictureRendtionsFailure = createAction(
  "[Admin] Perform Renditions Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetDocumentPictureRenditionsState = createAction(
  "[Admin] Reset Renditions State"
);
