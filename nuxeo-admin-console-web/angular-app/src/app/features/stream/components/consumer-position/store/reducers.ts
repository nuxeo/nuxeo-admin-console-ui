import { createReducer, on } from "@ngrx/store";
import * as ConsumerPositionActions from "./actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface ConsumerLagInfo {
  partition: number;
  pos: number;
  end: number;
  lag: number;
}

export interface ConsumerPositionDetails {
  stream: string;
  consumer: string;
  lag: number;
  lags: ConsumerLagInfo[];
}

export interface ChangeConsumerPosition {
  before: ConsumerPositionDetails;
  after: ConsumerPositionDetails;
}

export interface ChangeConsumerPositionState {
  consumerError: HttpErrorResponse | null;
  consumerData: ChangeConsumerPosition[];
}

export const initialState: ChangeConsumerPositionState = {
  consumerError: null,
  consumerData: [],
};

export interface FetchConsumerPositionState {
  fetchConsumerError: HttpErrorResponse | null;
  consumerPositionData: ConsumerPositionDetails[];
}

export const getConsumerPositionInitialState: FetchConsumerPositionState = {
  fetchConsumerError: null,
  consumerPositionData: [],
};

export const changeConsumerPositionReducer = createReducer(
  initialState,
  on(ConsumerPositionActions.onChangeConsumerPosition, (state) => ({
    ...state,
    consumerData: [],
    consumerError: null,
  })),

  on(
    ConsumerPositionActions.onChangeConsumerPositionFailure,
    (state, { error }) => ({
      ...state,
      consumerError: error,
    })
  ),

  on(
    ConsumerPositionActions.onChangeConsumerPositionSuccess,
    (state, { data }) => ({
      ...state,
      consumerData: data,
      consumerError: null,
    })
  ),

  on(ConsumerPositionActions.resetConsumerPositionData, (state) => ({
    ...state,
    consumerError: null,
    consumerData: [],
  }))
);

export const fetchConsumerPositionReducer = createReducer(
  getConsumerPositionInitialState,
  on(ConsumerPositionActions.onFetchConsumerPosition, (state) => ({
    ...state,
    consumerPositionData: [],
    fetchConsumerError: null,
  })),

  on(
    ConsumerPositionActions.onFetchConsumerPositionSuccess,
    (state, { data }) => ({
      ...state,
      fetchConsumerError: null,
      consumerPositionData: data,
    })
  ),

  on(
    ConsumerPositionActions.onFetchConsumerPositionFailure,
    (state, { error }) => ({
      ...state,
      fetchConsumerError: error,
    })
  ),

  on(ConsumerPositionActions.resetFetchConsumerPositionData, (state) => ({
    ...state,
    fetchConsumerError: null,
    consumerPositionData: [],
  }))
);
