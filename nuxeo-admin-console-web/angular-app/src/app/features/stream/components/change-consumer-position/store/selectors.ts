import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ChangeConsumerPositionState } from "./reducers";

export const selectChangeConsumerPositionState =
  createFeatureSelector<ChangeConsumerPositionState>("consumerPosition");

export const selectConsumerPositionSuccess = createSelector(
  selectChangeConsumerPositionState,
  (state) => state.consumerData
);

export const selectConsumerPositionError = createSelector(
  selectChangeConsumerPositionState,
  (state) => state.consumerError
);
