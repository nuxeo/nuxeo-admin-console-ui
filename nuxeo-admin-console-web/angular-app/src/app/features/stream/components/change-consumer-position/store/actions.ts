import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";

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
