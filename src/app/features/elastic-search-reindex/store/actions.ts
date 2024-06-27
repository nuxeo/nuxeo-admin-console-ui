import { createAction, props } from "@ngrx/store";
import { reindexInfo } from "../elastic-search-reindex.interface";

export const performDocumentReindex = createAction(
  "[Admin] Perform Reindex",
  props<{ requestQuery: string | null  }>()
);
export const onDocumentReindexSuccess = createAction(
  "[Admin] Perform Reindex Success",
  props<{ reindexInfo: reindexInfo }>()
);
export const onDocumentReindexFailure = createAction(
  "[Admin] Perform Reindex Failure",
  props<{ error: any }>()
);
export const resetDocumentReindexState = createAction("[Admin] Reset Reindex State");


export const performFolderReindex = createAction(
  "[Admin] Perform Folder Reindex",
  props<{ documentID: string | null  }>()
);
export const onFolderReindexSuccess = createAction(
  "[Admin] On Folder Reindex Success",
  props<{ folderReindexInfo: reindexInfo }>()
);
export const onFolderReindexFailure = createAction(
  "[Admin] On Folder Reindex Failure",
  props<{ error: any }>()
);
export const resetFolderReindexState = createAction(
  "[Admin] Reset Folder Reindex State"
);

export const performNxqlReindex = createAction(
  "[Admin] Perform NXQL Reindex",
  props<{ nxqlQuery: string | null }>()
);
export const onNxqlReindexSuccess = createAction(
  "[Admin] On NXQL Reindex Success",
  props<{ nxqlReindexInfo: reindexInfo }>()
);
export const onNxqlReindexFailure = createAction(
  "[Admin] On NXQL Reindex Failure",
  props<{ error: any }>()
);
export const resetNxqlReindexState = createAction(
  "[Admin] Reset NXQL Reindex State"
);
