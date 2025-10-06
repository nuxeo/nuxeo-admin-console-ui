import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  ChangeConsumerPositionState,
  FetchConsumerPositionState,
} from "./reducers";

export const selectChangeConsumerPositionState =
  createFeatureSelector<ChangeConsumerPositionState>("consumerPosition");

export const selectFetchConsumerPositionState =
  createFeatureSelector<FetchConsumerPositionState>("fetchConsumerPosition");

export const selectConsumerPositionSuccess = createSelector(
  selectChangeConsumerPositionState,
  (state) => state.consumerData
);

export const selectConsumerPositionError = createSelector(
  selectChangeConsumerPositionState,
  (state) => state.consumerError
);

export const selectFetchConsumerPositionSuccess = createSelector(
  selectFetchConsumerPositionState,
  (state) => state.consumerPositionData
);

export const selectFetchConsumerPositionError = createSelector(
  selectFetchConsumerPositionState,
  (state) => state.fetchConsumerError
);
