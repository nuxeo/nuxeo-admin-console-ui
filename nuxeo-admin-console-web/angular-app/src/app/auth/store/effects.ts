import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { UserInterface } from "../../shared/types/user.interface";
import { AuthService } from "../services/auth.service";
import { authActions } from "./actions";
import { NuxeoJSClientService } from "../../shared/services/nuxeo-js-client.service";
export const getCurrentUserEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
  ) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        return authService.getCurrentUser().pipe(
          map((currentUser: UserInterface) => {
            return authActions.getCurrentUserSuccess({ currentUser });
          }),
          catchError(() => {
            return of(authActions.getCurrentUserFailure());
          })
        );
      })
    );
  },
  { functional: true }
);

export const signOutEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    nuxeoJsClientService = inject(NuxeoJSClientService)
  ) => {
    return actions$.pipe(
      ofType(authActions.signOut),
      switchMap(() => {
        return authService.signOut().pipe(
          map(() => {
            return authActions.signOutSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              authActions.signOutFailure({
                errors: errorResponse.error.errors,
              })
            );
          })
        );
      }),
      tap(() => {
        const _baseURL = nuxeoJsClientService.getBaseUrl();
        window.location.href = `${_baseURL}/login.jsp?requestedUrl=nuxeoadmin`;
      })
    );
  },
  { functional: true }
);