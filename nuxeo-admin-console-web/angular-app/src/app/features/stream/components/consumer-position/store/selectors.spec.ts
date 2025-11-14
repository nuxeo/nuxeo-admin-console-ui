import {
  selectChangeConsumerPositionState,
  selectConsumerPositionSuccess,
  selectConsumerPositionError,
} from "./selectors";
import { ChangeConsumerPositionState } from "./reducers";

describe("ChangeConsumerPosition Selectors", () => {
  const initialState: ChangeConsumerPositionState = {
    consumerData: [
      {
        before: {
          consumer: "mock/recomputeThumbnails",
          stream: "mock",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
        after: {
          stream: "mock",
          consumer: "mock/recomputeThumbnails",
          lag: 0,
          lags: [
            {
              partition: 0,
              pos: 0,
              end: 0,
              lag: 0,
            },
          ],
        },
      },
    ],
    consumerError: null,
  };

  it("should select the feature state", () => {
    const state = { consumerPosition: initialState } as any;
    expect(selectChangeConsumerPositionState(state)).toEqual(initialState);
  });

  it("should select consumer position success", () => {
    const state = { consumerPosition: initialState } as any;
    expect(selectConsumerPositionSuccess(state)).toEqual(
      initialState.consumerData
    );
  });

  it("should select consumer position error", () => {
    const state = { consumerPosition: initialState } as any;
    expect(selectConsumerPositionError(state)).toBeNull();
  });

  it("should handle undefined consumerData", () => {
    const state = {
      consumerPosition: { ...initialState, consumerData: undefined },
    } as any;
    expect(selectConsumerPositionSuccess(state)).toBeUndefined();
  });
});
