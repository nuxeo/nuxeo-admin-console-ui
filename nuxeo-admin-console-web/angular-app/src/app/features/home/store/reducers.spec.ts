import { homeReducer, HomeState, initialState } from "./reducers";
import * as HomeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";
import { versionInfo } from "../../../shared/types/version-info.interface";

describe("Home Reducer", () => {
  it("should return the initial state", () => {
    const action = {} as Action;
    const state = homeReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it("should handle fetchversionInfo", () => {
    const action = HomeActions.fetchversionInfo();

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: [],
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchversionInfoSuccess", () => {
    const versionInfoData: versionInfo = { version: "1.0.0", clusterEnabled: true };
    const action = HomeActions.fetchversionInfoSuccess({
      versionInfo: versionInfoData,
    });

    const expectedState: HomeState = {
      versionInfo: versionInfoData,
      probesInfo: [],
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchversionInfoFailure", () => {
    const error = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = HomeActions.fetchversionInfoFailure({ error });

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: [],
      error: error,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchProbesInfo", () => {
    const action = HomeActions.fetchProbesInfo();

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: [],
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchProbesInfoSuccess", () => {
    const probesInfoData = [
      {
        name: "repositoryStatus",
        status: { success: true, neverExecuted: true, infos: { info: "" } },
        history: {
          lastRun: "",
          lastSuccess: "",
          lastFail: "",
        },
      },
    ];
    const action = HomeActions.fetchProbesInfoSuccess({
      probesInfo: probesInfoData,
    });

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: probesInfoData,
      error: null,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });

  it("should handle fetchProbesInfoFailure", () => {
    const error = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = HomeActions.fetchProbesInfoFailure({ error });

    const expectedState: HomeState = {
      versionInfo: {} as versionInfo,
      probesInfo: [],
      error: error,
    };

    const state = homeReducer(initialState, action);

    expect(state).toEqual(expectedState);
  });
});
