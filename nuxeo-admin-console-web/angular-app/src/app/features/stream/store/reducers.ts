import { createReducer, on } from "@ngrx/store";
import * as StreamActions from "./actions";
import { Stream } from "../stream.interface";
import { HttpErrorResponse } from "@angular/common/http";

export interface StreamsState {
  streams: Stream[];
  consumers: { stream: string; consumer: string }[];
  records: { type?: string }[];
  isFetchStopped: boolean;
  isFetchStoppedError: unknown | null;
  streamsError: HttpErrorResponse | null;
  consumersError: HttpErrorResponse | null;
  recordsError: HttpErrorResponse | null;
  streamDataLoaded: boolean; // Indicates if the streams data has been loaded or not
}

export const initialStreamsState: StreamsState = {
  streams: [],
  consumers: [],
  records: [],
  isFetchStopped: false,
  isFetchStoppedError: null,
  streamsError: null,
  consumersError: null,
  recordsError: null,
  streamDataLoaded: false,
};

export interface ConsumerThreadPoolState {
  isStartStopConsumerPoolProcessRunning: boolean;
  isStartProcessCompleted: boolean;
  isStopProcessCompleted: boolean;
  isStartConsumerStoppedError: HttpErrorResponse | null;
  isStopConsumerStoppedError: HttpErrorResponse | null;
}

export const initialConsumerThreadPoolState: ConsumerThreadPoolState = {
  isStartStopConsumerPoolProcessRunning: false,
  isStartProcessCompleted: false,
  isStopProcessCompleted: false,
  isStartConsumerStoppedError: null,
  isStopConsumerStoppedError: null,
};

export const streamsReducer = createReducer(
  initialStreamsState,

  // Fetch Streams
  on(StreamActions.fetchStreams, (state) => ({
    ...state,
    streamsError: null,
    streamDataLoaded: true,
  })),
  on(StreamActions.onFetchStreamsLaunch, (state, { streamsData }) => ({
    ...state,
    streams: streamsData,
    streamDataLoaded: true,
  })),
  on(StreamActions.onFetchStreamsFailure, (state, { error }) => ({
    ...state,
    streamsError: error,
    streamDataLoaded: false,
  })),
  on(StreamActions.resetFetchStreamsState, (state) => ({
    ...state,
    streams: initialStreamsState.streams,
    streamsError: null,
    streamDataLoaded: false,
  })),

    on(StreamActions.resetStreamErrorState, (state) => ({
    ...state,
    records: initialStreamsState.records,
    isFetchStoppedError: null,
    streamsError: null,
    consumersError: null,
    recordsError: null,
    isFetchStopped: false,

  })),

  // Fetch Consumers
  on(StreamActions.fetchConsumers, (state) => ({
    ...state,
    consumersError: null,
  })),
  on(StreamActions.onFetchConsumersLaunch, (state, { consumersData }) => ({
    ...state,
    consumers: consumersData,
  })),
  on(StreamActions.onFetchConsumersFailure, (state, { error }) => ({
    ...state,
    consumersError: error,
  })),
  on(StreamActions.resetFetchConsumersState, (state) => ({
    ...state,
    consumers: initialStreamsState.consumers,
    consumersError: null,
  })),
  
  // Fetch Records via SSE
  on(StreamActions.triggerRecordsSSEStream, (state) => ({
    ...state,
    recordsError: null,
  })),
  on(StreamActions.onFetchRecordsLaunch, (state, { recordsData }) => ({
    ...state,
    records: Array.isArray(recordsData) ? recordsData : [recordsData],
  })),
  on(StreamActions.onFetchRecordsFailure, (state, { error }) => ({
    ...state,
    recordsError: error,
  })),
  on(StreamActions.resetFetchRecordsState, (state) => ({
    ...state,
    records: initialStreamsState.records,
    recordsError: null,
  })),

  // Stop SSE Fetching
  on(StreamActions.onStopFetchLaunch, (state) => ({
    ...state,
    isFetchStopped: true,
  })),
  on(StreamActions.onStopFetchFailure, (state) => ({
    ...state,
    isFetchStoppedError: false,
  })),
  on(StreamActions.resetStopFetchState, (state) => ({
    ...state,
    isFetchStopped: false,
    isFetchStoppedError: null,
  })),
);

export const consumerThreadPoolReducer = createReducer(
  initialConsumerThreadPoolState,
  on(StreamActions.onStartConsumerThreadPoolLaunch, (state) => ({
    ...state,
    isStartStopConsumerPoolProcessRunning: true,
    isStartProcessCompleted: false,
    isStopProcessCompleted: false,
    isStartConsumerStoppedError: null,
  })),

  on(
    StreamActions.onStartConsumerThreadPoolLaunchFailure,
    (state, { error }) => ({
      ...state,
      isStartStopConsumerPoolProcessRunning: false,
      isStartProcessCompleted: false,
      isStopProcessCompleted: false,
      isStartConsumerStoppedError: error,
    })
  ),

  on(StreamActions.onStartConsumerThreadPoolLaunchSuccess, (state) => ({
    ...state,
    isStartStopConsumerPoolProcessRunning: false,
    isStartProcessCompleted: true,
    isStopProcessCompleted: false,
    isStartConsumerStoppedError: null,
  })),

  on(StreamActions.onStopConsumerThreadPoolLaunch, (state) => ({
    ...state,
    isStartStopConsumerPoolProcessRunning: true,
    isStartProcessCompleted: false,
    isStopProcessCompleted: false,
    isStopConsumerStoppedError: null,
  })),

  on(
    StreamActions.onStopConsumerThreadPoolLaunchFailure,
    (state, { error }) => ({
      ...state,
      isStartStopConsumerPoolProcessRunning: false,
      isStartProcessCompleted: false,
      isStopProcessCompleted: false,
      isStopConsumerStoppedError: error,
    })
  ),

  on(StreamActions.onStopConsumerThreadPoolLaunchSuccess, (state) => ({
    ...state,
    isStartStopConsumerPoolProcessRunning: false,
    isStartProcessCompleted: false,
    isStopProcessCompleted: true,
    isStopConsumerStoppedError: null,
  })),

  on(StreamActions.resetConsumerThreadPoolState, () => ({
    ...initialConsumerThreadPoolState,
  }))
);