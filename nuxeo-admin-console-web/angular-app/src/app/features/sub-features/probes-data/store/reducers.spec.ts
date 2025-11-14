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
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
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
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
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
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
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
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
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
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
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
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
    };
    const state = ProbeDataReducer(initialState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle launchAllProbes and reset launchAllProbeError and isLaunchProbeSuccess", () => {
    const prevState: ProbeState = {
      probesInfo: [],
      error: null,
      launchAllProbeError: new HttpErrorResponse({ error: "Mock error" }),
      showLaunchAllSuccessSnackbar: true,
    };
    const action = ProbeActions.launchAllProbes();
    const expectedState: ProbeState = {
      ...prevState,
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
    };
    const state = ProbeDataReducer(prevState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle launchAllProbesSuccess and update probesInfo and isLaunchProbeSuccess", () => {
    const probesData = [
      {
        name: "probeA",
        status: { neverExecuted: false, success: true, infos: { info: "ok" } },
        history: {
          lastRun: "2024-01-01T12:00:00.000Z",
          lastSuccess: "2024-01-01T12:00:00.000Z",
          lastFail: "",
        },
        counts: { run: 1, success: 1, failure: 0 },
      },
    ];
    const prevState: ProbeState = {
      probesInfo: [],
      error: null,
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: false,
    };
    const action = ProbeActions.launchAllProbesSuccess({ probesData });
    const expectedState: ProbeState = {
      ...prevState,
      probesInfo: probesData,
      showLaunchAllSuccessSnackbar: true,
    };
    const state = ProbeDataReducer(prevState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle launchAllProbesFailure and set launchAllProbeError and isLaunchProbeSuccess to false", () => {
    const error = new HttpErrorResponse({
      error: "Launch all failed",
      status: 500,
    });
    const prevState: ProbeState = {
      probesInfo: [],
      error: null,
      launchAllProbeError: null,
      showLaunchAllSuccessSnackbar: true,
    };
    const action = ProbeActions.launchAllProbesFailure({ error });
    const expectedState: ProbeState = {
      ...prevState,
      launchAllProbeError: error,
      showLaunchAllSuccessSnackbar: false,
    };
    const state = ProbeDataReducer(prevState, action);
    expect(state).toEqual(expectedState);
  });

  it("should handle resetLaunchAllProbesState and reset isLaunchProbeSuccess and launchAllProbeError", () => {
    const prevState: ProbeState = {
      probesInfo: [],
      error: null,
      launchAllProbeError: new HttpErrorResponse({ error: "Mock error" }),
      showLaunchAllSuccessSnackbar: true,
    };
    const action = ProbeActions.resetLaunchAllProbesState();
    const expectedState: ProbeState = {
      ...prevState,
      showLaunchAllSuccessSnackbar: false,
      launchAllProbeError: null,
    };
    const state = ProbeDataReducer(prevState, action);
    expect(state).toEqual(expectedState);
  });
});

