import { createReducer, on } from "@ngrx/store";
import * as StreamActions from "./actions";
import { Stream } from "../stream.interface";
import { HttpErrorResponse } from "@angular/common/http";

export interface StreamsState {
  streams: Stream[];
  consumers: { stream: string; consumer: string }[];
  records: { type?: string }[];
  isFetchPaused: boolean;
  isFetchPausedError: unknown | null;
  streamsError: HttpErrorResponse | null;
  consumersError: HttpErrorResponse | null;
  recordsError: HttpErrorResponse | null;
}

export const initialStreamsState: StreamsState = {
  streams: [],
  consumers: [],
  records: [],
  isFetchPaused: false,
  isFetchPausedError: null,
  streamsError: null,
  consumersError: null,
  recordsError: null,
};

export const streamsReducer = createReducer(
  initialStreamsState,

  // 🔹 Fetch Streams
  on(StreamActions.fetchStreams, (state) => ({
    ...state,
    streamsError: null, // Reset error only
  })),
  on(StreamActions.onFetchStreamsLaunch, (state, { streamsData }) => ({
    ...state,
    streams: streamsData, // Update streams without affecting other states
  })),
  on(StreamActions.onFetchStreamsFailure, (state, { error }) => ({
    ...state,
    streamsError: error, // Update error independently
  })),
  on(StreamActions.resetFetchStreamsState, (state) => ({
    ...state,
    streams: initialStreamsState.streams, // Reset only streams
    streamsError: null,
  })),

  // 🔹 Fetch Consumers
  on(StreamActions.fetchConsumers, (state) => ({
    ...state,
    consumersError: null, // Reset error only
  })),
  on(StreamActions.onFetchConsumersLaunch, (state, { consumersData }) => ({
    ...state,
    consumers: consumersData, // Update consumers without affecting others
  })),
  on(StreamActions.onFetchConsumersFailure, (state, { error }) => ({
    ...state,
    consumersError: error, // Update error independently
  })),
  on(StreamActions.resetFetchConsumersState, (state) => ({
    ...state,
    consumers: initialStreamsState.consumers, // Reset only consumers
    consumersError: null,
  })),

  // 🔹 Fetch Records via SSE
  on(StreamActions.triggerRecordsSSEStream, (state) => ({
    ...state,
    recordsError: null, // Reset error only
  })),
  on(StreamActions.onFetchRecordsLaunch, (state, { recordsData }) => ({
    ...state,
    records: Array.isArray(recordsData) ? recordsData : [recordsData], // Replace records
  })),
  on(StreamActions.onFetchRecordsFailure, (state, { error }) => ({
    ...state,
    recordsError: error, // Update error independently
  })),
  on(StreamActions.resetFetchRecordsState, (state) => ({
    ...state,
    records: initialStreamsState.records, // Reset only records
    recordsError: null,
  })),

  // 🔹 Pause SSE Fetching
  on(StreamActions.onPauseFetchLaunch, (state) => ({
    ...state,
    isFetchPaused: true, // Update only pause state
  })),
  on(StreamActions.onPauseFetchFailure, (state, { error }) => ({
    ...state,
    isFetchPausedError: false, // Store the error correctly
  })),
  on(StreamActions.resetPauseFetchState, (state) => ({
    ...state,
    isFetchPaused: false,
    isFetchPausedError: null
  })),
);