import { ProbesResponse } from "./../../../shared/types/probes.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProbeService } from "../services/probes.service";
import * as ProbeActions from "./actions";

export const loadProbesDataEffect = createEffect(
  (actions$ = inject(Actions), probeService = inject(ProbeService)) => {
    return actions$.pipe(
      ofType(ProbeActions.loadProbesData),
      switchMap(() => {
        return probeService.getProbesInfo().pipe(
          map((data: ProbesResponse) => {
            const probesData = data.entries.map((entry) => ({
              name: entry.name,
              status: entry.status,
              history: entry.history,
              counts: entry.counts,
              time: entry.time,
            }));
            return ProbeActions.loadProbesDataSuccess({ probesData });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(ProbeActions.loadProbesDataFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true }
);
