import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import { ConsumerPositionDetails } from "./reducers";

export const onChangeConsumerPosition = createAction(
  "[Change Consumer Position] Change Consumer Position",
  props<{ consumerPosition: string; params: { [key: string]: string } }>()
);

export const onChangeConsumerPositionSuccess = createAction(
  "[Change Consumer Position] Change Consumer Position Success",
  (data: any) => ({ data })
);

export const onChangeConsumerPositionFailure = createAction(
  "[Change Consumer Position] Change Consumer Position Failure",
  props<{ error: HttpErrorResponse }>()
);

export const resetConsumerPositionData = createAction(
  "[Change Consumer Position] Reset Consumer Position Data"
);

export const onFetchConsumerPosition = createAction(
  "[Fetch Consumer Position] Fetch Consumer Position",
  props<{ params: { [key: string]: string } }>()
);

export const onFetchConsumerPositionSuccess = createAction(
  "[Fetch Consumer Position] Fetch Consumer Position Success",
  (data: ConsumerPositionDetails[]) => ({ data })
);

export const onFetchConsumerPositionFailure = createAction(
  "[Fetch Consumer Position] Fetch Consumer Position Failure",
  props<{ error: HttpErrorResponse }>()
);

export const resetFetchConsumerPositionData = createAction(
  "[Fetch Consumer Position] Reset Fetch Consumer Position Data"
);
