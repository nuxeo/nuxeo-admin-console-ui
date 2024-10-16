import { GenericMultiFeatureEndpointsService } from './../services/generic-multi-feature-endpoints.service';
import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import * as FeatureActions from "./actions";

export const loadPerformDocumentActionEffect = createEffect(
  (
    actions$ = inject(Actions),
    genericMultiFeatureEndpointsService = inject(GenericMultiFeatureEndpointsService)
  ) => {
    return actions$.pipe(
      ofType(FeatureActions.performDocumentAction),
      switchMap((action) => {
        return genericMultiFeatureEndpointsService
        .performDocumentAction(action?.requestUrl, action?.requestParams, action?.featureEndpoint, action?.requestHeaders)
          .pipe(
            map((data) => {
              return FeatureActions.onDocumentActionLaunch({
                documentActionInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(FeatureActions.onDocumentActionFailure({ error: error?.error ? error?.error : error }));
            })
          );
      })
    );
  },
  { functional: true }
);
export const loadPerformFolderActionEffect = createEffect(
  (
    actions$ = inject(Actions),
    genericMultiFeatureEndpointsService = inject(GenericMultiFeatureEndpointsService)
  ) => {
    return actions$.pipe(
      ofType(FeatureActions.performFolderAction),
      switchMap((action) => {
        return genericMultiFeatureEndpointsService
          .performFolderAction(action?.requestUrl, action?.requestParams, action?.featureEndpoint, action?.requestHeaders)
          .pipe(
            map((data) => {
              return FeatureActions.onFolderActionLaunch({
                folderActionInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(FeatureActions.onFolderActionFailure({ error: error?.error ? error?.error : error }));
            })
          );
      })
    );
  },
  { functional: true }
);
export const loadPerformNxqlActionEffect = createEffect(
  (
    actions$ = inject(Actions),
    genericMultiFeatureEndpointsService = inject(GenericMultiFeatureEndpointsService)
  ) => {
    return actions$.pipe(
      ofType(FeatureActions.performNxqlAction),
      switchMap((action) => {
        return genericMultiFeatureEndpointsService
          .performNXQLAction(action?.requestUrl, action?.requestParams, action?.featureEndpoint, action?.requestHeaders)
          .pipe(
            map((data) => {
              return FeatureActions.onNxqlActionLaunch({
                nxqlActionInfo: {
                  commandId: data?.commandId,
                },
              });
            }),
            catchError((error: HttpErrorResponse) => {
              return of(FeatureActions.onNxqlActionFailure({ error: error?.error ? error?.error : error }));
            })
          );
      })
    );
  },
  { functional: true }
);
