import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, EMPTY, from, iif, Observable, of, Subscription } from "rxjs";
import {
  catchError,
  filter,
  map,
  mergeMap,
  scan,
  switchMap,
  takeUntil,
  tap
} from "rxjs/operators";
import { createEffect } from "@ngrx/effects";
import { Actions, ofType } from "@ngrx/effects";
import * as StreamActions from "../store/actions";
import { inject } from "@angular/core";
import { StreamService } from "../services/stream.service";
import { Stream } from "../stream.interface";
import { Action } from "@ngrx/store";

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

const streamState$ = new BehaviorSubject<boolean>(true);

export const triggerRecordsSSEStream$ = createEffect(
  (
    actions$ = inject(Actions),
    streamService = inject(StreamService)
  ) => {
    return actions$.pipe(
      ofType(StreamActions.triggerRecordsSSEStream),
      tap(() => {
        console.log("🔄 Resetting stream state to active...");
        streamState$.next(true); // Reset state when starting the stream
      }),
      mergeMap((action) =>
        streamService.startSSEStream(action.params).pipe(
          scan((acc: unknown[], response: unknown) => {
            let parsedResponse;
            try {
              parsedResponse =
                typeof response === "string" ? JSON.parse(response) : response;
            } catch (error) {
              console.error("Error parsing response:", error);
              return acc;
            }
            return [...acc, parsedResponse];
          }, []),
          map((recordsArray) =>
            StreamActions.onFetchRecordsLaunch({ recordsData: recordsArray })
          ),
          takeUntil(
            actions$.pipe(
              ofType(StreamActions.onPauseFetch),
              mergeMap(() => {
                console.log("Attempting to pause SSE stream...");

                return from(streamService.stopSSEStream()).pipe(
                  tap(() => {
                    console.log("✅ SSE stream successfully stopped.");
                    streamState$.next(false); // Set state to paused *after* successful stop
                  }),
                  map(() => StreamActions.onPauseFetchLaunch()),
                  catchError((error) => {
                    console.error("❌ Error stopping SSE stream:", error);
                    return of(StreamActions.onPauseFetchFailure({ error }));
                  })
                );
              })
            )
          ),
          catchError((error) => {
            console.error("❌ SSE Stream Error:", error);
            streamState$.next(false); // 🚀 Set state to paused when stream fails
            return of(StreamActions.onFetchRecordsFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true, dispatch: true }
);


export const pauseRecordsSSEStream$ = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.onPauseFetch),
      mergeMap(() => {
        if (!streamState$.getValue()) {
          console.warn("⚠️ SSE stream already stopped, skipping stopSSEStream() and onPauseFetchLaunch().");
          return EMPTY; // Stop execution, nothing happens
        }

        console.log("🔄 Attempting to pause SSE stream...");

        return from(streamService.stopSSEStream()).pipe( // Ensure it's converted to an Observable
          tap(() => {
            console.log("✅ SSE stream successfully paused.");
            streamState$.next(false); // Set state to paused after stopping
          }),
          map(() => StreamActions.onPauseFetchLaunch()), // Dispatch action only if stop succeeded
          catchError((error) => {
            console.error("❌ Error pausing SSE stream:", error);
            return of(StreamActions.onPauseFetchFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true, dispatch: true }
);






