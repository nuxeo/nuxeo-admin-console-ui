import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from "rxjs/operators";
import { createEffect } from "@ngrx/effects";
import { Actions, ofType } from "@ngrx/effects";
import * as StreamActions from "../store/actions";
import { inject } from "@angular/core";
import { StreamService } from "../services/stream.service";
import { Stream } from "../stream.interface";

export const loadFetchStreamsEffect = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.fetchStreams),
      switchMap(() => {
        return streamService.getStreams().pipe(
          map((data: Stream[]) => {
            return StreamActions.onFetchStreamsLaunch({
              streamsData: data,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              StreamActions.onFetchStreamsFailure({
                error,
              })
            );
          })
        );
      })
    );
  },
  { functional: true }
);

export const loadFetchConsumersEffect = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.fetchConsumers),
      switchMap((action) => {
        return streamService.getConsumers(action?.params).pipe(
          map((data: { stream: string; consumer: string }[]) => {
            return StreamActions.onFetchConsumersLaunch({
              consumersData: data,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              StreamActions.onFetchConsumersFailure({
                error,
              })
            );
          })
        );
      })
    );
  },
  { functional: true }
);


export const triggerRecordsSSEStream$ = createEffect(
  (
    actions$ = inject(Actions),
    streamService = inject(StreamService)
  ) => {
    return actions$.pipe(
      ofType(StreamActions.triggerRecordsSSEStream), // Listen for the 'triggerRecordsSSEStream' action
      mergeMap((action) => {
        // Call the startSSEStream method with the params from the action
        return streamService.startSSEStream(action.params).pipe(
          map((response: any) => {
            // Process the SSE data here (or handle it as needed)
            // Dispatch an action with the processed data if necessary
            console.log(typeof response);
            return StreamActions.onFetchRecordsLaunch({ recordsData: response });
          }),
          catchError((error) => {
            // Handle any errors from the SSE stream
            return of(StreamActions.onFetchRecordsFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true } // Ensure 'dispatch' is set to true
);


