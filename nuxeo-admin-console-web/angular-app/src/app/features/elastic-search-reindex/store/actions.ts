import { createAction, props } from "@ngrx/store";
import { ReindexInfo } from "../elastic-search-reindex.interface";
import { HttpErrorResponse } from "@angular/common/http";

export const performDocumentReindex = createAction(
  "[Admin] Perform Reindex",
  props<{ requestQuery: string | null }>()
);
export const onDocumentReindexLaunch = createAction(
  "[Admin] On Reindex Launch",
  props<{ reindexInfo: ReindexInfo }>()
);
export const onDocumentReindexFailure = createAction(
  "[Admin] Perform Reindex Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetDocumentReindexState = createAction(
  "[Admin] Reset Reindex State"
);
export const performFolderReindex = createAction(
  "[Admin] Perform Folder Reindex",
  props<{ requestQuery: string | null }>()
);
export const onFolderReindexLaunch = createAction(
  "[Admin] On Folder Reindex Launch",
  props<{ folderReindexInfo: ReindexInfo }>()
);
export const onFolderReindexFailure = createAction(
  "[Admin] On Folder Reindex Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetFolderReindexState = createAction(
  "[Admin] Reset Folder Reindex State"
);
export const performNxqlReindex = createAction(
  "[Admin] Perform NXQL Reindex",
  props<{ nxqlQuery: string | null }>()
);
export const onNxqlReindexLaunch = createAction(
  "[Admin] On NXQL Reindex Launch",
  props<{ nxqlReindexInfo: ReindexInfo }>()
);
export const onNxqlReindexFailure = createAction(
  "[Admin] On NXQL Reindex Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetNxqlReindexState = createAction(
  "[Admin] Reset NXQL Reindex State"
);
