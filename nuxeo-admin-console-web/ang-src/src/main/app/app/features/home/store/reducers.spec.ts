import { homeReducer, HomeState, initialState } from "./reducers";
import * as HomeActions from "./actions";

describe("Home Reducer", () => {
  it("should return the initial state", () => {
    const action = {} as any;
    const state = homeReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it("should handle fetchversionInfo", () => {
    const action = HomeActions.fetchversionInfo();

    const expectedState: HomeState = {
      versionInfo: {
        version: null,
        clusterEnabled: null,
      },
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchversionInfoSuccess", () => {
    const versionInfoData = { version: "1.0.0", clusterEnabled: true };
    const action = HomeActions.fetchversionInfoSuccess({
      versionInfo: versionInfoData,
    });

    const expectedState: HomeState = {
      versionInfo: versionInfoData,
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchversionInfoFailure", () => {
    const error = { message: "Error occurred" };
    const action = HomeActions.fetchversionInfoFailure({ error });

    const expectedState: HomeState = {
      versionInfo: {
        version: null,
        clusterEnabled: null,
      },
      error: error,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });
});
