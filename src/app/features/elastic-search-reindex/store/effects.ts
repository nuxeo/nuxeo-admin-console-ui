import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap, throwError } from "rxjs";
import * as ReindexActions from "./actions";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";

export const loadPerformReindexEffect = createEffect(
  (actions$ = inject(Actions), elasticSearchReindexService = inject(ElasticSearchReindexService)) => {
    return actions$.pipe(
      ofType(ReindexActions.performReindex),
      switchMap((action) => {
        return elasticSearchReindexService.performReindex(action.docId).pipe(
          // tap(() => {
          //   throw new Error("Server error occurred")
          // }),
          map((data) => {
            return ReindexActions.performReindexSuccess({
                reindexInfo: {
                  commandId: data?.commandId
              },
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(ReindexActions.performReindexFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true }
);
