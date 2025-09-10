import { HttpErrorResponse } from "@angular/common/http";
import {
  changeConsumerPositionReducer,
  initialState,
  ChangeConsumerPositionState,
  ChangeConsumerPosition,
} from "./reducers";
import * as ConsumerPositionActions from "./actions";

describe("changeConsumerPositionReducer", () => {
  const sampleData: ChangeConsumerPosition[] = [
    {
      before: {
        stream: "stream/A",
        consumer: "consumer/A",
        lag: 10,
        lags: [{ partition: 0, pos: 5, end: 15, lag: 10 }],
      },
      after: {
        stream: "stream/A",
        consumer: "consumer/A",
        lag: 2,
        lags: [{ partition: 0, pos: 13, end: 15, lag: 2 }],
      },
    },
  ];

  it("should return the initial state for an unknown action", () => {
    const action = { type: "UNKNOWN" } as any;
    const state = changeConsumerPositionReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it("onChangeConsumerPosition should clear data & error", () => {
    const populatedState: ChangeConsumerPositionState = {
      consumerError: new HttpErrorResponse({ status: 500 }),
      consumerData: sampleData,
    };
    const action = ConsumerPositionActions.onChangeConsumerPosition({
      consumerPosition: "consumer/A",
      params: { pathSegment: "beginning" },
    });
    const state = changeConsumerPositionReducer(populatedState, action);
    expect(state.consumerData).toEqual([]);
    expect(state.consumerError).toBeNull();
    expect(populatedState.consumerData).toBe(sampleData);
  });

  it("onChangeConsumerPositionFailure should set error and keep previous data", () => {
    const prevState: ChangeConsumerPositionState = {
      consumerError: null,
      consumerData: sampleData,
    };
    const error = new HttpErrorResponse({ status: 404, statusText: "Not Found" });
    const action = ConsumerPositionActions.onChangeConsumerPositionFailure({ error });
    const state = changeConsumerPositionReducer(prevState, action);
    expect(state.consumerError).toBe(error);
    expect(state.consumerData).toBe(sampleData);
    expect(prevState.consumerError).toBeNull();
  });

  it("resetConsumerPositionData should restore to empty data & null error", () => {
    const workingState: ChangeConsumerPositionState = {
      consumerError: new HttpErrorResponse({ status: 500 }),
      consumerData: sampleData,
    };
    const action = ConsumerPositionActions.resetConsumerPositionData();
    const state = changeConsumerPositionReducer(workingState, action);
    expect(state).toEqual(initialState);
    expect(workingState.consumerData).toBe(sampleData);
  });

  it("should not mutate original state objects (structural sharing check)", () => {
    const frozen = Object.freeze({ ...initialState });
    const action = ConsumerPositionActions.onChangeConsumerPositionSuccess({
      data: sampleData,
    });
    const state = changeConsumerPositionReducer(frozen, action);
    expect(state).not.toBe(frozen);
    expect(frozen.consumerData).toEqual([]); 
  });
});