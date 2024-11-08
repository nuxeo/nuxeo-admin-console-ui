import { createAction, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { ActionInfo } from "../generic-multi-feature-layout.interface";

export const performDocumentAction = createAction(
  "[Admin] Perform Action",
  props<{ requestUrl: string | null; requestParams: unknown; featureEndpoint: string,  requestHeaders: { [key: string]: string }; }>()
);
export const onDocumentActionLaunch = createAction(
  "[Admin] On Action Launch",
  props<{ documentActionInfo: ActionInfo }>()
);
export const onDocumentActionFailure = createAction(
  "[Admin] Perform Action Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetDocumentActionState = createAction(
  "[Admin] Reset Action State"
);
export const performFolderAction = createAction(
  "[Admin] Perform Folder Action",
  props<{ requestUrl: string | null; requestParams: unknown; featureEndpoint: string,  requestHeaders: { [key: string]: string }; }>()
);
export const onFolderActionLaunch = createAction(
  "[Admin] On Folder Action Launch",
  props<{ folderActionInfo: ActionInfo }>()
);
export const onFolderActionFailure = createAction(
  "[Admin] On Folder Action Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetFolderActionState = createAction(
  "[Admin] Reset Folder Action State"
);
export const performNxqlAction = createAction(
  "[Admin] Perform NXQL Action",
  props<{ requestUrl: string | null; requestParams: unknown; featureEndpoint: string,  requestHeaders: { [key: string]: string }; }>()
);
export const onNxqlActionLaunch = createAction(
  "[Admin] On NXQL Action Launch",
  props<{ nxqlActionInfo: ActionInfo }>()
);
export const onNxqlActionFailure = createAction(
  "[Admin] On NXQL Action Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetNxqlActionState = createAction(
  "[Admin] Reset NXQL Action State"
);
