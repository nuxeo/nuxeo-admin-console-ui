import { createAction, props } from "@ngrx/store";
import { reindexInfo } from "../elastic-search-reindex.interface";

export const performDocumentReindex = createAction(
  "[Admin] Perform Reindex",
  props<{ docId: string }>()
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
  props<{ docId: string }>()
);
export const onFolderReindexSuccess = createAction(
  "[Admin] On Folder Reindex Success",
  props<{ reindexInfo: reindexInfo }>()
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
  props<{ docId: string }>()
);
export const onNxqlReindexSuccess = createAction(
  "[Admin] On NXQL Reindex Success",
  props<{ reindexInfo: reindexInfo }>()
);
export const onNxqlReindexFailure = createAction(
  "[Admin] On NXQL Reindex Failure",
  props<{ error: any }>()
);
export const resetNxqlReindexState = createAction(
  "[Admin] Reset NXQL Reindex State"
);