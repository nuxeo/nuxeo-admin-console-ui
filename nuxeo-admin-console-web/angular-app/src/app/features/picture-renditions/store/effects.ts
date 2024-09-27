import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as RenditionActions from "./actions";
import { PictureRendtionsService } from "../services/picture-renditions.service";

export const loadPerformNxqlReindexEffect = createEffect(
  (
    actions$ = inject(Actions),
    pictureRenditionService = inject(PictureRendtionsService)
  ) => {
    return actions$.pipe(
      ofType(RenditionActions.performNxqlPictureRenditions),
      switchMap((action) => {
        return pictureRenditionService
          .performNXQLPictureRenditions(action?.nxqlQuery)
          .pipe(
            map((data) => {
              return RenditionActions.onNxqlPictureRenditionsLaunch({
                nxqlPictureRenditionsInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(RenditionActions.onNxqlPictureRenditionsFailure({ error }));
            })
          );
      })
    );
  },
  { functional: true }
);