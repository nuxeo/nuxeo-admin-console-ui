import { ProbeDataReducer, ProbeState, initialState } from "./reducers";
import * as ProbeActions from "./actions";
import { Action } from "@ngrx/store";
import { HttpErrorResponse } from "@angular/common/http";

describe("Probe Reducer", () => {
  it("should return the initial state", () => {
    const action = {} as Action;
    const state = ProbeDataReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it("should handle loadProbesData", () => {
    const action = ProbeActions.loadProbesData();
    const expectedState: ProbeState = {
      probesInfo: [],
      error: null,
    };

    const state = ProbeDataReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle loadProbesDataSuccess", () => {
    const probesData = [
      {
        name: "ldapDirectories",
        status: {
          neverExecuted: true,
          success: false,
          infos: {
            info: "[unavailable]",
          },
        },
        history: {
          lastRun: null,
          lastSuccess: "1970-01-01T00:00:00.000Z",
          lastFail: "1970-01-01T00:00:00.000Z",
        },
        counts: {
          run: 0,
          success: 0,
          failure: 0,
        },
        time: 0,
      },
    ];
    const action = ProbeActions.loadProbesDataSuccess({
      probesData: probesData,
    });

    const expectedState: ProbeState = {
      probesInfo: probesData,
      error: null,
    };

    const state = ProbeDataReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle loadProbesDataFailure", () => {
    const error = new HttpErrorResponse({
      error: { message: "Error occurred" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = ProbeActions.loadProbesDataFailure({ error });
    const expectedState: ProbeState = {
      probesInfo: [],
      error: error,
    };

    const state = ProbeDataReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });
});
