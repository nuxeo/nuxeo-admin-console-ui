import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as ReindexActions from "./actions";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";

export const loadPerformDocumentReindexEffect = createEffect(
  (
    actions$ = inject(Actions),
    elasticSearchReindexService = inject(ElasticSearchReindexService)
  ) => {
    return actions$.pipe(
      ofType(ReindexActions.performDocumentReindex),
      switchMap((action) => {
        return elasticSearchReindexService
          .performDocumentReindex(action?.requestQuery)
          .pipe(
            map((data) => {
              return ReindexActions.onDocumentReindexLaunch({
                reindexInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(ReindexActions.onDocumentReindexFailure({ error }));
            })
          );
      })
    );
  },
  { functional: true }
);
export const loadPerformFolderReindexEffect = createEffect(
  (
    actions$ = inject(Actions),
    elasticSearchReindexService = inject(ElasticSearchReindexService)
  ) => {
    return actions$.pipe(
      ofType(ReindexActions.performFolderReindex),
      switchMap((action) => {
        return elasticSearchReindexService
          .performFolderReindex(action?.requestQuery)
          .pipe(
            map((data) => {
              return ReindexActions.onFolderReindexLaunch({
                folderReindexInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(ReindexActions.onFolderReindexFailure({ error }));
            })
          );
      })
    );
  },
  { functional: true }
);
export const loadPerformNxqlReindexEffect = createEffect(
  (
    actions$ = inject(Actions),
    elasticSearchReindexService = inject(ElasticSearchReindexService)
  ) => {
    return actions$.pipe(
      ofType(ReindexActions.performNxqlReindex),
      switchMap((action) => {
        return elasticSearchReindexService
          .performNXQLReindex(action?.nxqlQuery)
          .pipe(
            map((data) => {
              return ReindexActions.onNxqlReindexLaunch({
                nxqlReindexInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(ReindexActions.onNxqlReindexFailure({ error }));
            })
          );
      })
    );
  },
  { functional: true }
);
