import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of } from "rxjs";
import * as ConsumerPositionActions from "./actions";
import { inject } from "@angular/core";
import { StreamService } from "../../../services/stream.service";
import { ChangeConsumerPosition, ConsumerPositionDetails } from "./reducers";

export const loadFetchStreamsEffect = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(ConsumerPositionActions.onChangeConsumerPosition),
      switchMap(({ consumerPosition, params }) => {
        return streamService
          .changeConsumerPosition(consumerPosition, params)
          .pipe(
            map((res: ChangeConsumerPosition[]) => {
              return ConsumerPositionActions.onChangeConsumerPositionSuccess(
                res
              );
            }),
            catchError((error) => {
              return of(
                ConsumerPositionActions.onChangeConsumerPositionFailure(error)
              );
            })
          );
      })
    );
  },
  { functional: true }
);

export const fetchConsumerPositionDataEffect = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(ConsumerPositionActions.onFetchConsumerPosition),
      switchMap(({ params }) => {
        return streamService.fetchConsumerPosition(params).pipe(
          map((res: ConsumerPositionDetails[]) => {
            return ConsumerPositionActions.onFetchConsumerPositionSuccess(res);
          }),
          catchError((error) => {
            return of(
              ConsumerPositionActions.onFetchConsumerPositionFailure(error)
            );
          })
        );
      })
    );
  },
  { functional: true }
);
