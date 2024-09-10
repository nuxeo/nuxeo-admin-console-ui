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

  it("should handle launchProbeSuccess and update a specific probe", () => {
    const initialProbesState: ProbeState = {
      probesInfo: [
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
        {
          name: "runtimeDirectories",
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
      ],
      error: null,
    };

    const updatedProbeInfo = {
      "entity-type": "probe",
      name: "ldapDirectories",
      status: {
        "entity-type": "probeStatus",
        neverExecuted: false,
        success: true,
        infos: {
          info: "Probe executed successfully",
        },
      },
      history: {
        lastRun: "2024-01-01T12:00:00.000Z",
        lastSuccess: "2024-01-01T12:00:00.000Z",
        lastFail: "",
      },
      counts: {
        run: 1,
        success: 1,
        failure: 0,
      },
      time: 100,
    };

    const action = ProbeActions.launchProbeSuccess({
      probeInfo: updatedProbeInfo,
    });

    const expectedState: ProbeState = {
      probesInfo: [
        {
          ...updatedProbeInfo,
        },
        {
          name: "runtimeDirectories",
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
      ],
      error: null,
    };
    const state = ProbeDataReducer(initialProbesState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle launchProbeFailure and set the error", () => {
    const error = new HttpErrorResponse({
      error: { message: "Probe launch failed" },
      status: 500,
      statusText: "Internal Server Error",
    });
    const action = ProbeActions.launchProbeFailure({ error });
    const expectedState: ProbeState = {
      probesInfo: [],
      error: error,
    };
    const state = ProbeDataReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });
});
