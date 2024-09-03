import { ProbesResponse } from "./../../../shared/types/probes.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { ProbeService } from "../services/probes.service";
import * as ProbeActions from "./actions";

export const loadProbesInfoEffect = createEffect(
  (actions$ = inject(Actions), probeService = inject(ProbeService)) => {
    return actions$.pipe(
      ofType(ProbeActions.fetchProbesInfo),
      switchMap(() => {
        return probeService.getProbesInfo().pipe(
          map((data: ProbesResponse) => {
            const probesInfo = data.entries.map((entry) => ({
              name: entry.name,
              status: entry.status,
              history: entry.history,
              counts: entry.counts,  
              time: entry.time  
            }));
            return ProbeActions.fetchProbesInfoSuccess({ probesInfo });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(ProbeActions.fetchProbesInfoFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true }
);
