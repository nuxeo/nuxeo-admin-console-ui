import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import {
  catchError,
  finalize,
  map,
  scan,
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
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.triggerRecordsSSEStream),
      switchMap((action) =>
        streamService.startSSEStream(action.params).pipe(
          tap(() => {
            streamService.isFetchingRecords.next(true);
          }),
          scan((acc: unknown[], response: unknown) => {
            let parsedResponse;
            try {
              parsedResponse =
                typeof response === "string" ? JSON.parse(response) : response;
            } catch (error) {
              return acc;
            }
            return [...acc, parsedResponse];
          }, []),
          map((recordsArray) =>
            StreamActions.onFetchRecordsLaunch({ recordsData: recordsArray })
          ),
          finalize(() => {
            streamService.isFetchingRecords.next(false);
          }),
          catchError((error) => {
            streamService.isFetchingRecords.next(false);
            return of(StreamActions.onFetchRecordsFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true, dispatch: true }
);


export const stopRecordsSSEStream$ = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.onStopFetch),
      tap(() => {
        streamService.stopSSEStream();
        streamService.isFetchingRecords.next(false);
      }),
      map(() => StreamActions.onStopFetchLaunch())
    );
  },
  { functional: true, dispatch: true }
);