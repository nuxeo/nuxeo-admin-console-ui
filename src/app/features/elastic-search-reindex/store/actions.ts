import { createAction, props } from "@ngrx/store";
import { reindexInfo } from "../elastic-search-reindex.interface";

export const performReindex = createAction(
  "[Admin] Perform Reindex",
  props<{ docId: string }>()
);
export const performReindexSuccess = createAction(
  "[Admin] Perform Reindex Success",
  props<{ reindexInfo: reindexInfo }>()
);
export const performReindexFailure = createAction(
  "[Admin] Perform Reindex Failure",
  props<{ error: any }>()
);
export const resetReindexState = createAction("[Admin] Reset Reindex State");
