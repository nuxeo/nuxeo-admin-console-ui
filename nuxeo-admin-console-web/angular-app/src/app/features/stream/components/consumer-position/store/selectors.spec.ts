import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import { describe, expect, it } from "vitest";
import {
  selectChangeConsumerPositionState,
  selectConsumerPositionSuccess,
  selectConsumerPositionError,
  selectFetchConsumerPositionState,
  selectFetchConsumerPositionSuccess,
  selectFetchConsumerPositionError,
} from "./selectors";
import {
  ChangeConsumerPositionState,
  FetchConsumerPositionState,
} from "./reducers";
describe("ChangeConsumerPosition Selectors", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

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

  it("should handle error state", () => {
    const errorState: ChangeConsumerPositionState = {
      consumerData: [],
      consumerError: {
        status: 500,
        message: "Failed to change consumer position",
      } as any,
    };
    const state = { consumerPosition: errorState } as any;
    expect(selectConsumerPositionError(state)).toEqual({
      status: 500,
      message: "Failed to change consumer position",
    });
  });
});

describe("FetchConsumerPosition Selectors", () => {
  const initialFetchState: FetchConsumerPositionState = {
    consumerPositionData: [
      {
        stream: "mock",
        consumer: "mock/recomputeThumbnails",
        lag: 0,
        lags: [
          {
            partition: 0,
            pos: 100,
            end: 100,
            lag: 0,
          },
        ],
      },
    ],
    fetchConsumerError: null,
  };

  it("should select the fetch feature state", () => {
    const state = { fetchConsumerPosition: initialFetchState } as any;
    expect(selectFetchConsumerPositionState(state)).toEqual(initialFetchState);
  });

  it("should select fetch consumer position success", () => {
    const state = { fetchConsumerPosition: initialFetchState } as any;
    expect(selectFetchConsumerPositionSuccess(state)).toEqual(
      initialFetchState.consumerPositionData
    );
  });

  it("should select fetch consumer position error", () => {
    const state = { fetchConsumerPosition: initialFetchState } as any;
    expect(selectFetchConsumerPositionError(state)).toBeNull();
  });

  it("should handle undefined consumerPositionData", () => {
    const state = {
      fetchConsumerPosition: {
        ...initialFetchState,
        consumerPositionData: undefined,
      },
    } as any;
    expect(selectFetchConsumerPositionSuccess(state)).toBeUndefined();
  });

  it("should handle fetch error state", () => {
    const errorState: FetchConsumerPositionState = {
      consumerPositionData: [],
      fetchConsumerError: {
        status: 404,
        message: "Failed to fetch consumer position",
      } as any,
    };
    const state = { fetchConsumerPosition: errorState } as any;
    expect(selectFetchConsumerPositionError(state)).toEqual({
      status: 404,
      message: "Failed to fetch consumer position",
    });
  });
});
