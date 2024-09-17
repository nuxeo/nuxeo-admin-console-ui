import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as ReindexActions from "./actions";
import { PictureRenditionsService } from "../services/picture-renditions.service";

export const loadPerformDocumentReindexEffect = createEffect(
  (
    actions$ = inject(Actions),
    pictureRenditionsService = inject(PictureRenditionsService)
  ) => {
    return actions$.pipe(
      ofType(ReindexActions.performDocumentPictureRenditions),
      switchMap((action) => {
        return pictureRenditionsService.performDocumentRenditions(action?.requestQuery)
          .pipe(
            map((data) => {
              return ReindexActions.onDocumentPictureRenditionsLaunch({
                renditionsInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(ReindexActions.onDocumentPictureRendtionsFailure({ error }));
            })
          );
      })
    );
  },
  { functional: true }
);
