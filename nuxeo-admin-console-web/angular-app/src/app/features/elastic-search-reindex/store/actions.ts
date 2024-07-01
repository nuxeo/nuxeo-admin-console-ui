import { createAction, props } from "@ngrx/store";
import { reindexInfo } from "../elastic-search-reindex.interface";
import { HttpErrorResponse } from "@angular/common/http";

export const performDocumentReindex = createAction(
  "[Admin] Perform Reindex",
  props<{ requestQuery: string | null }>()
);
export const onDocumentReindexLaunch = createAction(
  "[Admin] On Reindex Launch",
  props<{ reindexInfo: reindexInfo }>()
);
export const onDocumentReindexFailure = createAction(
  "[Admin] Perform Reindex Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetDocumentReindexState = createAction(
  "[Admin] Reset Reindex State"
);
