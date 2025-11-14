import { createAction, props } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { RecordsPayload, Stream } from "../stream.interface";

export const fetchStreams = createAction("[Admin] Fetch Streams");
export const onFetchStreamsLaunch = createAction(
  "[Admin] On Fetch Streams Launch",
  props<{ streamsData: Stream[] }>()
);
export const onFetchStreamsFailure = createAction(
  "[Admin] On Fetch Streams Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetFetchStreamsState = createAction(
  "[Admin] Reset Fetch Streams State"
);
export const fetchConsumers = createAction(
  "[Admin] Fetch Consumers",
  props<{ params: { [key: string]: string }, }>()
);
export const onFetchConsumersLaunch = createAction(
  "[Admin] On Fetch Consumers Launch",
  props<{ consumersData: { stream: string; consumer: string }[] }>()
);
export const onFetchConsumersFailure = createAction(
  "[Admin] On Fetch Consumers Failure",
  props<{ error: HttpErrorResponse }>()
);
export const resetFetchConsumersState = createAction(
  "[Admin] Reset Fetch Consumers State"
);
export const triggerRecordsSSEStream = createAction(
  '[Admin] Trigger Records SSE Stream',
  props<{ params: RecordsPayload }>()
);
export const onFetchRecordsLaunch = createAction(
  "[Admin] On Fetch Records Launch",
  props<{ recordsData: unknown }>()
);
export const onFetchRecordsFailure = createAction(
  "[Admin] On Fetch Records Failure",
  props<{ error: HttpErrorResponse | null }>()
);
export const resetFetchRecordsState = createAction(
  "[Admin] Reset Fetch Records State"
);
export const onStopFetch = createAction(
  '[Admin] Stop Fetching Records'
);
export const onStopFetchLaunch = createAction(
  "[Admin] On Stop Fetch Launch"
);
export const onStopFetchFailure = createAction(
  "[Admin] On Stop Fetch Failure",
  props<{ error: unknown }>()
);
export const resetStopFetchState = createAction(
  "[Admin] Reset Stop Fetch State"
);

export const resetStreamErrorState = createAction(
  "[Admin] Reset Stream State Error"  
);

// Consumer Thread Pool Actions
export const onStartConsumerThreadPoolLaunch = createAction(
  "[Admin] On Start Consumer Thread Pool",
 props<{ params: { [key: string]: string }, }>()
);

export const onStartConsumerThreadPoolLaunchFailure = createAction(
  "[Admin] On Start Consumer Thread Pool Failure",
  props<{ error: HttpErrorResponse }>()
);

export const onStartConsumerThreadPoolLaunchSuccess = createAction(
  "[Admin] On Start Consumer Thread Pool Launch Success",
);

export const onStopConsumerThreadPoolLaunch = createAction(
  "[Admin] On Stop Consumer Thread Pool",
 props<{ params: { [key: string]: string }, }>()
);

export const onStopConsumerThreadPoolLaunchFailure = createAction(
  "[Admin] On Stop Consumer Thread Pool Failure",
  props<{ error: HttpErrorResponse }>()
);

export const onStopConsumerThreadPoolLaunchSuccess = createAction(
  "[Admin] On Stop Consumer Thread Pool Launch Success",
);

export const resetConsumerThreadPoolState = createAction(
  "[Admin] Reset Consumer Thread Pool State"
);
