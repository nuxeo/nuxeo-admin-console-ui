import { createReducer, on } from "@ngrx/store";
import * as StreamActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";
import { Stream } from "../stream.interface";

export interface StreamsState {
  streams: Stream[];
  consumers: { stream: string; consumer: string }[];
  records: unknown[];
  error: unknown;
}

export const initialStreamsState: StreamsState = {
  streams: [],
  consumers: [],
  records: [],
  error: null,
};

export const streamsReducer = createReducer(
  initialStreamsState,
  on(StreamActions.fetchStreams, (state) => ({
    ...state,
    error: null,
  })),
  on(StreamActions.onFetchStreamsLaunch, (state, { streamsData }) => ({
    ...state,
    streams: streamsData,
  })),
  on(StreamActions.onFetchStreamsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(StreamActions.resetFetchStreamsState, (state) => ({
    ...state,
    streams: initialStreamsState.streams,
    error: null,
  })),
  on(StreamActions.fetchConsumers, (state) => ({
    ...state,
    error: null,
  })),
  on(StreamActions.onFetchConsumersLaunch, (state, { consumersData }) => ({
    ...state,
    consumers: consumersData,
  })),
  on(StreamActions.onFetchConsumersFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(StreamActions.resetFetchConsumersState, (state) => ({
    ...state,
    consumers: initialStreamsState.consumers,
    error: null,
  })),
  on(StreamActions.triggerRecordsSSEStream, (state) => ({
    ...state,
    error: null,
  })),
  on(StreamActions.onFetchRecordsLaunch, (state, { recordsData }) => ({
    ...state,
    records: [...state.records, Array(recordsData)],
  })),
  on(StreamActions.onFetchRecordsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(StreamActions.resetFetchRecordsState, (state) => ({
    ...state,
    records: initialStreamsState.records,
    error: null,
  }))
);
